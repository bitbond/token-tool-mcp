# Gap Analysis — TokenTool MCP vs Best-in-Class (Opus)
*Benchmarked against: Stripe MCP, Alpaca MCP, Griffin MCP, Shopify MCP*
*Updated March 3, 2026*

---

## What Changed from Sonnet v2 to Opus v2

### Fixed in this pass

| Issue | What was wrong | What changed |
|-------|---------------|-------------|
| **HN timing** | Checklist had HN at 10 AM CET (= 4 AM EST — dead zone) | All social/HN synchronized to 4 PM CET / 10 AM EST |
| **HN opened with self-promotion** | First sentence was "Bitbond's TokenTool has processed 12K..." | Now opens with the problem/gap, earns credibility after |
| **HN missing trust model** | No explanation of what happens when you call `deploy_token` | Full "How it works under the hood" section with 5-step flow |
| **HN $299 not addressed** | Fee mentioned but not contextualized | Proactively addressed inline + pre-written objection responses |
| **Twitter defensive framing** | Tweet 3 opened with "This isn't a toy" | Removed. Now states credibility directly without the negative frame |
| **Twitter too long** | 7 tweets — thread fatigue | Cut to 6. Merged/tightened. |
| **LinkedIn impersonal** | Read like a press release, no human voice | Added personal opening tied to actual work experience |
| **README missing VS Code + Claude Code** | Only showed Cursor deeplink | Added VS Code deeplink, Claude Code CLI command, and full Cursor manual config |
| **README missing `npx -y` flag** | `npx token-tool-mcp` may prompt for confirmation | Changed to `npx -y token-tool-mcp` everywhere |
| **README no "How it Works"** | Devs couldn't understand the trust model | Added full architecture flow: local signing → contract factory → on-chain |
| **README $299 not contextualized** | Just said "$299 flat fee" | Added: "Same price as the web UI. No subscription." in a proper section |
| **README Example Prompts not paired with outcomes** | Just a list of prompts | Now a table: prompt → what happens |

---

## Critical Gaps — All Fixed ✅

| # | Gap | Status |
|---|-----|--------|
| 1 | README led with features, not the demo | ✅ Fixed — demo first |
| 2 | Setup required git clone + absolute paths | ✅ Fixed — npx is primary |
| 3 | No one-click install | ✅ Fixed — Cursor + VS Code deeplinks |
| 4 | No badges | ✅ Fixed — 5 badges |
| 5 | No security section | ✅ Fixed — dedicated section |
| 6 | HN buried credibility | ✅ Fixed — restructured |
| 7 | Twitter had weak/defensive middle | ✅ Fixed — rewritten |
| 8 | No LinkedIn post | ✅ Fixed — founder voice with personal angle |
| 9 | HN timing wrong | ✅ Fixed — 4 PM CET / 10 AM EST |
| 10 | No trust model explanation | ✅ Fixed — README + HN both have architecture flow |
| 11 | $299 not proactively addressed | ✅ Fixed — contextualized everywhere |

---

## Still Outstanding — Action Required

### 🔴 Demo GIF/Video (P0 — blocks launch quality)
**Impact:** Massive. The demo GIF is the single most shared asset in any MCP launch. Without it:
- Twitter thread loses ~50% of its engagement potential
- HN post has no visual proof
- README "See It in Action" section is empty

**Action:** Record 45-60s in Claude Desktop on Sepolia. Convert to GIF. Embed in README and attach to Tweet 2.

### 🟡 Blog post (P1 — high impact, not a blocker)
**Impact:** Journalists, newsletters, and aggregators need a URL to link to that isn't GitHub. Every major MCP launch (Stripe, Alpaca, Griffin) had a companion blog post.
**Action:** Write a 500-word post for bitbond.com/blog. Can happen day-of or day-after.

### 🟡 npm scope (P2 — professionalism signal)
**Impact:** `@bitbond/token-tool-mcp` is more credible than `token-tool-mcp`. But it requires a Bitbond npm org. Not urgent — can rebrand after initial traction.

### 🟢 Competitive positioning page (P3 — nice to have)
**Impact:** A "TokenTool MCP vs Thirdweb MCP vs Coinbase AgentKit" comparison table would dominate search and be highly shareable. Good week-2 content.

---

## Competitive Landscape

| Product | What it does | Compliance features | Networks | Audit |
|---------|-------------|-------------------|----------|-------|
| **TokenTool MCP** | Compliant token issuance + lifecycle | ✅ Full (whitelist, blacklist, pausable, force transfer, doc URI) | 12 | CertiK |
| **Thirdweb Deploy** | Generic smart contract deployment | ❌ None | Multi | No |
| **Coinbase AgentKit** | Wallet ops + basic ERC-20 | ❌ None | Limited | No |
| **Griffin MCP** | Banking (accounts, payments) | N/A (different domain) | N/A | N/A |
| **Alpaca MCP** | Trading (equities, crypto, options) | N/A (different domain) | N/A | N/A |

**Key differentiator:** TokenTool MCP is the only MCP server that combines token deployment with enterprise compliance features. This is the wedge for RWA issuers and institutional platforms.

---

## Quality Assessment

| Document | Sonnet v2 Grade | Opus v2 Grade | Key improvement |
|----------|----------------|---------------|-----------------|
| README | B+ | A | Trust model, VS Code/Claude Code, contextualized pricing |
| Twitter | B | A- | Tighter (6 vs 7), no defensive framing, better hook |
| HN | B+ | A | Problem-first opening, trust model, pre-written objection responses |
| LinkedIn | B- | A- | Personal angle, fewer hashtags, authentic voice |
| Checklist | B+ | A | Fixed critical timing error, phased structure, objection cheat sheet |
