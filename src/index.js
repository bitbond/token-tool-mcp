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

const server = new McpServer({
  name: 'bitbond-token-tool',
  version: '1.0.0',
});

// ── Helper ──────────────────────────────────────────────────────────────────
function requireKey() {
  if (!PRIVATE_KEY) throw new Error('BITBOND_PRIVATE_KEY env var not set');
  return PRIVATE_KEY;
}

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
server.registerTool(
  'list_chains',
  {
    description: 'List all supported blockchain networks for token deployment',
  },
  async () => run(() => ({
    chains: listChains(),
    note: 'Use the "key" value (e.g. "ethereum", "polygon") in other tools.',
  }))
);

// ── Tool: estimate_cost ─────────────────────────────────────────────────────
server.registerTool(
  'estimate_cost',
  {
    description: 'Get the cost to deploy a token on a given chain before committing',
    inputSchema: {
      chain: z.string().describe('Chain name (e.g. "ethereum", "polygon", "base", "sepolia")'),
      mintable: z.boolean().optional().describe('Include mintable feature'),
      burnable: z.boolean().optional().describe('Include burnable feature'),
      pausable: z.boolean().optional().describe('Include pausable feature'),
    },
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
server.registerTool(
  'deploy_token',
  {
    description: 'Deploy a new ERC20 token using Bitbond Token Tool. CertiK-audited contracts, multi-chain support.',
    inputSchema: {
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
  },
  async (params) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(params.chain);
      const result = await deployToken(
        {
          name: params.name,
          symbol: params.symbol,
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
        },
        chain,
        pk
      );
      return result;
    })
);

// ── Tool: get_token_info ────────────────────────────────────────────────────
server.registerTool(
  'get_token_info',
  {
    description: 'Get live on-chain info for any token contract (name, symbol, supply, paused state, owner)',
    inputSchema: {
      contract_address: z.string().describe('Token contract address (0x...)'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      const chain = resolveChain(chainInput);
      return getTokenInfo(contract_address, chain, PRIVATE_KEY);
    })
);

// ── Tool: list_deployed_tokens ──────────────────────────────────────────────
server.registerTool(
  'list_deployed_tokens',
  {
    description: 'List all tokens deployed via this MCP server (local registry)',
    inputSchema: {
      chain: z.string().optional().describe('Filter by chain (optional)'),
    },
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
server.registerTool(
  'transfer_tokens',
  {
    description: 'Transfer tokens from your wallet to another address',
    inputSchema: {
      contract_address: z.string().describe('Token contract address'),
      to: z.string().describe('Recipient wallet address'),
      amount: z.string().describe('Amount to transfer (human-readable, e.g. "1000")'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, to, amount, chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      return transferTokens(contract_address, to, amount, chain, pk);
    })
);

// ── Tool: mint_tokens ───────────────────────────────────────────────────────
server.registerTool(
  'mint_tokens',
  {
    description: 'Mint additional tokens (only works if token was deployed with mintable=true)',
    inputSchema: {
      contract_address: z.string().describe('Token contract address'),
      to: z.string().describe('Address to receive minted tokens'),
      amount: z.string().describe('Amount to mint (human-readable)'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, to, amount, chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      return mintTokens(contract_address, to, amount, chain, pk);
    })
);

// ── Tool: burn_tokens ───────────────────────────────────────────────────────
server.registerTool(
  'burn_tokens',
  {
    description: 'Burn/destroy tokens from your balance (only works if token was deployed with burnable=true)',
    inputSchema: {
      contract_address: z.string().describe('Token contract address'),
      amount: z.string().describe('Amount to burn (human-readable)'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, amount, chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      return burnTokens(contract_address, amount, chain, pk);
    })
);

// ── Tool: pause_token ───────────────────────────────────────────────────────
server.registerTool(
  'pause_token',
  {
    description: 'Pause all token transfers — emergency stop (only works if pausable=true)',
    inputSchema: {
      contract_address: z.string().describe('Token contract address'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      return pauseToken(contract_address, chain, pk);
    })
);

// ── Tool: unpause_token ─────────────────────────────────────────────────────
server.registerTool(
  'unpause_token',
  {
    description: 'Resume token transfers after a pause',
    inputSchema: {
      contract_address: z.string().describe('Token contract address'),
      chain: z.string().describe('Chain the token is on'),
    },
  },
  async ({ contract_address, chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      return unpauseToken(contract_address, chain, pk);
    })
);

// ── Tool: get_wallet_info ───────────────────────────────────────────────────
server.registerTool(
  'get_wallet_info',
  {
    description: 'Get the deployer wallet address and balance on a given chain',
    inputSchema: {
      chain: z.string().describe('Chain to check balance on'),
    },
  },
  async ({ chain: chainInput }) =>
    run(async () => {
      const pk = requireKey();
      const chain = resolveChain(chainInput);
      const wallet = new ethers.Wallet(pk);
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
