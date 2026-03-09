---
name: token-tool-mcp
description: Deploy and manage compliant tokens on 10 blockchain networks via Bitbond TokenTool MCP (17 tools). Use when user asks to deploy a token, create an ERC-20, issue a security token, tokenize an asset, mint tokens, burn tokens, pause token transfers, create an SPL token on Solana, issue a Stellar asset, estimate deployment cost, check token info, list deployed tokens, set up whitelist or blacklist compliance, manage whitelist/blacklist addresses, check compliance status, or manage token lifecycle. Supports EVM chains, Solana, and Stellar with CertiK-audited contracts.
---

# TokenTool MCP

## Overview

TokenTool MCP gives AI agents a complete token issuance and lifecycle management API built on [Bitbond TokenTool](https://tokentool.bitbond.com) — 8,300+ deployments, CertiK-audited smart contracts, compliance features built in. Supports EVM (Ethereum, Polygon, BNB Chain, Arbitrum, Base, Optimism, Avalanche + testnets), Solana (SPL tokens), and Stellar (assets).

**Pricing:** Testnet deployments are free (gas only). Mainnet deployments cost a flat $299 fee paid in native token + gas.

**Security:** Private keys stay local (env vars only). The MCP server uses stdio transport — no network listener, no open ports. Keys are never logged or transmitted.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_chains` | List all supported networks with IDs and aliases |
| `estimate_cost` | Quote deployment cost (gas + fee) before committing |
| `deploy_token` | Deploy a new token with optional compliance features |
| `get_token_info` | Live on-chain token state (name, symbol, supply, paused, owner) |
| `list_deployed_tokens` | Local deployment registry, filterable by chain |
| `transfer_tokens` | Send tokens to any address |
| `mint_tokens` | Mint additional supply (requires mintable=true) |
| `burn_tokens` | Destroy tokens from your balance (requires burnable=true) |
| `pause_token` | Emergency stop — halt all transfers (requires pausable=true) |
| `unpause_token` | Resume transfers after a pause |
| `get_wallet_info` | Deployer wallet address and native balance on a chain |
| `add_to_whitelist` | Add addresses to token whitelist (batch supported) |
| `get_whitelist` | View whitelist status and all whitelisted addresses |
| `add_to_blacklist` | Block an address from token interactions |
| `remove_from_blacklist` | Unblock a previously blacklisted address |
| `get_compliance_status` | Check whitelist and blacklist configuration for a token |

## Instructions

### Workflow 1: Deploy a New Token

1. **Gather requirements.** Ask the user for:
   - Token name and symbol
   - Initial supply
   - Target chain (if unsure, call `list_chains` to show options)
   - Compliance features needed (whitelist, blacklist, pausable, force_transfer, document_uri, max_supply)
   - Whether they want mintable and/or burnable enabled

2. **Recommend testnet first** if the user hasn't deployed before or seems unsure. Sepolia (EVM), Solana Devnet, or Stellar Testnet are free and functionally identical to mainnet.

3. **Show the cost.** Call `estimate_cost` with the target chain before deploying. Tell the user the cost in native token and USD equivalent. Mainnet = $299 flat + gas. Testnet = gas only (~free).

4. **Get explicit confirmation** before calling `deploy_token` on mainnet. This costs real money.

5. **Call `deploy_token`** with all parameters. Include compliance flags only if the user requested them.

6. **Return results clearly:** contract address, explorer link, transaction hash, features enabled, and what they can do next (mint, transfer, pause, etc.).

### Workflow 2: Manage an Existing Token

For post-deployment operations, you need the contract address and chain. If the user doesn't provide these:
- Call `list_deployed_tokens` to find their tokens
- Ask which one they mean if there are multiple

**Minting:** Call `mint_tokens` — only works if the token was deployed with `mintable=true`. Requires the recipient address and amount.

**Burning:** Call `burn_tokens` — only works if `burnable=true`. Burns from the deployer's balance.

**Transferring:** Call `transfer_tokens` with recipient address and amount.

**Pausing/Unpausing:** Call `pause_token` to halt all transfers (emergency stop). Call `unpause_token` to resume. Only works if `pausable=true`.

**Checking status:** Call `get_token_info` to see current on-chain state — supply, owner, paused status, etc.

### Workflow 3: Compliance Setup

Recommend compliance features based on the use case:

- **Whitelist** — for security tokens, regulated assets, investor-only tokens. Only approved addresses can hold/receive tokens. Recommend when: KYC/AML requirements, accredited investor restrictions, or jurisdictional compliance. After deployment, use `add_to_whitelist` to approve addresses (batch supported) and `get_whitelist` to view current whitelist. Use `get_compliance_status` to check both whitelist and blacklist state at once.

- **Blacklist** — for blocking sanctioned or suspicious addresses. Recommend when: OFAC compliance, preventing known bad actors, or responding to exploit addresses. After deployment, use `add_to_blacklist` to block addresses and `remove_from_blacklist` to unblock them.

- **Pausable** — emergency stop capability. Recommend for: any token with significant value, security tokens, or tokens where the issuer needs a kill switch.

- **Force Transfer** — allows the owner to move tokens between addresses without holder consent. Recommend for: regulatory recovery scenarios, court-ordered transfers, lost key recovery for compliant tokens.

- **Document URI** — attaches a legal document (prospectus, term sheet, offering memorandum) on-chain. Recommend for: security tokens, RWA tokens, any regulated offering.

- **Max Supply** — hard cap enforced at the contract level, cannot be changed after deployment. Recommend when: tokenomics require a guaranteed supply ceiling.

For a typical **security token / RWA issuance**, recommend: whitelist + pausable + force_transfer + document_uri.

For a typical **utility / governance token**, recommend: mintable + burnable + pausable.

### Workflow 4: Multi-Chain Comparison

When a user is deciding between chains:
1. Call `estimate_cost` for each candidate chain
2. Call `get_wallet_info` for each to check balances
3. Present a comparison: cost, speed, ecosystem, and whether they have sufficient balance

## Environment Variables

| Variable | Required For | Description |
|----------|-------------|-------------|
| `BITBOND_PRIVATE_KEY` | All EVM chains | Ethereum-format private key (0x...) |
| `BITBOND_SOLANA_KEYPAIR` | Solana, Solana Devnet | Base58-encoded Solana secret key |
| `BITBOND_STELLAR_SECRET` | Stellar, Stellar Testnet | Stellar secret key (starts with S...) |

At least one key must be set. The server works for read-only operations (list_chains, get_token_info on EVM) without keys, but all write operations require the appropriate key.

## Examples

**User:** "Deploy a governance token called DAO Vote, 10M supply on Polygon, mintable and burnable."

→ Call `estimate_cost` with chain="polygon" → Show cost → Get confirmation → Call `deploy_token` with name="DAO Vote", symbol="DAOV", supply="10000000", chain="polygon", mintable=true, burnable=true → Return contract address + explorer link.

---

**User:** "How much would it cost to deploy on Base vs Arbitrum?"

→ Call `estimate_cost` with chain="base" and `estimate_cost` with chain="arbitrum" in parallel → Present comparison table with gas + fee in native token and USD.

---

**User:** "Pause all transfers on my token 0xabc123 on Base — we found a vulnerability."

→ Call `pause_token` with contract_address="0xabc123", chain="base" → Confirm pause succeeded → Suggest next steps (investigate, then `unpause_token` when ready).

---

**User:** "I want to create a security token for our real estate fund on Ethereum with full compliance."

→ Recommend: whitelist + pausable + force_transfer + document_uri → Ask for token name, symbol, supply, and document URI → Call `estimate_cost` on Ethereum → Warn about high Ethereum gas costs, suggest Base or Polygon as cheaper alternatives → Get confirmation → Deploy with all compliance flags.

---

**User:** "Show me what I've deployed."

→ Call `list_deployed_tokens` → Format as a readable list with chain, name, symbol, address, and explorer links.

---

**User:** "Create an SPL token on Solana with 1 billion supply."

→ Confirm name and symbol → Call `deploy_token` with chain="solana" → Note: requires `BITBOND_SOLANA_KEYPAIR` env var. If not set, the error will say so — tell the user how to configure it.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `BITBOND_PRIVATE_KEY env var not set` | No EVM key configured | Set the env var in MCP client config with a funded wallet's private key |
| `BITBOND_SOLANA_KEYPAIR env var not set` | No Solana key configured | Export base58 secret key from Phantom or `solana-keygen` |
| `BITBOND_STELLAR_SECRET env var not set` | No Stellar key configured | Use a Stellar secret key starting with `S` |
| `Unknown chain "xyz"` | Unrecognized chain name | Call `list_chains` to show valid options. Common aliases: eth, bnb, arb, avax, sol, xlm |
| `insufficient funds` | Wallet balance too low for gas + fee | Call `get_wallet_info` to check balance. User needs to fund their wallet. Suggest testnet faucets for test chains |
| `execution reverted` | Contract-level error | Usually means: trying to mint on non-mintable token, pausing already-paused token, or blacklisted address. Check token features with `get_token_info` |
| Timeout or no response | RPC node issue | Retry. If persistent, the chain's public RPC may be congested |

## References

For detailed chain and compliance documentation, see `references/`:
- `references/chain-details.md` — full chain registry with IDs, RPCs, explorers, aliases, and required env vars
- `references/compliance-features.md` — deep dive on each compliance feature with regulatory context and configuration examples
