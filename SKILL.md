# Bitbond Token Tool

Deploy and manage compliant ERC20 tokens across 10 EVM chains. CertiK-audited smart contracts with built-in compliance features.

## Usage

All commands via CLI at `{SKILL_DIR}/src/cli.js`:

```bash
# List supported chains
node {SKILL_DIR}/src/cli.js chains

# Estimate deployment cost
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js cost --chain sepolia

# Deploy a token
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js deploy \
  --chain sepolia \
  --name "My Token" \
  --symbol MTK \
  --supply 1000000 \
  --mintable --burnable --pausable

# Get token info
node {SKILL_DIR}/src/cli.js info --chain sepolia --address 0x...

# Transfer, mint, burn, pause, unpause
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js transfer --chain sepolia --address 0x... --to 0x... --amount 100
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js mint --chain sepolia --address 0x... --to 0x... --amount 500
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js burn --chain sepolia --address 0x... --amount 50
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js pause --chain sepolia --address 0x...
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js unpause --chain sepolia --address 0x...

# View deployed tokens
node {SKILL_DIR}/src/cli.js registry

# Show wallet info
BITBOND_PRIVATE_KEY=0x... node {SKILL_DIR}/src/cli.js wallet
```

## Features

- **CertiK-audited contracts** — not DIY Solidity
- **Compliance-ready** — whitelist, blacklist, pausable, force transfer, document URI
- **10 chains** — Ethereum, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche + testnets
- **$299/token** — flat fee in native token
- **JSON output** — all commands return structured JSON for agent consumption

## Environment

- `BITBOND_PRIVATE_KEY` — deployer wallet private key (required for write operations)

## Also available as MCP

This tool also ships as an MCP server (`src/index.js`) for Claude Desktop, Cursor, etc.
The CLI and MCP share the same core engine and token registry.
