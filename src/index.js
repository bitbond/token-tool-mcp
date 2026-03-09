#!/usr/bin/env node
/**
 * Bitbond Token Tool MCP Server
 * Gives AI agents a complete token issuance + lifecycle management API
 *
 * Usage:
 *   BITBOND_PRIVATE_KEY=0x... node src/index.js
 *
 * Claude Desktop config (~/.claude/claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "token-tool": {
 *         "command": "node",
 *         "args": ["/path/to/token-tool-mcp/src/index.js"],
 *         "env": { "BITBOND_PRIVATE_KEY": "0x..." }
 *       }
 *     }
 *   }
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const { resolveChain, listChains } = require('./chains');
const {
  estimateCost,
  deployToken,
  getTokenInfo,
  transferTokens,
  mintTokens,
  burnTokens,
  pauseToken,
  unpauseToken,
  loadRegistry,
  ethers,
} = require('./tokenTool');

const PRIVATE_KEY = process.env.BITBOND_PRIVATE_KEY;
const SOLANA_KEYPAIR = process.env.BITBOND_SOLANA_KEYPAIR;
const STELLAR_SECRET = process.env.BITBOND_STELLAR_SECRET;

const solana = require('./solana');
const stellar = require('./stellar');

const server = new McpServer({
  name: 'bitbond-token-tool',
  version: '1.1.0',
});

// ── Helper ──────────────────────────────────────────────────────────────────
function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}
function err(msg) {
  return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
}
async function run(fn) {
  try { return ok(await fn()); }
  catch (e) { return err(e.message); }
}

// ── Tool: list_chains ───────────────────────────────────────────────────────
server.tool(
  'list_chains',
  'List all supported blockchain networks for token deployment',
  {},
  async () => run(() => ({
    chains: listChains(),
    note: 'Use the "key" value (e.g. "ethereum", "polygon") in other tools.',
  }))
);

// ── Tool: estimate_cost ─────────────────────────────────────────────────────
server.tool(
  'estimate_cost',
  'Get the cost to deploy a token on a given chain before committing',
  {
    chain: z.string().describe('Chain name (e.g. "ethereum", "polygon", "base", "sepolia")'),
    mintable: z.boolean().optional().describe('Include mintable feature'),
    burnable: z.boolean().optional().describe('Include burnable feature'),
    pausable: z.boolean().optional().describe('Include pausable feature'),
  },
  async ({ chain: chainInput, mintable, burnable, pausable }) =>
    run(async () => {
      const chain = resolveChain(chainInput);
      const wallet = ethers.Wallet.createRandom(); // temp wallet for estimate
      const result = await estimateCost(chain.id, wallet.address, { mintable, burnable, pausable });
      return {
        chain: chain.name,
        costUsd: result.totalUSD,
        costNative: ethers.formatEther(result.totalWei),
        nativeSymbol: chain.symbol,
        note: 'Cost is paid from your wallet at deployment time.',
      };
    })
);

// ── Tool: deploy_token ──────────────────────────────────────────────────────
server.tool(
  'deploy_token',
  'Deploy a new token using Bitbond Token Tool. Supports EVM chains (ERC20, CertiK-audited), Solana (SPL tokens), and Stellar (assets).',
  {
    name: z.string().describe('Token name (e.g. "My Token")'),
    symbol: z.string().describe('Token symbol/ticker (e.g. "MTK")'),
    supply: z.string().describe('Initial token supply as a number (e.g. "1000000")'),
    chain: z.string().describe('Chain to deploy on (e.g. "ethereum", "polygon", "base", "sepolia")'),
    decimals: z.string().optional().default('18').describe('Token decimals (default: 18)'),
    mintable: z.boolean().optional().describe('Allow minting more tokens after deployment'),
    burnable: z.boolean().optional().describe('Allow burning/destroying tokens'),
    pausable: z.boolean().optional().describe('Allow pausing all transfers (emergency stop)'),
    whitelist: z.boolean().optional().describe('Enable whitelist — only approved addresses can hold tokens'),
    blacklist: z.boolean().optional().describe('Enable blacklist — block specific addresses'),
    force_transfer: z.boolean().optional().describe('Allow owner to force-transfer tokens (compliance)'),
    document_uri: z.string().optional().describe('URI to legal document or prospectus'),
    max_supply: z.string().optional().describe('Maximum total supply cap'),
    discount_code: z.string().optional().describe('Bitbond discount code if you have one'),
  },
  async (params) =>
    run(async () => {
      const chain = resolveChain(params.chain);
      const tokenConfig = {
        name: params.name,
        symbol: params.symbol,
        supply: params.supply,
        initialSupply: params.supply,
        decimals: params.decimals || '18',
        mintable: params.mintable,
        burnable: params.burnable,
        pausable: params.pausable,
        whitelist: params.whitelist,
        blacklist: params.blacklist,
        forceTransfer: params.force_transfer,
        documentUri: params.document_uri,
        maxSupply: params.max_supply,
        discountCode: params.discount_code,
      };

      if (chain.type === 'solana') {
        if (!SOLANA_KEYPAIR) throw new Error('BITBOND_SOLANA_KEYPAIR env var not set (base58 secret key).');
        return solana.deployToken(tokenConfig, chain, SOLANA_KEYPAIR);
      }

      if (chain.type === 'stellar') {
        if (!STELLAR_SECRET) throw new Error('BITBOND_STELLAR_SECRET env var not set (Stellar secret key starting with S...).');
        return stellar.deployToken(tokenConfig, chain, STELLAR_SECRET);
      }

      // EVM fallback
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      return deployToken(tokenConfig, chain, PRIVATE_KEY);
    })
);

// ── Tool: get_token_info ────────────────────────────────────────────────────
server.tool(
  'get_token_info',
  'Get live on-chain info for any token contract (name, symbol, supply, paused state, owner)',
  {
    contract_address: z.string().describe('Token contract address (0x...)'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      const chain = resolveChain(chainInput);
      if (chain.type === 'solana') {
        return solana.getTokenInfo(contract_address, chain);
      }
      if (chain.type === 'stellar') {
        // contract_address format: "CODE:ISSUER"
        const [assetCode, issuerAddress] = contract_address.includes(':')
          ? contract_address.split(':')
          : [contract_address, null];
        if (!issuerAddress) throw new Error('For Stellar, use format "ASSETCODE:ISSUER_ADDRESS"');
        return stellar.getTokenInfo(assetCode, issuerAddress, chain);
      }
      return getTokenInfo(contract_address, chain, PRIVATE_KEY);
    })
);

// ── Tool: list_deployed_tokens ──────────────────────────────────────────────
server.tool(
  'list_deployed_tokens',
  'List all tokens deployed via this MCP server (local registry)',
  {
    chain: z.string().optional().describe('Filter by chain (optional)'),
  },
  async ({ chain: chainInput }) =>
    run(async () => {
      let registry = loadRegistry();
      if (chainInput) {
        const chain = resolveChain(chainInput);
        registry = registry.filter(t => t.chainId === chain.id);
      }
      return { count: registry.length, tokens: registry };
    })
);

// ── Tool: transfer_tokens ───────────────────────────────────────────────────
server.tool(
  'transfer_tokens',
  'Transfer tokens from your wallet to another address',
  {
    contract_address: z.string().describe('Token contract address'),
    to: z.string().describe('Recipient wallet address'),
    amount: z.string().describe('Amount to transfer (human-readable, e.g. "1000")'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, to, amount, chain: chainInput }) =>
    run(async () => {
      const chain = resolveChain(chainInput);
      if (chain.type === 'solana') {
        if (!SOLANA_KEYPAIR) throw new Error('BITBOND_SOLANA_KEYPAIR env var not set');
        return solana.transferTokens(contract_address, to, amount, chain, SOLANA_KEYPAIR);
      }
      if (chain.type === 'stellar') {
        if (!STELLAR_SECRET) throw new Error('BITBOND_STELLAR_SECRET env var not set');
        const [assetCode, issuerAddress] = contract_address.split(':');
        return stellar.transferTokens(assetCode, issuerAddress, to, amount, chain, STELLAR_SECRET);
      }
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      return transferTokens(contract_address, to, amount, chain, PRIVATE_KEY);
    })
);

// ── Tool: mint_tokens ───────────────────────────────────────────────────────
server.tool(
  'mint_tokens',
  'Mint additional tokens (only works if token was deployed with mintable=true)',
  {
    contract_address: z.string().describe('Token contract address'),
    to: z.string().describe('Address to receive minted tokens'),
    amount: z.string().describe('Amount to mint (human-readable)'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, to, amount, chain: chainInput }) =>
    run(async () => {
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      const chain = resolveChain(chainInput);
      return mintTokens(contract_address, to, amount, chain, PRIVATE_KEY);
    })
);

// ── Tool: burn_tokens ───────────────────────────────────────────────────────
server.tool(
  'burn_tokens',
  'Burn/destroy tokens from your balance (only works if token was deployed with burnable=true)',
  {
    contract_address: z.string().describe('Token contract address'),
    amount: z.string().describe('Amount to burn (human-readable)'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, amount, chain: chainInput }) =>
    run(async () => {
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      const chain = resolveChain(chainInput);
      return burnTokens(contract_address, amount, chain, PRIVATE_KEY);
    })
);

// ── Tool: pause_token ───────────────────────────────────────────────────────
server.tool(
  'pause_token',
  'Pause all token transfers — emergency stop (only works if pausable=true)',
  {
    contract_address: z.string().describe('Token contract address'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      const chain = resolveChain(chainInput);
      return pauseToken(contract_address, chain, PRIVATE_KEY);
    })
);

// ── Tool: unpause_token ─────────────────────────────────────────────────────
server.tool(
  'unpause_token',
  'Resume token transfers after a pause',
  {
    contract_address: z.string().describe('Token contract address'),
    chain: z.string().describe('Chain the token is on'),
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      const chain = resolveChain(chainInput);
      return unpauseToken(contract_address, chain, PRIVATE_KEY);
    })
);

// ── Tool: get_wallet_info ───────────────────────────────────────────────────
server.tool(
  'get_wallet_info',
  'Get the deployer wallet address and balance on a given chain',
  {
    chain: z.string().describe('Chain to check balance on'),
  },
  async ({ chain: chainInput }) =>
    run(async () => {
      const chain = resolveChain(chainInput);
      if (chain.type === 'solana') {
        if (!SOLANA_KEYPAIR) throw new Error('BITBOND_SOLANA_KEYPAIR env var not set');
        return solana.getWalletInfo(chain, SOLANA_KEYPAIR);
      }
      if (chain.type === 'stellar') {
        if (!STELLAR_SECRET) throw new Error('BITBOND_STELLAR_SECRET env var not set');
        return stellar.getWalletInfo(chain, STELLAR_SECRET);
      }
      if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
      const wallet = new ethers.Wallet(PRIVATE_KEY);
      const provider = new ethers.JsonRpcProvider(chain.rpc);
      const balance = await provider.getBalance(wallet.address);
      return {
        address: wallet.address,
        chain: chain.name,
        balance: ethers.formatEther(balance),
        symbol: chain.symbol,
        explorerUrl: `${chain.explorer}/address/${wallet.address}`,
      };
    })
);

// ── Start ───────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('Bitbond Token Tool MCP server running (stdio)\n');
}

main().catch(e => {
  process.stderr.write(`Fatal: ${e.message}\n`);
  process.exit(1);
});
