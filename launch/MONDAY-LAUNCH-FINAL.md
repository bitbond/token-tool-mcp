# 🚀 TOKEN TOOL MCP — MONDAY LAUNCH FINAL
**Target: Monday March 9, 2026**
**Launch: 4:00 PM CET / 10:00 AM EST**
*Consolidated from all launch docs — this is the only file you need*

---

## SUNDAY NIGHT PREP (March 8)

### 1. README + Code (30 min)
```bash
cd ~/clawd/projects/token-tool-mcp
cp launch/v2-README.md README.md
git add README.md
git commit -m "v2 README: demo-first, npx install, all platforms"
git push
```
- Verify demo GIF renders on GitHub (if SVG fails, swap to demo-final.gif)
- Confirm `data/registry.json` is in `.gitignore`
- Confirm LICENSE (MIT) exists

### 2. npm Publish (15 min)
```bash
cd ~/clawd/projects/token-tool-mcp
npm login   # Bitbond npm account
npm publish --access public
```
Then test from clean dir:
```bash
cd /tmp && mkdir test-mcp && cd test-mcp
npx -y token-tool-mcp
```
Verify: https://www.npmjs.com/package/token-tool-mcp

### 3. Make Repo Public (5 min)
- https://github.com/thendrix-eng/token-tool-mcp → Settings → Danger Zone → Public
- Verify: README renders, badges display, no internal files exposed

### 4. Smithery Setup (5 min)
```bash
cd ~/clawd/projects/token-tool-mcp
cp launch/smithery.yaml smithery.yaml
git add smithery.yaml && git commit -m "add smithery.yaml" && git push
npx @smithery/cli register token-tool-mcp
```

### 5. Full Test Run (10 min)
Run complete Sepolia flow: deploy → get_token_info → mint → pause → unpause → transfer
Record actual contract addresses for demo script update.

---

## LAUNCH DAY — EXACT TIME BLOCKS

### 3:00 PM CET — Registry Submissions (1 hour before social)

| # | Registry | Action | Time |
|---|----------|--------|------|
| 1 | **awesome-mcp-servers** | PR to punkpeye/awesome-mcp-servers | 3:00 |
| 2 | **Official MCP Registry** | PR to modelcontextprotocol/registry | 3:10 |
| 3 | **mcp.so** | Submit form → paste GitHub URL | 3:15 |
| 4 | **Glama.ai** | Submit form → paste GitHub URL | 3:20 |
| 5 | **PulseMCP** | Submit form | 3:25 |
| 6 | **FastMCP** | Submit (1,864+ servers, growing) | 3:30 |

**awesome-mcp-servers PR entry:**
```
- [token-tool-mcp](https://github.com/thendrix-eng/token-tool-mcp) — Deploy and manage CertiK-audited ERC-20 tokens with compliance features (whitelist, blacklist, pausable) from Claude, Cursor, or any AI agent. 12 networks.
```

### 4:00 PM CET — Show HN

- Submit at news.ycombinator.com/submit
- **Title:** `Show HN: TokenTool MCP – Deploy CertiK-audited ERC-20 tokens from Claude/Cursor in 30 seconds`
- **Body:** Copy from v2-hacker-news-post.md (exclude objection responses — those are your cheat sheet)
- Immediately post first comment: demo GIF link + "Happy to answer anything about the architecture, the CertiK audit, or MCP development."
- **RESPOND TO EVERY COMMENT WITHIN 10 MINUTES FOR FIRST 2 HOURS**

### 4:15 PM CET — Twitter Thread

- Post Tweet 1 from v2-twitter-thread.md
- Self-reply each tweet within 90 seconds
- Pin Tweet 1
- Tag @AnthropicAI in Tweet 1, @cursor_ai in Tweet 5
- **ATTACH DEMO GIF TO TWEET 2** (non-negotiable)

### 4:20 PM CET — Quote-tweet HN link
> "Just posted on Show HN. Curious what the crowd thinks. 👀 [HN link]"

### 4:30 PM CET — LinkedIn

- Post from Bitbond company page (v2-linkedin-post.md)
- Immediately add first comment with links
- Post personal take tagging company post

### 5:00–9:00 PM CET — Communities (stagger every 30 min)

| Time | Community | Angle |
|------|-----------|-------|
| 5:00 | MCP Discord #show-and-tell | Dev-focused, friendliest audience |
| 5:30 | Anthropic Developer Discord #mcp | Semi-official, higher bar |
| 6:00 | r/mcp | Dev-focused, link to repo + HN |
| 7:00 | r/ethereum | Compliance/RWA angle — NOT the AI angle |
| 7:30 | ElizaOS Discord | Agent builder framing |
| 8:00 | r/LocalLLaMA | Local tool calling, MCP native |
| 8:30 | r/SolDev | SPL token support angle |

### 10:00 PM CET — Email Blast

To existing TokenTool web users:
- **Subject:** "TokenTool now works with AI agents"
- **Body:** 3 sentences + repo link. Don't over-explain.

---

## REDDIT POSTS (Pre-Written)

### r/mcp
**Title:** TokenTool MCP — first MCP server for compliant token issuance

We just open-sourced an MCP server that deploys CertiK-audited ERC-20 tokens with compliance features (whitelist, blacklist, pausable, force transfer) from Claude, Cursor, or any MCP client.

11 tools covering deploy → mint → burn → pause → transfer → query. 12 chains. stdio transport. Private key stays local.

TokenTool has powered 8,300+ real-world deployments since 2020. The MCP server wraps the same production infrastructure — same CertiK-audited contracts, same reliability.

Quick start: `npx -y token-tool-mcp` + add to your Claude Desktop config.

GitHub: https://github.com/thendrix-eng/token-tool-mcp

Happy to answer questions about MCP server development or the token infrastructure.

---

### r/ethereum
**Title:** Open-sourced an MCP server for compliant ERC-20 issuance — whitelist, blacklist, pausable, force transfer

We've been running TokenTool (tokentool.bitbond.com) since 2020 — 8,300+ deployments, CertiK-audited contracts. Just shipped an MCP server so AI agents can deploy and manage compliant tokens directly.

Why this matters for Ethereum: RWA issuers and institutional platforms need compliance features at the contract level. This makes that infrastructure programmable via AI agents — useful for platforms that issue tokens at scale.

Not a generic deployer. Specifically built for tokens that need investor whitelists, transfer restrictions, and emergency controls. 12 networks including Ethereum mainnet, Polygon, Arbitrum, Base, Optimism.

Testnet is free. Mainnet is $299/token (same as web UI).

MIT licensed: https://github.com/thendrix-eng/token-tool-mcp

---

### r/LocalLLaMA
**Title:** TokenTool MCP — deploy tokens from your local AI agent (MCP server, no cloud dependency)

Built an MCP server that works with any MCP-compatible local client. Deploy CertiK-audited ERC-20 tokens with compliance features from your local agent workflow.

stdio transport, no cloud dependency, no HTTP listener. Private key stays local in env var (same approach as Hardhat/Foundry). Works with Claude Desktop, Cursor, VS Code, any MCP client.

11 tools: deploy, mint, burn, pause, transfer, query across 12 chains. Testnet is free.

Interesting for anyone building autonomous agent systems that need on-chain capabilities without relying on external APIs.

`npx -y token-tool-mcp` and add to your config. Done.

Repo: https://github.com/thendrix-eng/token-tool-mcp

---

## OBJECTION CHEAT SHEET (for HN comments)

| Objection | Response |
|-----------|----------|
| **"$299 is expensive"** | Same price as web UI. CertiK-audited contracts with compliance features. Auditing contracts independently = $10K-$50K+. Testnet is free — start there. |
| **"Private key in env var?"** | Standard for local dev tools (Hardhat, Foundry). Never logged, never transmitted. stdio transport = no network listener. Hardware wallet on roadmap Q2. |
| **"Just a wrapper?"** | Yes — so is Stripe's MCP server, and Alpaca's. MCP servers make infra addressable by agents through a standard protocol. |
| **"Why not Thirdweb?"** | Thirdweb handles generic contract deployment. TokenTool MCP is for compliant issuance — whitelist, blacklist, pausable, force transfer. Different use cases. |
| **"8,300+ deployments — proof?"** | tokentool.bitbond.com — visible on site. Bitbond GmbH is a regulated German fintech, operating since 2013. |
| **"Scam tokens?"** | $299 fee + compliance features + BaFin-regulated company = poor choice for scammers vs free alternatives. Compliance features are what regulators expect, not what scammers want. |
| **"MCP is dead"** | 35K+ stars on awesome list, 16K+ listed servers, Wikipedia page. The question isn't whether MCP survives — it's which infra providers publish servers first. |

---

## SUCCESS METRICS

| Metric | Minimum | Target | Exceptional |
|--------|---------|--------|-------------|
| GitHub stars (48h) | 30 | 100 | 500+ |
| npm installs (week 1) | 50 | 200 | 1000+ |
| HN front page | Top 50 | Top 20 | Top 5 |
| Twitter impressions | 10K | 50K | 200K+ |
| Registry listings live | 3 | 5 | 7 |
| Inbound messages | 3 | 10 | 30+ |

---

## DAY 2 (Tuesday)

- Sweep: HN comments, Twitter replies, GitHub issues
- Post "Which chains?" follow-up tweet
- Post "Day 1 results" tweet — raw numbers, transparency
- Check registry PRs
- Run GitHub stargazer query — flag target-company employees
- Fix any bugs that surfaced → tweet about fixes

## DAY 3 (Wednesday)

- Post "MCP is the new API" thought piece tweet
- Cross-post to LinkedIn
- Begin partnership outreach:
  - **CertiK:** Co-marketing on audit + MCP angle
  - **Dune Analytics:** Integration story (deploy via TokenTool → track via Dune)
  - **Anthropic DevRel:** Featured MCP server case study
- Compile full launch metrics

---

## ⚠️ RULES

- Never send from personal Bitbond account unless agreed
- All public repo content reviewed — no internal notes exposed
- Private key docs clearly say env var only, never hardcoded
- Don't QRT negative takes — reply directly
- Respond to EVERY comment in first 2 hours
- Don't mass-tag on Twitter — @AnthropicAI + @cursor_ai only

---

## DEMO SCRIPT — ACTUAL DEPLOYMENT

**Contract deployed on Sepolia (use real addresses from Sunday test run):**

```
Agent: "Deploy a token called Green Bond A, 1M supply on Sepolia, 
        symbol GBA, with whitelist and pausable enabled"

→ Calling deploy_token...
→ Deploying CertiK-audited ERC-20...

✅ Deployed successfully!

Contract:  0xC8fbE59298f07CB41f2B7EEA2cB1b55Db8c78569
Chain:     Sepolia Testnet
Name:      Green Bond A  
Symbol:    GBA
Supply:    1,000,000
Features:  whitelist ✓  pausable ✓
Tx:        0xff6f392...a01fa001
```

**Update these addresses after Sunday's test deployment. Use REAL addresses from REAL transactions.**

---

*This file consolidates: MONDAY-LAUNCH-CHECKLIST.md, v2-launch-checklist.md, TODAY-pre2pm.md, pre-launch-audit.md, post-launch-playbook.md, and all community/Reddit/objection docs.*
*This is the only launch doc you need on Monday.*
