# Show HN: TokenTool MCP – Deploy ERC20 tokens from Claude/Cursor by typing a sentence

I built an MCP server that lets AI agents deploy and manage compliant ERC20 tokens using Bitbond's CertiK-audited smart contracts.

Instead of writing Solidity, configuring Hardhat, and deploying manually — you just say:

> "Deploy a token called RWA Bond Series A with symbol RWAB, 500K supply on Polygon, with whitelist and pausable enabled."

30 seconds later, an audited contract is live on-chain.

**Why I built this**

MCP servers exist for generic contract deployment (Thirdweb) and payments (Coinbase AgentKit), but nothing existed for *compliant* token issuance. Bitbond's contracts include whitelist, blacklist, force transfer, document URI, and pausable — features that institutional issuers actually need for RWA tokenization, not just toy tokens.

The intersection of AI agents + tokenized finance felt like an obvious gap.

**What it does**

11 tools covering the full token lifecycle:
- Deploy with compliance features (whitelist, blacklist, pausable, force transfer, document URI)
- Mint, burn, pause, transfer, force-transfer
- Query live on-chain state
- Local registry tracking every deployment

**Technical details**
- stdio transport — works with Claude Desktop, Cursor, OpenClaw, any MCP-compatible client
- 10 EVM chains: Ethereum, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche + testnets
- $299/token flat fee on mainnet (near-zero on testnet)
- Private key from env var only, never logged or transmitted
- CertiK-audited contracts (Bitbond's TokenTool has processed 12,000+ token deployments)

**Get started in 60 seconds**

```bash
git clone https://github.com/thendrix-eng/token-tool-mcp
cd token-tool-mcp && npm install
export BITBOND_PRIVATE_KEY=0x...
```

Add to your Claude Desktop or Cursor MCP config and you're live. Full integration guides in the README.

Repo: https://github.com/thendrix-eng/token-tool-mcp

Happy to answer questions about the architecture, the TokenTool API, or MCP development in general.
