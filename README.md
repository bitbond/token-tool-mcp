# Bitbond Token Tool MCP

Deploy and manage ERC20 tokens via AI agents using Bitbond's CertiK-audited Token Tool.

## What it does

Gives any MCP-compatible AI agent (Claude, Cursor, OpenClaw, etc.) the ability to:
- Deploy compliant ERC20 tokens on any major EVM chain
- Manage token lifecycle: mint, burn, pause, transfer
- Query live on-chain token state
- Track all deployed tokens in a local registry

## Why Token Tool

- **CertiK-audited** smart contracts
- **Compliance features built in**: whitelist, blacklist, pausable, force transfer, document URI
- **$299/token** — a rounding error for institutional RWA issuance
- **8 chains**: Ethereum, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche + Sepolia testnet
- **No Solidity needed** — agents just call the tool

## Setup

```bash
npm install
```

Set your private key:
```bash
export BITBOND_PRIVATE_KEY=0x...
```

## Claude Desktop config

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "token-tool": {
      "command": "node",
      "args": ["/path/to/token-tool-mcp/src/index.js"],
      "env": {
        "BITBOND_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

## OpenClaw config

Add to your OpenClaw `openclaw.json`:

```json
{
  "mcpServers": [
    {
      "name": "token-tool",
      "command": "node",
      "args": ["/path/to/token-tool-mcp/src/index.js"],
      "env": {
        "BITBOND_PRIVATE_KEY": "0x..."
      }
    }
  ]
}
```

## Available tools

| Tool | Description |
|---|---|
| `list_chains` | List all supported chains |
| `estimate_cost` | Quote deployment cost before committing |
| `deploy_token` | Deploy a new ERC20 token |
| `get_token_info` | Live on-chain token state |
| `list_deployed_tokens` | All tokens deployed via this MCP |
| `transfer_tokens` | Send tokens to an address |
| `mint_tokens` | Mint more tokens (if mintable) |
| `burn_tokens` | Burn tokens (if burnable) |
| `pause_token` | Emergency stop all transfers (if pausable) |
| `unpause_token` | Resume transfers |
| `get_wallet_info` | Deployer wallet address + balance |

## Example agent prompts

```
Deploy a token called "RWA Bond Series A" with symbol RWAB,
500000 supply, on Polygon, with whitelist and pausable enabled.
```

```
What's the balance of my wallet on Base?
```

```
Pause the token at 0x... on Ethereum immediately.
```

```
Mint 10000 more RWAB tokens to address 0x...
```

## Supported chains

| Chain | Key | Native Token |
|---|---|---|
| Ethereum | `ethereum` | ETH |
| Polygon | `polygon` | MATIC |
| BNB Chain | `bnb` | BNB |
| Arbitrum One | `arbitrum` | ETH |
| Base | `base` | ETH |
| Optimism | `optimism` | ETH |
| Avalanche | `avalanche` | AVAX |
| Sepolia (testnet) | `sepolia` | ETH |

## Pricing

$299 USD per token deployment, paid in native chain token at deployment time.
No subscription. No API key. Pay per use.

Testnet (Sepolia) deployments cost a fraction of a cent.

## Security

- Private key is loaded from environment variable only — never hardcoded
- Keys are never logged or transmitted
- All transactions require explicit tool calls — no autonomous signing
