# Show HN Post — v2 (Opus)
*Submit at 4 PM CET / 10 AM EST sharp. This is the optimal window for Show HN visibility.*

---

## Title

Show HN: TokenTool MCP – Deploy CertiK-audited ERC-20 tokens from Claude/Cursor in 30 seconds

---

## Body

MCP servers exist for payments (Stripe), trading (Alpaca), and banking (Griffin). Nothing existed for compliant token issuance — the kind with investor whitelists, transfer restrictions, emergency pauses, and on-chain legal document references.

So we built one.

TokenTool MCP wraps Bitbond's TokenTool — a platform that's handled 8,300+ token deployments since 2020, using CertiK-audited smart contracts. The MCP server exposes the same infrastructure to AI agents.

Here's what an interaction looks like:

> "Deploy a token called DAO Treasury, symbol DTRX, 5 million supply on Arbitrum, mintable and pausable"

The agent calls `deploy_token`. A CertiK-audited ERC-20 is live on-chain in ~30 seconds. The contract address and transaction hash come back as structured tool results.

**How it works under the hood**

The MCP server runs locally via stdio transport. When you ask it to deploy:

1. It constructs a deployment transaction against Bitbond's on-chain smart contract factory
2. Your private key signs the transaction locally (read from env var — never logged, never transmitted)
3. The signed transaction is broadcast to the target chain
4. The factory deploys a CertiK-audited ERC-20 with your specified parameters
5. Contract address + tx hash are returned

No data goes to Bitbond's servers. The smart contract factory is already deployed on each chain — the MCP server just constructs and submits calls to it.

**What it can do**

11 tools covering the full lifecycle:

- `deploy_token` — ERC-20 with optional compliance flags: whitelist, blacklist, pausable, force transfer, document URI, max supply cap
- `mint_tokens`, `burn_tokens` — supply management
- `pause_token`, `unpause_token` — emergency stop
- `transfer_tokens` — move tokens
- `get_token_info` — live on-chain state
- `estimate_cost` — gas + fee quote before committing
- `list_chains`, `list_deployed_tokens`, `get_wallet_info` — utilities

**Technical details**

- 12 networks: Ethereum, Polygon, BNB Chain, Arbitrum, Base, Optimism, Avalanche, Solana, Stellar + 3 testnets
- stdio transport — Claude Desktop, Cursor, VS Code, Claude Code, OpenClaw, any MCP-compatible client
- Private key from env var only, never logged or transmitted
- $299 flat fee per mainnet deployment (same price as the web UI at tokentool.bitbond.com — testnet is effectively free)
- MIT license

**Quick start**

Add to your Claude Desktop config (`~/.claude/claude_desktop_config.json`):

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

One-click install links for Cursor and VS Code in the README.

Repo: https://github.com/thendrix-eng/token-tool-mcp

Happy to answer questions about the architecture, the contract factory, the CertiK audit, MCP development, or anything else.

---

## Pre-written responses to likely HN objections

**"Why would I pay $299 to deploy a token?"**
→ That's Bitbond's standard TokenTool pricing — same whether you use the web UI, their API, or this MCP server. You're paying for CertiK-audited contracts with compliance features baked in, not a boilerplate ERC-20 you could deploy from Remix. Testnet is free and functionally identical — start there.

**"This is just a wrapper around an API?"**
→ Yes, that's what an MCP server is. Stripe's MCP server wraps their API. Alpaca's wraps theirs. The value is making the infrastructure addressable by AI agents through a standard protocol. The alternative is every agent developer building their own bespoke integration.

**"Private key in an env var?"**
→ Standard practice for local dev tooling — same approach as Hardhat, Foundry, and every other smart contract framework. The key is read once at startup, held in memory, and used to sign transactions locally. It's never passed as a CLI argument (which would appear in process lists), never logged, and never transmitted. The MCP server has no network listener — it uses stdio transport exclusively. For production use, we recommend hardware wallet integration (roadmap) and enabling human-in-the-loop confirmation in your MCP client.

**"8,300 deployments — how do I verify that?"**
→ TokenTool is live at tokentool.bitbond.com. The deployment count is visible on the site. Bitbond is a regulated German fintech (Bitbond GmbH, Berlin) that's been operating since 2013.

**"Why not Thirdweb / Coinbase AgentKit?"**
→ Those handle generic smart contract deployment. TokenTool MCP is specifically for compliant token issuance — whitelist/blacklist, pausable, force transfer, document URI. If you need a vanilla ERC-20, use Thirdweb. If you need the compliance features that RWA issuers and institutional platforms require, that's what this is for.
