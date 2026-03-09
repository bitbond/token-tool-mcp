/**
 * Stellar asset issuance and management
 */
const StellarSdk = require('@stellar/stellar-sdk');

const { addToRegistry } = require('./tokenTool');

const NETWORKS = {
  mainnet: {
    url: 'https://horizon.stellar.org',
    passphrase: StellarSdk.Networks.PUBLIC,
    explorer: 'https://stellar.expert/explorer/public',
  },
  testnet: {
    url: 'https://horizon-testnet.stellar.org',
    passphrase: StellarSdk.Networks.TESTNET,
    explorer: 'https://stellar.expert/explorer/testnet',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getServer(network) {
  const cfg = NETWORKS[network] || NETWORKS.testnet;
  return new StellarSdk.Horizon.Server(cfg.url);
}

function getKeypair(secretKey) {
  if (!secretKey) throw new Error('No Stellar secret key. Set BITBOND_STELLAR_SECRET env var (starts with S...).');
  try {
    return StellarSdk.Keypair.fromSecret(secretKey);
  } catch {
    throw new Error('Invalid Stellar secret key. Must start with S and be a valid Stellar secret key.');
  }
}

function sanitizeAssetCode(code) {
  // Stellar asset codes: max 12 chars, alphanumeric
  const clean = code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12);
  if (!clean) throw new Error('Asset code must contain alphanumeric characters.');
  return clean;
}

function explorerUrl(assetCode, issuerAddress, networkName) {
  const net = NETWORKS[networkName] || NETWORKS.testnet;
  return `${net.explorer}/asset/${assetCode}-${issuerAddress}`;
}

// ── Deploy (Issue) Stellar Asset ─────────────────────────────────────────────
async function deployToken(tokenConfig, chain, secretKey) {
  const networkName = chain.network || 'testnet';
  const cfg = NETWORKS[networkName];
  const server = getServer(networkName);

  const issuerKeypair = getKeypair(secretKey);
  const assetCode = sanitizeAssetCode(tokenConfig.symbol || tokenConfig.name);
  const supply = tokenConfig.supply.toString();

  // Stellar pattern: issuer creates the asset, distributor holds it
  // For simplicity: issuer IS the distributor (single-keypair flow)
  // Load issuer account
  let issuerAccount;
  try {
    issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
  } catch (e) {
    throw new Error(
      `Stellar account not found: ${issuerKeypair.publicKey()}. ` +
      (networkName === 'testnet'
        ? 'Fund it at https://friendbot.stellar.org/?addr=' + issuerKeypair.publicKey()
        : 'Account must be funded with XLM first.')
    );
  }

  // Create the asset object
  const asset = new StellarSdk.Asset(assetCode, issuerKeypair.publicKey());

  // Check XLM balance
  const xlmBalance = issuerAccount.balances.find(b => b.asset_type === 'native');
  if (!xlmBalance || parseFloat(xlmBalance.balance) < 1) {
    throw new Error(`Insufficient XLM balance. Need at least 1 XLM. Have: ${xlmBalance?.balance || '0'} XLM.`);
  }

  // Build payment transaction: issuer sends asset to itself (creates the supply)
  // This is valid on Stellar — issuer can self-send to create circulating supply
  // We need a trustline first if sending to a different account; for self-issue it works directly
  const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: cfg.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: issuerKeypair.publicKey(),
        asset,
        amount: supply,
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(issuerKeypair);

  let txResult;
  try {
    txResult = await server.submitTransaction(transaction);
  } catch (e) {
    const detail = e.response?.data?.extras?.result_codes || e.message;
    throw new Error(`Stellar transaction failed: ${JSON.stringify(detail)}`);
  }

  const entry = {
    contractAddress: `${assetCode}:${issuerKeypair.publicKey()}`,
    assetCode,
    issuerAddress: issuerKeypair.publicKey(),
    txHash: txResult.hash,
    chain: chain.name,
    chainType: 'stellar',
    network: networkName,
    name: tokenConfig.name,
    symbol: assetCode,
    supply,
    owner: issuerKeypair.publicKey(),
    isTestnet: chain.testnet || false,
    explorerUrl: explorerUrl(assetCode, issuerKeypair.publicKey(), networkName),
    deployedAt: new Date().toISOString(),
  };

  addToRegistry(entry);
  return entry;
}

// ── Get Token Info ───────────────────────────────────────────────────────────
async function getTokenInfo(assetCode, issuerAddress, chain) {
  const networkName = chain.network || 'testnet';
  const server = getServer(networkName);

  // Query asset stats from Horizon
  const assets = await server.assets()
    .forCode(assetCode)
    .forIssuer(issuerAddress)
    .call();

  const record = assets.records[0];
  if (!record) throw new Error(`Asset ${assetCode}:${issuerAddress} not found on Stellar ${networkName}.`);

  return {
    assetCode,
    issuerAddress,
    chain: chain.name,
    supply: record.amount,
    numAccounts: record.num_accounts,
    flags: record.flags,
    explorerUrl: explorerUrl(assetCode, issuerAddress, networkName),
  };
}

// ── Transfer Asset ───────────────────────────────────────────────────────────
async function transferTokens(assetCode, issuerAddress, to, amount, chain, secretKey) {
  const networkName = chain.network || 'testnet';
  const cfg = NETWORKS[networkName];
  const server = getServer(networkName);
  const senderKeypair = getKeypair(secretKey);

  const senderAccount = await server.loadAccount(senderKeypair.publicKey());
  const asset = new StellarSdk.Asset(assetCode, issuerAddress);

  const transaction = new StellarSdk.TransactionBuilder(senderAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: cfg.passphrase,
  })
    .addOperation(StellarSdk.Operation.payment({ destination: to, asset, amount: amount.toString() }))
    .setTimeout(30)
    .build();

  transaction.sign(senderKeypair);
  const result = await server.submitTransaction(transaction);

  return {
    txHash: result.hash,
    explorerUrl: `${NETWORKS[networkName].explorer}/tx/${result.hash}`,
  };
}

// ── Get Wallet Info ──────────────────────────────────────────────────────────
async function getWalletInfo(chain, secretKey) {
  const networkName = chain.network || 'testnet';
  const server = getServer(networkName);
  const keypair = getKeypair(secretKey);

  let account;
  try {
    account = await server.loadAccount(keypair.publicKey());
  } catch {
    return {
      address: keypair.publicKey(),
      chain: chain.name,
      balance: '0',
      symbol: 'XLM',
      note: networkName === 'testnet'
        ? 'Account not funded. Get testnet XLM: https://friendbot.stellar.org/?addr=' + keypair.publicKey()
        : 'Account not found on Stellar mainnet.',
    };
  }

  const xlmBalance = account.balances.find(b => b.asset_type === 'native');
  return {
    address: keypair.publicKey(),
    chain: chain.name,
    balance: xlmBalance?.balance || '0',
    symbol: 'XLM',
    explorerUrl: `${NETWORKS[networkName].explorer}/account/${keypair.publicKey()}`,
  };
}

module.exports = { deployToken, getTokenInfo, transferTokens, getWalletInfo };
