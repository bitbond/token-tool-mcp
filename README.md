# Bitbond Token Tool MCP

Deploy and manage compliant ERC20 tokens via AI agents using [Bitbond TokenTool](https://tokentool.bitbond.com)'s CertiK-audited smart contracts.

> **First dedicated token issuance MCP.** Built for institutional RWA workflows — not generic contract deployment.

## Features

- **CertiK-audited contracts** — battle-tested, not DIY Solidity
- **Compliance-ready** — whitelist, blacklist, pausable, force transfer, document URI
- **10 EVM chains** — Ethereum, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche + 3 testnets
- **$299/token** — flat fee in native token, no subscription, no API key
- **Complete lifecycle** — deploy, mint, burn, pause, transfer, query
- **Local registry** — tracks every token deployed through the MCP

## Requirements

- Node.js ≥ 18
- An EVM wallet with native tokens for deployment gas + fee

## Quick Start

```bash
git clone https://github.com/bitbond/token-tool-mcp.git
cd token-tool-mcp
npm install
```

Set your deployer private key:

```bash
export BITBOND_PRIVATE_KEY=0x...
```

Test it:

```bash
npm start
```

## Integration

### Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "token-tool": {
      "command": "node",
      "args": ["/absolute/path/to/token-tool-mcp/src/index.js"],
      "env": {
        "BITBOND_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "token-tool": {
    "command": "node",
    "args": ["/absolute/path/to/token-tool-mcp/src/index.js"],
    "env": {
      "BITBOND_PRIVATE_KEY": "0x..."
    }
  }
}
```

### OpenClaw

Add to your `openclaw.json`:

```json
{
  "mcpServers": [
    {
      "name": "token-tool",
      "command": "node",
      "args": ["/absolute/path/to/token-tool-mcp/src/index.js"],
      "env": {
        "BITBOND_PRIVATE_KEY": "0x..."
      }
    }
  ]
}
```

### npx (after npm publish)

```json
{
  "mcpServers": {
    "token-tool": {
      "command": "npx",
      "args": ["-y", "token-tool-mcp"],
      "env": {
        "BITBOND_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

## Tools

| Tool | Description |
|---|---|
| `list_chains` | List all supported blockchain networks |
| `estimate_cost` | Quote deployment cost before committing |
| `deploy_token` | Deploy a new ERC20 token with compliance features |
| `get_token_info` | Live on-chain token state (name, symbol, supply, paused, owner) |
| `list_deployed_tokens` | All tokens deployed via this MCP (local registry) |
| `transfer_tokens` | Send tokens to another address |
| `mint_tokens` | Mint additional supply (requires mintable) |
| `burn_tokens` | Burn tokens from your balance (requires burnable) |
| `pause_token` | Emergency stop all transfers (requires pausable) |
| `unpause_token` | Resume transfers after pause |
| `get_wallet_info` | Deployer wallet address + native token balance |

### deploy_token parameters

| Parameter | Required | Description |
|---|---|---|
| `name` | ✅ | Token name (e.g. "RWA Bond Series A") |
| `symbol` | ✅ | Token ticker (e.g. "RWAB") |
| `supply` | ✅ | Initial supply (e.g. "1000000") |
| `chain` | ✅ | Target chain (e.g. "ethereum", "base", "sepolia") |
| `decimals` | | Token decimals (default: 18) |
| `mintable` | | Allow minting after deployment |
| `burnable` | | Allow burning tokens |
| `pausable` | | Allow pausing all transfers |
| `whitelist` | | Only approved addresses can hold tokens |
| `blacklist` | | Block specific addresses |
| `force_transfer` | | Owner can force-transfer tokens (compliance) |
| `document_uri` | | URI to legal document or prospectus |
| `max_supply` | | Maximum total supply cap |
| `discount_code` | | Bitbond discount code |

## Example Prompts

```
Deploy a token called "RWA Bond Series A" with symbol RWAB,
500,000 supply on Polygon, with whitelist and pausable enabled.
```

```
What's my wallet balance on Base?
```

```
Pause the token at 0x... on Ethereum — we found a compliance issue.
```

```
Mint 10,000 RWAB to 0x... and then show me the updated token info.
```

```
Estimate the cost to deploy a mintable, burnable token on Arbitrum.
```

## Supported Chains

| Chain | Key | Native Token | Type |
|---|---|---|---|
| Ethereum | `ethereum` | ETH | Mainnet |
| Polygon | `polygon` | MATIC | Mainnet |
| BNB Chain | `bnb` | BNB | Mainnet |
| Arbitrum One | `arbitrum` | ETH | Mainnet |
| Base | `base` | ETH | Mainnet |
| Optimism | `optimism` | ETH | Mainnet |
| Avalanche | `avalanche` | AVAX | Mainnet |
| Sepolia | `sepolia` | ETH | Testnet |
| Base Sepolia | `base-sepolia` | ETH | Testnet |
| BNB Testnet | `bnb-testnet` | tBNB | Testnet |

Chain aliases are supported: `eth`, `bsc`, `arb`, `avax`, `matic`, `testnet`, etc.

## Pricing

| Network | Cost |
|---|---|
| Any mainnet | $299 USD (paid in native token) |
| Any testnet | < $0.01 |

No subscription. No API key. Pay per deployment.

## Security

- Private keys are loaded **only** from the `BITBOND_PRIVATE_KEY` environment variable
- Keys are never logged, stored, or transmitted to any external service
- All blockchain transactions require explicit tool calls — no autonomous signing
- The Token Tool API receives only your public address, never your private key

## License

MIT — see [LICENSE](./LICENSE)

## Links

- [Bitbond Token Tool](https://tokentool.bitbond.com)
- [Token Tool API Examples](https://github.com/bitbond/token-tool-api-examples)
- [CertiK Audit Report](https://www.certik.com/projects/bitbond)
- [Model Context Protocol](https://modelcontextprotocol.io)
