# Changelog

## 1.0.0 (2026-02-19)

### Features

- **11 MCP tools** for complete token lifecycle management
  - `list_chains` — list all supported blockchain networks
  - `estimate_cost` — quote deployment cost before committing
  - `deploy_token` — deploy CertiK-audited ERC20 tokens with compliance features
  - `get_token_info` — live on-chain token state (name, symbol, supply, paused, owner)
  - `list_deployed_tokens` — local registry of all tokens deployed via this MCP
  - `transfer_tokens` — send tokens to any address
  - `mint_tokens` — mint additional supply (if mintable)
  - `burn_tokens` — burn/destroy tokens (if burnable)
  - `pause_token` — emergency stop all transfers (if pausable)
  - `unpause_token` — resume transfers after pause
  - `get_wallet_info` — deployer wallet address and native balance
- **10 chains supported**: Ethereum, Polygon, BNB Chain, Arbitrum, Base, Optimism, Avalanche, Sepolia, Base Sepolia, BNB Testnet
- **Human-friendly chain aliases** (e.g. `eth`, `bsc`, `arb`, `avax`, `testnet`)
- **Compliance features**: whitelist, blacklist, pausable, force transfer, document URI, max supply cap
- **Local deployment registry** tracks all tokens deployed via the MCP
- **stdio transport** — works with Claude Desktop, Cursor, OpenClaw, and any MCP-compatible client
