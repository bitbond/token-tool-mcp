# Introducing TokenTool MCP: Deploy Compliant Tokens with AI Agents

*Category: Tokenization | March 2026*

---

The infrastructure layer of financial markets is being rewritten. AI agents are no longer tools that answer questions — they are becoming the primary interface through which enterprises interact with financial systems. Payments, trading, banking: all of these have already moved into the agentic stack. Token issuance has not. Until now.

Today, Bitbond is open-sourcing **TokenTool MCP**: the first MCP server for compliant token issuance. It connects any AI agent — Claude, Cursor, VS Code, or any MCP-compatible client — directly to Bitbond's production token infrastructure. The result: a CertiK-audited, compliance-ready ERC-20 token deployed on-chain in under 30 seconds, triggered by nothing more than a natural language instruction.

This article explains what TokenTool MCP is, how it works, what it enables, and why it matters for enterprises, developers, and anyone operating in the tokenized asset space.

---

## What Is Model Context Protocol (MCP)?

**Model Context Protocol (MCP)** is an open standard developed by Anthropic that defines how AI agents connect to external tools, APIs, and data sources. In practical terms, it is a universal plugin layer for AI systems — the same way a REST API made services accessible to applications, MCP makes services accessible to AI agents.

MCP operates through a client-server model:

- **MCP clients** are AI tools like Claude Desktop, Cursor, and VS Code that support agent-native workflows
- **MCP servers** are lightweight programs that expose a set of tools to those clients
- When a user issues a natural language instruction, the MCP client identifies the appropriate tool, calls the MCP server, and executes the action

The ecosystem has grown rapidly. Major financial infrastructure providers have already published MCP servers:

- **Stripe** — payments
- **Alpaca** — stock trading
- **Griffin** — banking APIs

These companies are not building MCP servers as an experiment. They are positioning their infrastructure as the default option when AI agents need to interact with financial systems. The platforms that are absent from this ecosystem will increasingly find themselves bypassed.

TokenTool MCP adds compliant token issuance to this stack — the first server to do so.

---

## What TokenTool MCP Does

TokenTool MCP wraps [Bitbond TokenTool](https://tokentool.bitbond.com) — a platform that has powered **8,300+ real-world token deployments since 2020** using CertiK-audited smart contracts — and exposes it through 11 structured tools that any MCP-compatible AI agent can call directly.

### A Typical Interaction

The following example illustrates what a deployment looks like in practice:

> *"Deploy a token called Green Bond A, symbol GBA, 1 million supply on Base, with whitelist and pausable enabled."*

The AI agent calls `deploy_token`. Within approximately 30 seconds:

- A CertiK-audited ERC-20 smart contract is deployed on Base
- The contract includes whitelist enforcement and emergency pause functionality
- The contract address and transaction hash are returned as structured output

No Solidity knowledge required. No developer needed. No web interface to navigate.

### The 11 Tools

TokenTool MCP covers the complete token lifecycle — from initial deployment through day-to-day operations and compliance management:

| Tool | Function |
|------|----------|
| `deploy_token` | Deploy a new compliant ERC-20 with optional compliance flags |
| `mint_tokens` | Increase token supply post-deployment |
| `burn_tokens` | Reduce supply from any authorized address |
| `pause_token` | Halt all token transfers immediately (emergency stop) |
| `unpause_token` | Resume normal token operations |
| `transfer_tokens` | Execute token transfers between addresses |
| `get_token_info` | Query live on-chain token state |
| `estimate_cost` | Retrieve gas and fee estimates before committing to a transaction |
| `list_chains` | View all supported blockchain networks |
| `list_deployed_tokens` | List all tokens previously deployed from a wallet |
| `get_wallet_info` | Check wallet balances and current state |

---

## Compliance Features Built In From Deployment

The critical distinction between TokenTool MCP and generic token deployers is **compliance infrastructure at the contract level**.

A basic ERC-20 deployment creates a transferable token with no restrictions. This is appropriate for utility tokens and simple governance tokens. It is not appropriate for tokenized securities, tokenized funds, or any asset subject to investor eligibility requirements or regulatory controls.

TokenTool MCP deploys contracts with the following compliance features selectable at issuance:

### Whitelist
Transfers are restricted to pre-approved wallet addresses only. Investors must pass KYC/AML requirements and be explicitly added to the whitelist before they can receive or send the token. This is the standard structure for regulated security tokens and tokenized funds.

### Blacklist
Specific wallet addresses can be blocked from all transactions. This supports compliance with sanctions screening, fraud response, and court-ordered freezes.

### Pausable
All token transfers can be halted globally with a single transaction. This enables issuers to respond to legal events, security incidents, or regulatory orders without requiring individual action on each holder's wallet.

### Force Transfer
Tokens can be moved from one wallet to another by an authorized administrator. This is a critical compliance feature for regulated securities — it enables recovery from compromised wallets, court-ordered transfers, and correction of erroneous transactions.

### Document URI
Legal documentation — offering memoranda, terms and conditions, prospectuses — can be attached directly to the token on-chain via a URI reference. This creates an immutable, auditable link between the digital asset and its legal framework.

### Max Supply Cap
A hard ceiling on total issuance can be enforced at the contract level, preventing any future minting beyond the authorized supply.

These features are embedded in the smart contract at deployment — not added as middleware or dependent on off-chain logic. They are the same compliance controls that TokenTool has offered on its web platform since 2020, now accessible through an AI-native interface.

---

## How It Works: Technical Architecture

TokenTool MCP runs locally via **stdio transport** — the standard MCP communication method for local tool execution. The architecture ensures that sensitive data never leaves the user's machine.

When an AI agent calls a deployment tool, the following sequence occurs:

1. **Transaction construction** — The MCP server constructs a deployment transaction against Bitbond's on-chain smart contract factory, already deployed across all supported chains
2. **Local signing** — The user's private key (stored in a local environment variable) signs the transaction locally. The key is never transmitted, logged, or sent to any external server
3. **Broadcast** — The signed transaction is broadcast directly to the target blockchain
4. **Factory execution** — The on-chain factory deploys a CertiK-audited ERC-20 contract with the specified parameters
5. **Response** — The contract address and transaction hash are returned to the AI agent as structured output

This architecture means TokenTool MCP has no dependency on Bitbond's servers for transaction execution. The MCP server is a local process that constructs and signs transactions independently.

### Security Considerations

Private key management follows the same approach used by established smart contract development tools including Hardhat and Foundry:

- The private key is read from an environment variable at startup
- It is held in memory and used to sign transactions locally
- It is never passed as a CLI argument (which would expose it in process lists)
- It is never logged or transmitted
- The MCP server has no network listener — it communicates exclusively via stdio

For enterprise deployments requiring additional security controls, hardware wallet integration is on the roadmap for Q2 2026.

---

## Supported Networks

TokenTool MCP supports **12 blockchain networks** at launch:

**EVM Mainnets**
- Ethereum
- Polygon
- BNB Chain
- Arbitrum
- Base
- Optimism
- Avalanche

**Non-EVM Mainnets**
- Solana (SPL tokens)
- Stellar (Stellar Asset standard)

**Testnets**
- Sepolia (Ethereum testnet)
- Mumbai (Polygon testnet)
- BSC Testnet

Testnet deployments are effectively free and functionally identical to mainnet. All testnet tokens include the same compliance features available on mainnet.

---

## Pricing

Mainnet token deployments are priced at **$299 per token** — identical to the TokenTool web interface. This fee covers deployment using CertiK-audited smart contracts, compliance feature configuration, and multi-chain support.

Testnet deployments are free. For teams evaluating TokenTool MCP before committing to a mainnet deployment, Sepolia provides a complete testing environment with no cost.

---

## Getting Started

### Installation

TokenTool MCP is available via npm. Add it to your Claude Desktop configuration:

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

One-click installation configurations for Cursor and VS Code are available in the [GitHub repository](https://github.com/thendrix-eng/token-tool-mcp).

### Recommended First Steps

1. **Configure with a testnet wallet** — Use a dedicated development wallet for testing, not a production wallet
2. **Deploy on Sepolia** — Run a full deployment flow: `deploy_token` → `get_token_info` → `mint_tokens` → `pause_token`. The full cycle takes under two minutes
3. **Verify the contract** — Use the returned contract address to inspect the deployed token on Etherscan's Sepolia explorer
4. **Move to mainnet** — Once the workflow is validated, switch to an Ethereum mainnet (or preferred chain) wallet and deploy

---

## Why This Matters for the Tokenization Industry

The tokenization market is in a transition from experiment to infrastructure. BlackRock has tokenized a money market fund. Franklin Templeton manages on-chain assets. Deutsche Bank, Citi, and HSBC are building digital asset custody products. The infrastructure layer is maturing.

As this infrastructure matures, the firms that will capture the most value are not necessarily the ones with the best smart contracts — they are the ones whose infrastructure is easiest to integrate with whatever tooling enterprises use to operate.

In 2016, "does it have an API?" determined which financial infrastructure got adopted. In 2026, the equivalent question is increasingly **"does it have an MCP server?"**

TokenTool MCP is Bitbond's answer to that question.

---

## Open Source and MIT Licensed

TokenTool MCP is fully open source under the MIT license.

**GitHub:** [github.com/thendrix-eng/token-tool-mcp](https://github.com/thendrix-eng/token-tool-mcp)
**Install:** `npx -y token-tool-mcp`
**Documentation:** Full README and one-click install links in the repository
**TokenTool:** [tokentool.bitbond.com](https://tokentool.bitbond.com)

Contributions, issue reports, and integration questions are welcome. If you are building with TokenTool MCP, we would like to hear about it.

---

*Bitbond GmbH is a regulated German fintech that has been operating since 2013. TokenTool has powered over 8,300 token deployments across 50+ countries. CertiK audit available on request.*
