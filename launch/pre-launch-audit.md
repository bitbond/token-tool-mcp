# Pre-Launch Audit — TokenTool MCP
**Date:** March 4, 2026, 01:10 CET  
**Launch:** March 4, 2026, 4:00 PM CET / 10:00 AM EST  
**Time remaining:** ~15 hours

---

## ✅ What's Ready

### Launch Documents
- **v2-README.md** — Excellent. Demo-first structure, all 4 install methods (Claude Desktop, Cursor, VS Code, Claude Code), `npx -y` flag everywhere, pricing contextualized, security section, architecture flow, CLI docs. Grade: A.
- **v2-twitter-thread.md** — Tight 6-tweet thread, good hook, demo placeholder, credibility without defensiveness, clear CTA with giveaway. Timing locked to 4 PM CET / 10 AM EST.
- **v2-hacker-news-post.md** — Problem-first opening, full trust model ("How it works under the hood"), pre-written objection responses ready. Strongest of the social posts.
- **v2-linkedin-post.md** — Product announcement voice, factual, hashtags capped at 5, first-comment strategy.
- **v2-launch-checklist.md** — Phased structure (registries → HN → Twitter → LinkedIn → communities → email), success metrics defined, objection cheat sheet.
- **v2-gap-analysis.md** — All 11 critical gaps from Sonnet v2 marked as fixed.

### Code & Repo
- **11 MCP tools confirmed** — `server.tool()` called exactly 11 times in `src/index.js`. Matches all docs.
- **14 chains in code** (ethereum, polygon, bnb, arbitrum, base, optimism, avalanche, sepolia, base-sepolia, bnb-testnet, solana, solana-devnet, stellar, stellar-testnet). Docs say "10 networks" — see ⚠️ below.
- **Solana + Stellar adapters exist** — `src/solana.js` and `src/stellar.js` present with real implementations.
- **package.json** — v1.1.0, MIT, Node ≥18, proper `bin` entries for both `token-tool-mcp` and `token-tool`, all dependencies listed.
- **Demo assets ready** — `assets/` has demo.svg, demo.gif, demo-final.gif, demo-final.mp4, demo-hq.gif. Multiple formats available.
- **registry.json in .gitignore** — Confirmed. Won't leak test deployments.
- **LICENSE file exists** — MIT.
- **Sepolia test deployments verified** — 5 successful deployments in registry.json, most recent from today (March 3). Working end-to-end.

### Fact Check — Core Claims
| Claim | Status | Notes |
|-------|--------|-------|
| 8,300+ deployments | ✅ Correct | All v2 docs say "8,300+" consistently |
| $299 mainnet / free testnet | ✅ Correct | Consistent across README, HN, Twitter, LinkedIn |
| 11 tools | ✅ Correct | Verified in source code |
| CertiK audited | ✅ Consistent | Referenced throughout |
| 4 PM CET / 10 AM EST | ✅ Consistent | All docs use same timing |
| `npx -y` flag | ✅ Present | All install examples include `-y` |

---

## ⚠️ What Needs Fixing

### 1. 🟠 GitHub Repo URL Mismatch (HIGH)
**package.json** has `"url": "https://github.com/bitbond/token-tool-mcp"` but ALL launch docs reference `github.com/thendrix-eng/token-tool-mcp`. These must match before npm publish.

**Fix:** Decide which GitHub org/user hosts the repo. Update package.json `repository.url` and `homepage` accordingly. If launching under Bitbond org, update all launch docs. If under thendrix-eng, update package.json.

### 2. 🟠 "12K deployments" Remnant in Objection Cheat Sheet (HIGH)
**v2-launch-checklist.md** objection section still says: `"12K deployments — proof?"` — This is the OLD number. All other docs correctly say "8,300+" but this one row was missed.

Also appears in:
- `hacker-news-post.md` (v1, not v2 — old file, but still in launch dir)
- `review.html` and `review-light.html` (2 occurrences each)

**Fix:** Change to `"8,300+ deployments — proof?"` in v2-launch-checklist.md. Consider deleting or archiving v1 files to avoid confusion on launch day.

### 3. 🟡 Network Count: Code Has 14, Docs Say 12 (MEDIUM)
The `chains.js` registry has 14 entries (includes solana-devnet and stellar-testnet). The v2-README says "12 Networks" in the badge and body. If someone runs `list_chains`, they'll see 14.

**Options:**
- A) Update docs to say "14 networks" (more accurate)
- B) Keep "12" and count solana-devnet/stellar-testnet as variants of Solana/Stellar (defensible — the badge already says "12 Networks")

**Recommendation:** Keep "12" — it's counting distinct networks, not testnet variants. But be prepared for this comment on HN. The README already lists all the specific names clearly.

### 4. 🟡 Old README Not Yet Replaced (MEDIUM)
The current repo root `README.md` is still the OLD version (no badges, no demo section, says `node src/index.js` instead of `npx`, references `github.com/bitbond/token-tool-mcp`). The checklist item "Replace repo root README.md with v2-README.md content" is still unchecked.

**Fix:** This is today's task per the checklist. Must happen before making repo public.

### 5. 🟡 npm Not Yet Published (MEDIUM)
The package hasn't been published to npm yet (per checklist — this is planned for today). The `npx -y token-tool-mcp` command won't work until this happens.

**Fix:** Per checklist. Publish, then verify from a clean temp directory.

### 6. 🟡 Demo GIF Embed (LOW-MEDIUM)
The v2-README references `./assets/demo.svg` but demo GIF files also exist. The gap analysis flagged this as P0. Demo files exist — just needs to be the right one embedded and visible after README replacement.

**Fix:** When replacing README, verify the demo.svg renders correctly on GitHub. If it doesn't (SVGs with animations can be finicky), switch to demo-final.gif.

---

## 🔴 Blockers

**None identified.** All remaining items are T-1 day prep tasks already on the checklist. As long as these are completed before 4 PM CET:

1. Replace README with v2 version
2. Fix repo URL in package.json (or launch docs)  
3. Fix "12K" → "8,300+" in checklist objection row
4. npm publish
5. Make repo public
6. Verify `npx -y token-tool-mcp` from clean directory

---

## Updated Competitive Intel (March 4, 2026)

### New Developments Since Research Was Done

#### 🆕 Injective MCP Server (launched ~Feb 26, 2026)
- **What:** Open-source MCP server for AI-native perpetual futures trading on Injective
- **Scope:** Trading execution (derivatives), NOT token issuance
- **Impact on positioning:** LOW — different use case (trading vs. issuance). Actually validates the trend. Can reference it as "Injective built one for derivatives trading, we built one for compliant token issuance."
- **Source:** crypto-economy.com, cryptowisser.com

#### 🆕 Coinbase Agentic Wallets + Payments MCP (Feb 2026)
- **What:** Coinbase launched Agentic Wallets + expanded their Payments MCP for AI agents
- **Scope:** Wallet infrastructure, payments, stablecoin transfers. NOT token deployment or compliance features
- **Impact on positioning:** MEDIUM — validates the "agentic finance" narrative. Coinbase is wallet/payments; TokenTool is issuance/compliance. Complementary, not competitive.
- **Good for HN framing:** "Coinbase handles wallets. Alpaca handles trading. We handle compliant issuance."

#### 🆕 LILT MCP Server (March 3, 2026 — yesterday)
- Enterprise AI translation MCP server. Completely different domain. No impact.

#### 🆕 RecordPoint MCP Server (March 3, 2026)
- Enterprise data compliance MCP server. Different domain but validates the compliance-focused MCP trend.

### awesome-mcp-servers Status
- **Stars:** ~22,500+ (based on secondary source from skillsmp.com showing 22,473 stars as of Feb 25)
- **Finance/Blockchain category:** Exists. TokenTool would fit under a Finance or Blockchain subcategory. The repo is massive — a well-crafted PR has good chances.
- **Note:** The repo now links to glama.ai/mcp/servers as the web directory

### MCP Ecosystem Scale
- **FastMCP** reports 1,864+ MCP servers in their directory
- **n8n Blog** (March 2, 2026) published "20 Best MCP Servers for Developers" — shows the space is getting curated-list attention
- **MCP has a Wikipedia page** — signal of mainstream adoption
- **"Are MCP servers a thing of the past?"** — Substack think piece from last week questioning MCP's future vs direct APIs. Could surface on HN. Be ready to counter.

### HN MCP Posts This Week
| Post | Engagement | Notes |
|------|-----------|-------|
| "MCP server that reduces Claude Code context by 98%" | Active (11h ago) | Dev tooling angle, strong engagement |
| "Show HN: MCP Playground – free test servers + 10K list" | Active (2 days ago) | Infrastructure/tooling |
| "Show HN: MCP server that strips injection vectors, cuts tokens 93%" | Active (3 days ago) | Security angle |
| "Show HN: Reflex – local code search + MCP server" | Active (2 days ago) | Dev tooling |
| "Show HN: ContextForge – Persistent memory MCP server" | Active (4 days ago) | Memory/context |

**Pattern:** Dev tooling and infrastructure MCPs are doing well on HN right now. Security and cost-efficiency angles resonate. The "compliant token issuance" angle is genuinely novel — nothing similar has been posted.

### Registry Submission Processes
- **Smithery.ai:** Still active. `smithery.yaml` file exists in launch dir. Submit via `npx @smithery/cli register`. Reddit indicates it's still a solid option.
- **mcp.so:** 16K+ servers. Form-based submission. No process changes detected.
- **Glama.ai:** Running the web directory for awesome-mcp-servers. Has MCP inspector tool. Submit via their form.
- **FastMCP:** New player — 1,864+ servers. Consider adding to the registry list.
- **PulseMCP:** Still accepting submissions per checklist.

---

## Final Recommendations

### Must-Do Today (Before 4 PM CET)

1. **Fix package.json repo URL** — Align with actual GitHub location. This affects npm page links.
2. **Replace root README.md** with v2-README.md content. Commit + push.
3. **Fix "12K" in v2-launch-checklist.md** objection row → "8,300+"
4. **npm publish** — Then test `npx -y token-tool-mcp` from `/tmp`
5. **Make repo public**
6. **Verify demo.svg renders** on GitHub after push. If not, swap to GIF.

### Launch Day Tactical

7. **Add FastMCP to registry submission list** — they have 1,864+ servers, growing fast
8. **Prepare a one-liner for the "MCP is dead" angle** — the Substack piece may come up. Response: "MCP is the most adopted agent protocol. 22K+ stars on the awesome list, 1,800+ servers, Wikipedia page. The question isn't whether MCP survives — it's which infrastructure providers publish servers first."
9. **Reference Injective + Coinbase in HN comments** if the "why blockchain MCP?" question comes up — "Injective just launched one for derivatives trading, Coinbase has Payments MCP. The agentic finance stack is real, and compliant issuance was the missing piece."
10. **Don't tag too aggressively on Twitter** — Tag @AnthropicAI and @cursor_ai as planned, but avoid mass-tagging. The content is strong enough.

### Post-Launch (Day 2-3)

11. **Write the Bitbond blog post** — gap analysis flagged this as P1. Journalists need a URL that isn't GitHub.
12. **Consider the "vs" comparison page** — "TokenTool MCP vs Thirdweb vs Coinbase AgentKit" would be good SEO content for week 2.
13. **Monitor the "God Key" security narrative** — SecurityBoulevard just published an article about MCP server security concerns with long-lived tokens. The TokenTool approach (local env var, stdio, no network listener) is actually a strong counter to this narrative. Be ready to reference it.

---

## Confidence Level

**8.5/10 — Ready to launch.**

The docs are polished, the code works (verified by Sepolia deployments), the positioning is differentiated, and the competitive landscape is favorable. The remaining items are all mechanical prep tasks. No strategic blockers.

The biggest risk is the demo GIF not rendering properly on GitHub and the repo URL mismatch. Both are fixable in < 30 minutes.
