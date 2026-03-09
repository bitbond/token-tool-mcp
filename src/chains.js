/**
 * Chain registry — maps human-readable names to chain IDs, RPCs, and factory addresses
 */

const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://ethereum.publicnode.com',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpc: 'https://polygon-bor-rpc.publicnode.com',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  bnb: {
    id: 56,
    name: 'BNB Chain',
    rpc: 'https://bsc-rpc.publicnode.com',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    rpc: 'https://arbitrum-one-rpc.publicnode.com',
    explorer: 'https://arbiscan.io',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  base: {
    id: 8453,
    name: 'Base',
    rpc: 'https://base-rpc.publicnode.com',
    explorer: 'https://basescan.org',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpc: 'https://optimism-rpc.publicnode.com',
    explorer: 'https://optimistic.etherscan.io',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche C-Chain',
    rpc: 'https://avalanche-c-chain-rpc.publicnode.com',
    explorer: 'https://snowtrace.io',
    symbol: 'AVAX',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpc: 'https://ethereum-sepolia.publicnode.com',
    explorer: 'https://sepolia.etherscan.io',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
    testnet: true,
  },
  'base-sepolia': {
    id: 84532,
    name: 'Base Sepolia Testnet',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    symbol: 'ETH',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
    testnet: true,
  },
  'bnb-testnet': {
    id: 97,
    name: 'BNB Smart Chain Testnet',
    rpc: 'https://bsc-testnet-rpc.publicnode.com',
    explorer: 'https://testnet.bscscan.com',
    symbol: 'tBNB',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
    testnet: true,
  },

  peaq: {
    id: 3338,
    name: 'Peaq',
    rpc: 'https://peaq.api.onfinality.io/public',
    explorer: 'https://peaq.subscan.io',
    symbol: 'PEAQ',
    factoryAddress: '0x4904Ba3148147D2f78b05a8446C01c48a7ABa4bd',
  },

  // ── Solana ────────────────────────────────────────────────────────────────
  solana: {
    type: 'solana',
    name: 'Solana',
    cluster: 'mainnet-beta',
    rpc: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    symbol: 'SOL',
  },
  'solana-devnet': {
    type: 'solana',
    name: 'Solana Devnet',
    cluster: 'devnet',
    rpc: 'https://api.devnet.solana.com',
    explorer: 'https://solscan.io',
    symbol: 'SOL',
    testnet: true,
  },

  // ── Stellar ───────────────────────────────────────────────────────────────
  stellar: {
    type: 'stellar',
    name: 'Stellar',
    network: 'mainnet',
    explorer: 'https://stellar.expert/explorer/public',
    symbol: 'XLM',
  },
  'stellar-testnet': {
    type: 'stellar',
    name: 'Stellar Testnet',
    network: 'testnet',
    explorer: 'https://stellar.expert/explorer/testnet',
    symbol: 'XLM',
    testnet: true,
  },
};

// Aliases
const ALIASES = {
  eth: 'ethereum',
  mainnet: 'ethereum',
  'ethereum mainnet': 'ethereum',
  'bnb chain': 'bnb',
  bsc: 'bnb',
  'binance smart chain': 'bnb',
  matic: 'polygon',
  'arbitrum one': 'arbitrum',
  arb: 'arbitrum',
  avax: 'avalanche',
  'avalanche c-chain': 'avalanche',
  test: 'sepolia',
  testnet: 'sepolia',
  'base sepolia': 'base-sepolia',
  'basesepolia': 'base-sepolia',
  'bnb test': 'bnb-testnet',
  'bsc testnet': 'bnb-testnet',
  'chapel': 'bnb-testnet',
  // Peaq
  'peaq network': 'peaq',
  'depin': 'peaq',
  // Solana
  'sol': 'solana',
  'solana mainnet': 'solana',
  'solana devnet': 'solana-devnet',
  'devnet': 'solana-devnet',
  // Stellar
  'xlm': 'stellar',
  'stellar mainnet': 'stellar',
  'stellar test': 'stellar-testnet',
};

function resolveChain(input) {
  const key = input.toLowerCase().trim();
  const resolved = ALIASES[key] || key;
  const chain = CHAINS[resolved];
  if (!chain) {
    const available = Object.keys(CHAINS).join(', ');
    throw new Error(`Unknown chain "${input}". Available: ${available}`);
  }
  return chain;
}

function listChains() {
  return Object.entries(CHAINS).map(([key, c]) => ({
    key,
    name: c.name,
    id: c.id,
    symbol: c.symbol,
    testnet: c.testnet || false,
  }));
}

module.exports = { CHAINS, resolveChain, listChains };
