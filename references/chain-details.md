# Chain Details

Complete registry of all supported blockchain networks in Token Tool MCP.

## EVM Chains (Mainnet)

| Chain Key | Name | Chain ID | Symbol | Explorer | Factory Address |
|-----------|------|----------|--------|----------|----------------|
| `ethereum` | Ethereum | 1 | ETH | etherscan.io | 0x4904Ba...4bd |
| `polygon` | Polygon | 137 | MATIC | polygonscan.com | 0x4904Ba...4bd |
| `bnb` | BNB Chain | 56 | BNB | bscscan.com | 0x4904Ba...4bd |
| `arbitrum` | Arbitrum One | 42161 | ETH | arbiscan.io | 0x4904Ba...4bd |
| `base` | Base | 8453 | ETH | basescan.org | 0x4904Ba...4bd |
| `optimism` | Optimism | 10 | ETH | optimistic.etherscan.io | 0x4904Ba...4bd |
| `avalanche` | Avalanche C-Chain | 43114 | AVAX | snowtrace.io | 0x4904Ba...4bd |

**Required env var:** `BITBOND_PRIVATE_KEY` (Ethereum-format 0x... private key)

**Cost:** $299 flat fee + gas (paid in native token)

## EVM Chains (Testnet)

| Chain Key | Name | Chain ID | Symbol | Explorer |
|-----------|------|----------|--------|----------|
| `sepolia` | Sepolia Testnet | 11155111 | ETH | sepolia.etherscan.io |
| `base-sepolia` | Base Sepolia Testnet | 84532 | ETH | sepolia.basescan.org |
| `bnb-testnet` | BNB Smart Chain Testnet | 97 | tBNB | testnet.bscscan.com |

**Required env var:** `BITBOND_PRIVATE_KEY`

**Cost:** Gas only (~free). Use faucets to get test tokens.

**Faucets:**
- Sepolia: https://sepoliafaucet.com or https://faucets.chain.link/sepolia
- Base Sepolia: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- BNB Testnet: https://testnet.bnbchain.org/faucet-smart

## Solana

| Chain Key | Name | Cluster | Explorer |
|-----------|------|---------|----------|
| `solana` | Solana | mainnet-beta | solscan.io |
| `solana-devnet` | Solana Devnet | devnet | solscan.io |

**Required env var:** `BITBOND_SOLANA_KEYPAIR` (base58-encoded secret key)

**Token type:** SPL Token

**Cost:** Mainnet: $299 + rent/gas. Devnet: free (use `solana airdrop` for test SOL).

## Stellar

| Chain Key | Name | Network | Explorer |
|-----------|------|---------|----------|
| `stellar` | Stellar | mainnet | stellar.expert/explorer/public |
| `stellar-testnet` | Stellar Testnet | testnet | stellar.expert/explorer/testnet |

**Required env var:** `BITBOND_STELLAR_SECRET` (secret key starting with S...)

**Token type:** Stellar Asset

**Cost:** Mainnet: $299 + transaction fees. Testnet: free (use Friendbot for test XLM).

**Note:** For `get_token_info` on Stellar, use format `ASSETCODE:ISSUER_ADDRESS`.

## Aliases

All chain inputs are case-insensitive. These aliases resolve to their canonical chain keys:

| Alias | Resolves To |
|-------|-------------|
| `eth`, `mainnet`, `ethereum mainnet` | ethereum |
| `bnb chain`, `bsc`, `binance smart chain` | bnb |
| `matic` | polygon |
| `arbitrum one`, `arb` | arbitrum |
| `avax`, `avalanche c-chain` | avalanche |
| `test`, `testnet` | sepolia |
| `base sepolia`, `basesepolia` | base-sepolia |
| `bnb test`, `bsc testnet`, `chapel` | bnb-testnet |
| `sol`, `solana mainnet` | solana |
| `solana devnet`, `devnet` | solana-devnet |
| `xlm`, `stellar mainnet` | stellar |
| `stellar test` | stellar-testnet |

## RPC Endpoints

All chains use public RPC endpoints by default:

- **EVM:** PublicNode endpoints (e.g., `ethereum.publicnode.com`)
- **Solana:** Official Solana RPC (`api.mainnet-beta.solana.com` / `api.devnet.solana.com`)
- **Stellar:** Stellar SDK built-in network configuration

These are free, rate-limited public endpoints. For high-volume production use, consider configuring custom RPC providers (Alchemy, Infura, QuickNode, etc.) in the chain configuration.
