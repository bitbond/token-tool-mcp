/**
 * Solana SPL Token deployment and management
 */
const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  getMint,
  transfer,
  TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');
const bs58 = require('bs58');

// ── Registry (reuse from tokenTool) ─────────────────────────────────────────
const { addToRegistry } = require('./tokenTool');

// ── Helpers ──────────────────────────────────────────────────────────────────
function getConnection(cluster) {
  const url = cluster === 'mainnet-beta'
    ? 'https://api.mainnet-beta.solana.com'
    : clusterApiUrl('devnet');
  return new Connection(url, 'confirmed');
}

function getKeypair(base58Key) {
  if (!base58Key) throw new Error('No Solana keypair. Set BITBOND_SOLANA_KEYPAIR env var (base58 secret key).');
  try {
    const decoded = bs58.default ? bs58.default.decode(base58Key) : bs58.decode(base58Key);
    return Keypair.fromSecretKey(decoded);
  } catch {
    throw new Error('Invalid Solana keypair. Must be base58-encoded 64-byte secret key.');
  }
}

function explorerUrl(mintAddress, cluster) {
  const clusterParam = cluster === 'mainnet-beta' ? '' : '?cluster=devnet';
  return `https://solscan.io/token/${mintAddress}${clusterParam}`;
}

// ── Deploy SPL Token ─────────────────────────────────────────────────────────
async function deployToken(tokenConfig, chain, base58Key) {
  const { name, symbol, supply, decimals: rawDecimals } = tokenConfig;
  const decimals = parseInt(rawDecimals ?? 9);
  const cluster = chain.cluster || 'devnet';

  const connection = getConnection(cluster);
  const payer = getKeypair(base58Key);

  // Check balance
  const balance = await connection.getBalance(payer.publicKey);
  if (balance < 0.01 * LAMPORTS_PER_SOL) {
    throw new Error(
      `Insufficient SOL balance. Have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL. ` +
      (cluster === 'devnet' ? 'Run: solana airdrop 1 (on devnet)' : 'Need at least 0.01 SOL.')
    );
  }

  // Create mint
  const mint = await createMint(
    connection,
    payer,           // payer
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    decimals
  );

  // Create token account for payer
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  // Mint supply to payer's token account
  const supplyRaw = BigInt(supply) * BigInt(10 ** decimals);
  const mintTx = await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer, // mint authority
    supplyRaw
  );

  const entry = {
    contractAddress: mint.toBase58(),
    mintAddress: mint.toBase58(),
    tokenAccount: tokenAccount.address.toBase58(),
    txHash: mintTx,
    chain: chain.name,
    chainType: 'solana',
    cluster,
    name,
    symbol,
    supply: supply.toString(),
    decimals,
    owner: payer.publicKey.toBase58(),
    isTestnet: chain.testnet || false,
    explorerUrl: explorerUrl(mint.toBase58(), cluster),
    deployedAt: new Date().toISOString(),
  };

  addToRegistry(entry);
  return entry;
}

// ── Get Token Info ───────────────────────────────────────────────────────────
async function getTokenInfo(mintAddress, chain) {
  const cluster = chain.cluster || 'devnet';
  const connection = getConnection(cluster);
  const mintPubkey = new PublicKey(mintAddress);
  const mintInfo = await getMint(connection, mintPubkey);

  return {
    mintAddress,
    chain: chain.name,
    decimals: mintInfo.decimals,
    supply: (mintInfo.supply / BigInt(10 ** mintInfo.decimals)).toString(),
    mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
    freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
    isInitialized: mintInfo.isInitialized,
    explorerUrl: explorerUrl(mintAddress, cluster),
  };
}

// ── Transfer Tokens ──────────────────────────────────────────────────────────
async function transferTokens(mintAddress, to, amount, chain, base58Key) {
  const cluster = chain.cluster || 'devnet';
  const connection = getConnection(cluster);
  const payer = getKeypair(base58Key);
  const mintPubkey = new PublicKey(mintAddress);
  const toPubkey = new PublicKey(to);

  const mintInfo = await getMint(connection, mintPubkey);
  const fromAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mintPubkey, payer.publicKey);
  const toAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mintPubkey, toPubkey);

  const amountRaw = BigInt(Math.floor(parseFloat(amount) * (10 ** mintInfo.decimals)));
  const txHash = await transfer(connection, payer, fromAccount.address, toAccount.address, payer, amountRaw);

  return {
    txHash,
    explorerUrl: `https://solscan.io/tx/${txHash}${cluster !== 'mainnet-beta' ? '?cluster=devnet' : ''}`,
  };
}

// ── Get Wallet Info ──────────────────────────────────────────────────────────
async function getWalletInfo(chain, base58Key) {
  const cluster = chain.cluster || 'devnet';
  const connection = getConnection(cluster);
  const keypair = getKeypair(base58Key);
  const balance = await connection.getBalance(keypair.publicKey);

  return {
    address: keypair.publicKey.toBase58(),
    chain: chain.name,
    balance: (balance / LAMPORTS_PER_SOL).toFixed(6),
    symbol: 'SOL',
    explorerUrl: `https://solscan.io/account/${keypair.publicKey.toBase58()}${cluster !== 'mainnet-beta' ? '?cluster=devnet' : ''}`,
  };
}

module.exports = { deployToken, getTokenInfo, transferTokens, getWalletInfo };
