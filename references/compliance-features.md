# Compliance Features

Detailed guide to Token Tool MCP's compliance features — when to use them, regulatory context, and configuration examples.

## Overview

Token Tool MCP supports six compliance features that can be enabled at deployment. These are enforced at the smart contract level — they cannot be bypassed, and most cannot be added after deployment. Choose carefully.

All features are optional. A token with no compliance flags behaves as a standard ERC-20 (or SPL / Stellar asset).

---

## Whitelist

**Flag:** `whitelist: true`

**What it does:** Restricts token holding and transfers to pre-approved addresses only. Any transfer to a non-whitelisted address reverts.

**When to use:**
- Security token offerings (STOs) requiring KYC/AML verification
- Accredited investor requirements (SEC Reg D, EU MiFID II)
- Jurisdictional restrictions (e.g., blocking US persons)
- Regulated real-world asset (RWA) tokenization

**Regulatory context:** Most securities regulations require issuers to know their holders. A whitelist enforces this at the protocol level — tokens literally cannot move to unverified wallets. This satisfies Transfer Agent requirements in many jurisdictions.

**Example configuration:**
```
deploy_token:
  name: "Real Estate Fund Token"
  symbol: "REFT"
  supply: "1000000"
  chain: "ethereum"
  whitelist: true
  pausable: true
  force_transfer: true
  document_uri: "https://example.com/prospectus.pdf"
```

**Post-deployment:** The token owner manages the whitelist through the contract's admin functions (add/remove addresses). This is typically integrated with a KYC provider.

---

## Blacklist

**Flag:** `blacklist: true`

**What it does:** Blocks specific addresses from sending, receiving, or holding tokens. Any transaction involving a blacklisted address reverts.

**When to use:**
- OFAC/sanctions compliance — blocking sanctioned addresses
- Responding to exploits — freezing attacker addresses
- Blocking known malicious actors
- Compliance with law enforcement requests

**Regulatory context:** OFAC (Office of Foreign Assets Control) requires US persons and entities to block transactions with sanctioned addresses. A blacklist provides this capability at the token level. Also relevant for EU sanctions compliance.

**Example configuration:**
```
deploy_token:
  name: "Compliant Stablecoin"
  symbol: "cUSD"
  supply: "10000000"
  chain: "polygon"
  blacklist: true
  pausable: true
```

**Whitelist vs Blacklist:** Use whitelist when you want "default deny" (only approved addresses). Use blacklist when you want "default allow" (everyone except blocked addresses). For maximum compliance, some issuers enable both.

---

## Pausable

**Flag:** `pausable: true`

**What it does:** Gives the token owner an emergency stop button. When paused, ALL token transfers are halted — no one can send, receive, mint, or burn.

**When to use:**
- Any token with significant value
- Security tokens (regulatory requirement in many frameworks)
- Tokens where rapid response to incidents is critical
- During security audits or vulnerability disclosures
- Contract migration scenarios

**Regulatory context:** Many securities frameworks require issuers to have the ability to halt trading. The EU's MiCA regulation and SEC guidance both contemplate issuer control mechanisms. Pausability satisfies these requirements.

**Example:** A vulnerability is discovered in a DeFi protocol that holds your token. You immediately call `pause_token` to prevent any movement while the situation is assessed. Once resolved, call `unpause_token` to resume normal operations.

**Recommendation:** Enable pausable on virtually every mainnet deployment. The cost is negligible, and having the option is far better than not having it when you need it.

---

## Force Transfer

**Flag:** `force_transfer: true`

**What it does:** Allows the token owner to transfer tokens from any address to any other address without the holder's consent.

**When to use:**
- Court-ordered asset recovery
- Regulatory seizure requirements
- Lost key recovery for compliant tokens (move tokens from inaccessible wallet to new wallet)
- Estate/inheritance transfers
- Error correction (tokens sent to wrong address)

**Regulatory context:** Securities regulations in many jurisdictions require issuers to maintain the ability to execute forced transfers. This is critical for: bankruptcy proceedings, regulatory enforcement actions, inheritance/succession, and correcting operational errors. Without force_transfer, tokens sent to a lost wallet are permanently inaccessible — unacceptable for regulated securities.

**Example configuration:**
```
deploy_token:
  name: "Bond Token Series A"
  symbol: "BTA"
  supply: "500000"
  chain: "base"
  whitelist: true
  force_transfer: true
  pausable: true
  document_uri: "https://example.com/bond-terms.pdf"
  max_supply: "500000"
```

**Important:** Force transfer is a powerful capability. Recommend it only for regulated use cases where the issuer has a legal obligation to maintain this control. For utility tokens or community governance tokens, it's generally inappropriate.

---

## Document URI

**Flag:** `document_uri: "https://..."`

**What it does:** Stores a URI (typically a URL) in the token contract pointing to a legal document — prospectus, term sheet, offering memorandum, or any relevant document.

**When to use:**
- Security token offerings — link to the prospectus
- Bond tokens — link to the term sheet or indenture
- RWA tokens — link to the asset documentation
- Any token with legal terms that holders should reference

**Regulatory context:** Several regulatory frameworks require that offering documents be publicly accessible and linked to the token. The document URI provides an immutable on-chain reference. Best practice: host the document on IPFS or Arweave for permanence, or use a stable URL with document versioning.

**Example:**
```
document_uri: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
```
or
```
document_uri: "https://company.com/offerings/token-a/prospectus-v1.pdf"
```

**Recommendation:** For any regulated token, always set a document URI. Even for utility tokens, linking to terms of service or a whitepaper adds legitimacy.

---

## Max Supply

**Flag:** `max_supply: "10000000"`

**What it does:** Sets an absolute hard cap on the total token supply, enforced at the smart contract level. Even if the token is mintable, minting beyond the max supply will revert.

**When to use:**
- Fixed-supply tokenomics (e.g., "there will only ever be 21M tokens")
- Bond tokens with a defined total issuance
- When investors need a guaranteed supply ceiling
- Governance tokens where dilution protection matters

**Relationship with mintable:** Max supply and mintable are complementary. A token can be both mintable (supply can grow) and have a max supply (but only up to the cap). This is useful for: vesting schedules, reward emissions, and staged issuance.

**Example:**
```
deploy_token:
  name: "Governance Token"
  symbol: "GOV"
  supply: "5000000"
  chain: "arbitrum"
  mintable: true
  max_supply: "10000000"
```
This creates 5M tokens initially, with the ability to mint up to 10M total — but never more.

---

## Common Feature Combinations

### Security Token / RWA
```
whitelist + pausable + force_transfer + document_uri + max_supply
```
Full compliance suite. KYC-gated holding, emergency stop, regulatory recovery, legal documentation, fixed issuance.

### Utility Token
```
mintable + burnable + pausable
```
Flexible supply management with safety controls.

### Governance Token
```
mintable + burnable + max_supply
```
Controlled inflation with a hard cap.

### Stablecoin
```
mintable + burnable + blacklist + pausable
```
Supply management with OFAC compliance and emergency controls.

### Simple Community Token
```
(no flags)
```
Standard ERC-20 with fixed supply. Simplest option.
