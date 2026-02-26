/**
 * Bitbond Token Tool API wrapper + on-chain execution
 */
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://tokentool.bitbond.com/api';

const FACTORY_ABI = [
  'function deployContract(bytes calldata bytecode, bytes calldata signature, uint256 _salt, uint40 expiresAt) external payable returns (address)',
];

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  // Mintable
  'function mint(address to, uint256 amount)',
  // Burnable
  'function burn(uint256 amount)',
  'function burnFrom(address account, uint256 amount)',
  // Pausable
  'function pause()',
  'function unpause()',
  'function paused() view returns (bool)',
  // Ownership
  'function owner() view returns (address)',
];

// Registry path — use ~/.token-tool-mcp/ for global installs, local data/ for dev
const REGISTRY_DIR = process.env.TOKEN_TOOL_DATA_DIR ||
  (fs.existsSync(path.join(__dirname, '../package.json'))
    ? path.join(__dirname, '../data')
    : path.join(require('os').homedir(), '.token-tool-mcp'));
const REGISTRY_PATH = path.join(REGISTRY_DIR, 'registry.json');

function loadRegistry() {
  try {
    const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw new Error(`Failed to load registry at ${REGISTRY_PATH}: ${e.message}`);
  }
}

function saveRegistry(registry) {
  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

function addToRegistry(entry) {
  const registry = loadRegistry();
  registry.unshift(entry);
  saveRegistry(registry);
}

function validateAddress(addr, label = 'Address') {
  if (!addr || !ethers.isAddress(addr)) {
    throw new Error(`${label} "${addr}" is not a valid Ethereum address.`);
  }
  return ethers.getAddress(addr); // checksummed
}

function getWallet(privateKey) {
  if (!privateKey) throw new Error('No private key. Set BITBOND_PRIVATE_KEY env var.');
  return new ethers.Wallet(privateKey);
}

function getProvider(chain) {
  return new ethers.JsonRpcProvider(chain.rpc);
}

const TX_TIMEOUT_MS = 120_000; // 2 minutes

async function waitForTx(tx, chain) {
  let timer;
  const receipt = await Promise.race([
    tx.wait(),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(
        `Transaction timed out after ${TX_TIMEOUT_MS / 1000}s. It may still confirm later. ` +
        `tx: ${tx.hash} — check: ${chain.explorer}/tx/${tx.hash}`
      )), TX_TIMEOUT_MS);
    }),
  ]);
  clearTimeout(timer);
  return receipt;
}

async function getSignedContract(contractAddress, chain, privateKey) {
  contractAddress = validateAddress(contractAddress, 'Contract address');
  const wallet = getWallet(privateKey);
  const provider = getProvider(chain);
  const signer = wallet.connect(provider);
  return { contract: new ethers.Contract(contractAddress, ERC20_ABI, signer), provider };
}

async function prepareDeployment(tokenConfig, chainId, deployerAddress) {
  const payload = {
    chainId,
    constructorArgs: [
      tokenConfig.name,
      tokenConfig.symbol,
      tokenConfig.initialSupply,
      tokenConfig.decimals || '18',
      tokenConfig.owner || deployerAddress,
      {
        _isMintable: tokenConfig.mintable || false,
        _isBurnable: tokenConfig.burnable || false,
        _isPausable: tokenConfig.pausable || false,
        _isBlacklistEnabled: tokenConfig.blacklist || false,
        _isDocumentAllowed: !!tokenConfig.documentUri,
        _isWhitelistEnabled: tokenConfig.whitelist || false,
        _isMaxSupplySet: !!tokenConfig.maxSupply,
        _isMaxAmountOfTokensSet: false,
        _isForceTransferAllowed: tokenConfig.forceTransfer || false,
        _isTaxable: false,
        _isDeflationary: false,
      },
      tokenConfig.documentUri || '',
      tokenConfig.owner || deployerAddress,
      [0, 0],
      [tokenConfig.maxSupply ? tokenConfig.maxSupply.toString() : '0', '0'],
    ],
    contractName: 'BitbondTokenToolAssetToken',
    userAddress: deployerAddress,
    discountCode: tokenConfig.discountCode,
  };

  const res = await fetch(`${API_BASE}/contract-utils/prepare-deployment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Token Tool API error ${res.status}: ${text}`);

  const data = JSON.parse(text);
  if (!data.success) throw new Error(`API returned failure: ${text}`);

  return {
    ...data.data,
    totalWei: BigInt(data.data.totalWei.hex),
    baseWei: BigInt(data.data.baseWei.hex),
  };
}

async function estimateCost(chainId, deployerAddress, options = {}) {
  return prepareDeployment(
    { name: 'EstimateToken', symbol: 'EST', initialSupply: '1000000', ...options },
    chainId,
    deployerAddress
  );
}

async function deployToken(tokenConfig, chain, privateKey) {
  const wallet = getWallet(privateKey);
  const provider = getProvider(chain);
  const signer = wallet.connect(provider);

  const balance = await provider.getBalance(wallet.address);
  const { bytecode, signature, salt, expiresAt, totalUSD, totalWei } = await prepareDeployment(
    tokenConfig,
    chain.id,
    wallet.address
  );

  if (balance < totalWei) {
    throw new Error(
      `Insufficient balance. Need ${ethers.formatEther(totalWei)} ${chain.symbol}, have ${ethers.formatEther(balance)} ${chain.symbol}`
    );
  }

  const factory = new ethers.Contract(chain.factoryAddress, FACTORY_ABI, signer);
  const tx = await factory.deployContract(bytecode, signature, salt, expiresAt, {
    value: totalWei,
  });

  const receipt = await waitForTx(tx, chain);

  // Extract deployed contract address from logs
  // The factory emits events from the newly created contract — find the address
  // that isn't the factory itself
  let contractAddress = null;
  const factoryAddr = chain.factoryAddress.toLowerCase();
  for (const log of receipt.logs || []) {
    if (log.address && log.address.toLowerCase() !== factoryAddr) {
      contractAddress = ethers.getAddress(log.address);
      break;
    }
  }
  // Fallback: if all logs are from factory, check contractAddress on receipt
  if (!contractAddress && receipt.contractAddress) {
    contractAddress = receipt.contractAddress;
  }

  if (!contractAddress) {
    throw new Error(
      `Deployment transaction succeeded (tx: ${tx.hash}) but could not extract contract address from logs. ` +
      `Check the transaction on the block explorer: ${chain.explorer}/tx/${tx.hash}`
    );
  }

  const entry = {
    contractAddress,
    txHash: tx.hash,
    chain: chain.name,
    chainId: chain.id,
    name: tokenConfig.name,
    symbol: tokenConfig.symbol,
    supply: tokenConfig.initialSupply,
    decimals: tokenConfig.decimals || '18',
    owner: wallet.address,
    features: {
      mintable: tokenConfig.mintable || false,
      burnable: tokenConfig.burnable || false,
      pausable: tokenConfig.pausable || false,
      whitelist: tokenConfig.whitelist || false,
      blacklist: tokenConfig.blacklist || false,
    },
    costUsd: totalUSD,
    deployedAt: new Date().toISOString(),
    explorerUrl: `${chain.explorer}/tx/${tx.hash}`,
    tokenUrl: contractAddress ? `${chain.explorer}/token/${contractAddress}` : null,
  };

  addToRegistry(entry);
  return entry;
}

async function getTokenInfo(contractAddress, chain, privateKey) {
  contractAddress = validateAddress(contractAddress, 'Contract address');
  const provider = getProvider(chain);
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
  ]);

  let paused = null;
  let owner = null;
  try { paused = await contract.paused(); } catch {}
  try { owner = await contract.owner(); } catch {}

  const wallet = privateKey ? getWallet(privateKey) : null;
  let myBalance = null;
  if (wallet) {
    try { myBalance = ethers.formatUnits(await contract.balanceOf(wallet.address), decimals); } catch {}
  }

  return {
    contractAddress,
    chain: chain.name,
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: ethers.formatUnits(totalSupply, decimals),
    paused,
    owner,
    myBalance,
    explorerUrl: `${chain.explorer}/token/${contractAddress}`,
  };
}

async function transferTokens(contractAddress, to, amount, chain, privateKey) {
  to = validateAddress(to, 'Recipient address');
  const { contract } = await getSignedContract(contractAddress, chain, privateKey);
  const decimals = await contract.decimals();
  const tx = await contract.transfer(to, ethers.parseUnits(amount.toString(), decimals));
  await waitForTx(tx, chain);
  return { txHash: tx.hash, explorerUrl: `${chain.explorer}/tx/${tx.hash}` };
}

async function mintTokens(contractAddress, to, amount, chain, privateKey) {
  to = validateAddress(to, 'Recipient address');
  const { contract } = await getSignedContract(contractAddress, chain, privateKey);
  const decimals = await contract.decimals();
  const tx = await contract.mint(to, ethers.parseUnits(amount.toString(), decimals));
  await waitForTx(tx, chain);
  return { txHash: tx.hash, explorerUrl: `${chain.explorer}/tx/${tx.hash}` };
}

async function burnTokens(contractAddress, amount, chain, privateKey) {
  const { contract } = await getSignedContract(contractAddress, chain, privateKey);
  const decimals = await contract.decimals();
  const tx = await contract.burn(ethers.parseUnits(amount.toString(), decimals));
  await waitForTx(tx, chain);
  return { txHash: tx.hash, explorerUrl: `${chain.explorer}/tx/${tx.hash}` };
}

async function pauseToken(contractAddress, chain, privateKey) {
  const { contract } = await getSignedContract(contractAddress, chain, privateKey);
  const tx = await contract.pause();
  await waitForTx(tx, chain);
  return { txHash: tx.hash, explorerUrl: `${chain.explorer}/tx/${tx.hash}` };
}

async function unpauseToken(contractAddress, chain, privateKey) {
  const { contract } = await getSignedContract(contractAddress, chain, privateKey);
  const tx = await contract.unpause();
  await waitForTx(tx, chain);
  return { txHash: tx.hash, explorerUrl: `${chain.explorer}/tx/${tx.hash}` };
}

module.exports = {
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
};
