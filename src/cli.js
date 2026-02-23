#!/usr/bin/env node
/**
 * Bitbond Token Tool CLI
 * Deploy and manage ERC20 tokens from the command line.
 *
 * Usage:
 *   BITBOND_PRIVATE_KEY=0x... npx token-tool <command> [options]
 *
 * Commands:
 *   chains                          List supported chains
 *   cost     --chain <chain>        Estimate deployment cost
 *   deploy   --chain <chain> --name <name> --symbol <sym> --supply <n> [options]
 *   info     --chain <chain> --address <addr>
 *   transfer --chain <chain> --address <addr> --to <addr> --amount <n>
 *   mint     --chain <chain> --address <addr> --to <addr> --amount <n>
 *   burn     --chain <chain> --address <addr> --amount <n>
 *   pause    --chain <chain> --address <addr>
 *   unpause  --chain <chain> --address <addr>
 *   wallet                          Show wallet address and balances
 *   registry                        List all deployed tokens
 */

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

// ── Arg parsing ──────────────────────────────────────────────
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function need(args, key, label) {
  if (!args[key]) {
    console.error(`Error: --${key} (${label}) is required.`);
    process.exit(1);
  }
  return args[key];
}

function needKey() {
  if (!PRIVATE_KEY) {
    console.error('Error: Set BITBOND_PRIVATE_KEY environment variable.');
    process.exit(1);
  }
  return PRIVATE_KEY;
}

function out(data) {
  console.log(JSON.stringify(data, null, 2));
}

// ── Commands ─────────────────────────────────────────────────
async function cmdChains() {
  out(listChains());
}

async function cmdCost(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const wallet = new ethers.Wallet(pk);
  const result = await estimateCost(chain.id, wallet.address, {
    mintable: args.mintable === 'true' || args.mintable === true,
    burnable: args.burnable === 'true' || args.burnable === true,
    pausable: args.pausable === 'true' || args.pausable === true,
  });
  out({
    chain: chain.name,
    costUsd: result.totalUSD,
    costNative: ethers.formatEther(result.totalWei) + ' ' + chain.symbol,
  });
}

async function cmdDeploy(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const config = {
    name: need(args, 'name', 'token name'),
    symbol: need(args, 'symbol', 'token symbol'),
    initialSupply: need(args, 'supply', 'initial supply'),
    decimals: args.decimals || '18',
    mintable: args.mintable === 'true' || args.mintable === true,
    burnable: args.burnable === 'true' || args.burnable === true,
    pausable: args.pausable === 'true' || args.pausable === true,
    whitelist: args.whitelist === 'true' || args.whitelist === true,
    blacklist: args.blacklist === 'true' || args.blacklist === true,
    forceTransfer: args['force-transfer'] === 'true' || args['force-transfer'] === true,
    documentUri: args['document-uri'] || '',
    maxSupply: args['max-supply'] || undefined,
    discountCode: args['discount-code'] || undefined,
    owner: args.owner || undefined,
  };
  console.error(`Deploying ${config.name} (${config.symbol}) on ${chain.name}...`);
  const result = await deployToken(config, chain, pk);
  out(result);
}

async function cmdInfo(args) {
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const result = await getTokenInfo(address, chain, PRIVATE_KEY);
  out(result);
}

async function cmdTransfer(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const to = need(args, 'to', 'recipient address');
  const amount = need(args, 'amount', 'amount');
  const result = await transferTokens(address, to, amount, chain, pk);
  out(result);
}

async function cmdMint(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const to = need(args, 'to', 'recipient address');
  const amount = need(args, 'amount', 'amount');
  const result = await mintTokens(address, to, amount, chain, pk);
  out(result);
}

async function cmdBurn(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const amount = need(args, 'amount', 'amount');
  const result = await burnTokens(address, amount, chain, pk);
  out(result);
}

async function cmdPause(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const result = await pauseToken(address, chain, pk);
  out(result);
}

async function cmdUnpause(args) {
  const pk = needKey();
  const chain = resolveChain(need(args, 'chain', 'chain'));
  const address = need(args, 'address', 'contract address');
  const result = await unpauseToken(address, chain, pk);
  out(result);
}

async function cmdWallet() {
  const pk = needKey();
  const wallet = new ethers.Wallet(pk);
  out({ address: wallet.address });
}

async function cmdRegistry() {
  out(loadRegistry());
}

function showHelp() {
  console.log(`Bitbond Token Tool CLI — deploy & manage ERC20 tokens

Usage: token-tool <command> [options]

Commands:
  chains                                    List supported chains
  cost     --chain <chain>                  Estimate deployment cost
  deploy   --chain <chain> --name <n> --symbol <s> --supply <n>
           [--decimals 18] [--mintable] [--burnable] [--pausable]
           [--whitelist] [--blacklist] [--force-transfer]
           [--document-uri <uri>] [--max-supply <n>] [--owner <addr>]
           [--discount-code <code>]
  info     --chain <chain> --address <addr>
  transfer --chain <chain> --address <addr> --to <addr> --amount <n>
  mint     --chain <chain> --address <addr> --to <addr> --amount <n>
  burn     --chain <chain> --address <addr> --amount <n>
  pause    --chain <chain> --address <addr>
  unpause  --chain <chain> --address <addr>
  wallet                                    Show wallet address
  registry                                  List deployed tokens

Environment:
  BITBOND_PRIVATE_KEY    Deployer wallet private key (required for write ops)

Examples:
  token-tool chains
  token-tool cost --chain sepolia
  token-tool deploy --chain sepolia --name "Test Token" --symbol TST --supply 1000000 --mintable --burnable
  token-tool info --chain sepolia --address 0x...
  token-tool registry
`);
}

// ── Main ─────────────────────────────────────────────────────
const COMMANDS = {
  chains: cmdChains,
  cost: cmdCost,
  deploy: cmdDeploy,
  info: cmdInfo,
  transfer: cmdTransfer,
  mint: cmdMint,
  burn: cmdBurn,
  pause: cmdPause,
  unpause: cmdUnpause,
  wallet: cmdWallet,
  registry: cmdRegistry,
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];

  if (!cmd || args.help || cmd === 'help') {
    showHelp();
    process.exit(0);
  }

  const fn = COMMANDS[cmd];
  if (!fn) {
    console.error(`Unknown command: ${cmd}\nRun 'token-tool help' for usage.`);
    process.exit(1);
  }

  try {
    await fn(args);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
