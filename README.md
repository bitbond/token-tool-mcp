# Bitbond Token Tool

Deploy and manage compliant ERC20 tokens via AI agents using [Bitbond TokenTool](https://tokentool.bitbond.com)'s CertiK-audited smart contracts.

> **The first agentic tool for compliant token issuance.** CertiK-audited contracts with built-in compliance, available as both CLI and MCP server.

## Features

- **CertiK-audited contracts** — battle-tested, not DIY Solidity
- **Compliance-ready** — whitelist, blacklist, pausable, force transfer, document URI
- **10 EVM chains** — Ethereum, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche + 3 testnets
- **$299/token** — flat fee in native token, no subscription, no API key
- **Complete lifecycle** — deploy, mint, burn, pause, transfer, query
- **Local registry** — tracks every token deployed
- **Two interfaces** — CLI for any agent/script, MCP for Claude Desktop/Cursor

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

## CLI Usage

```bash
# List supported chains
node src/cli.js chains

# Estimate deployment cost
node src/cli.js cost --chain sepolia

# Deploy a token
node src/cli.js deploy --chain sepolia --name "My Token" --symbol MTK --supply 1000000 --mintable --burnable

# Get token info
node src/cli.js info --chain sepolia --address 0x...

# Transfer tokens
node src/cli.js transfer --chain sepolia --address 0x... --to 0x... --amount 100

# Mint, burn, pause, unpause
node src/cli.js mint --chain sepolia --address 0x... --to 0x... --amount 500
node src/cli.js burn --chain sepolia --address 0x... --amount 50
node src/cli.js pause --chain sepolia --address 0x...
node src/cli.js unpause --chain sepolia --address 0x...

# View all deployed tokens
node src/cli.js registry

# Show wallet address
node src/cli.js wallet
```

All commands output structured JSON.

If installed globally (`npm install -g`), use `token-tool` instead of `node src/cli.js`.

## MCP Server Usage

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

### Cursor / Other MCP Clients

Point your MCP client to `src/index.js` with stdio transport.

## OpenClaw / AI Agent Skill

Drop the project directory into your agent's workspace and reference `SKILL.md`. The CLI outputs JSON, making it trivial for any agent to parse and act on results.

```bash
# Example: agent deploys a token via exec
BITBOND_PRIVATE_KEY=0x... node /path/to/token-tool-mcp/src/cli.js deploy \
  --chain base --name "RWA Fund Token" --symbol RWAF --supply 10000000 \
  --mintable --pausable --whitelist
```

## Deploy Options

| Flag | Description |
|------|-------------|
| `--chain` | Target chain (ethereum, polygon, bnb, arbitrum, base, optimism, avalanche, sepolia, base-sepolia, bnb-testnet) |
| `--name` | Token name |
| `--symbol` | Token symbol |
| `--supply` | Initial supply (human-readable, e.g. 1000000) |
| `--decimals` | Decimal places (default: 18) |
| `--mintable` | Enable minting |
| `--burnable` | Enable burning |
| `--pausable` | Enable pause/unpause |
| `--whitelist` | Enable whitelist |
| `--blacklist` | Enable blacklist |
| `--force-transfer` | Enable force transfers (compliance) |
| `--document-uri` | Attach document URI (e.g. prospectus link) |
| `--max-supply` | Set maximum supply cap |
| `--owner` | Set token owner (defaults to deployer) |
| `--discount-code` | Apply discount code |

## Architecture

```
token-tool-mcp/
├── src/
│   ├── cli.js        ← CLI interface (any agent, script, terminal)
│   ├── index.js      ← MCP server (Claude Desktop, Cursor)
│   ├── tokenTool.js  ← Core engine (shared by CLI + MCP)
│   └── chains.js     ← Chain registry
├── data/
│   └── registry.json ← Local deployment history
├── SKILL.md          ← OpenClaw skill descriptor
└── README.md
```

Both CLI and MCP share the same core engine (`tokenTool.js`) and token registry.

## License

MIT — Bitbond GmbH
