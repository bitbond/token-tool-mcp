# TokenTool MCP — Launch Brief
**Prepared: March 6, 2026 | For: Boss meeting**

---

## The One-Line Summary
We've built the first MCP server for compliant token issuance — anyone using Claude, Cursor, or any AI agent can now deploy a CertiK-audited token in 30 seconds by typing a sentence. It's open source, live, and ready to launch.

---

## What Is It (30-second version)
MCP (Model Context Protocol) is Anthropic's open standard that lets AI agents use real-world tools. Stripe, Alpaca, and Griffin already have MCP servers. **We built one for token issuance** — the first of its kind.

TokenTool MCP wraps our existing TokenTool infrastructure (8,300+ deployments, CertiK-audited) and makes it accessible to any AI agent. The barrier to deploying a compliant token drops from "hire a developer" to "type a sentence."

---

## Launch Status — What's Ready ✅ / What's Needed ⚠️

| Item | Status | Notes |
|------|--------|-------|
| MCP server code | ✅ Done | 11 tools, 10 chains, full lifecycle |
| README (v2, demo-first) | ⚠️ Needs swap | v2-README.md exists, needs to replace current README.md |
| npm publish | ⚠️ NOT DONE | `token-tool-mcp` not yet on npm — must do before launch |
| GitHub repo public | ⚠️ Unknown | Need to confirm/set public before launch |
| Smithery.yaml | ✅ Ready | File exists, ready to push |
| Demo GIF | ✅ Exists | `assets/demo-final.gif` ready |
| Demo video mashup | ✅ Done today | 30s mashup: cloud desktop + terminal + Telegram |
| HN post | ✅ Written | `launch/v2-hacker-news-post.md` |
| Twitter thread | ✅ Written | `launch/v2-twitter-thread.md` — 6 tweets |
| LinkedIn post | ✅ Written | `launch/v2-linkedin-post.md` |
| Reddit posts | ✅ Written | 3 posts: r/mcp, r/ethereum, r/LocalLLaMA in MONDAY-LAUNCH-FINAL.md |
| Registry submission list | ✅ Ready | 6 registries: awesome-mcp, official registry, mcp.so, Glama, PulseMCP, FastMCP |
| Blog post | ✅ Done today | See `launch/blog-post-mcp.md` |
| Outreach targets (MCP) | ✅ List ready | 5-10 targets below |
| Launch date | ⚠️ TBD | Was Monday March 9 — confirm today |

---

## Must-Do Before Launch (Pre-flight checklist)

1. **`npm publish`** — run from `~/clawd/projects/token-tool-mcp` with Bitbond npm credentials
2. **Swap README** — `cp launch/v2-README.md README.md && git commit -m "v2 README" && git push`
3. **Make GitHub repo public** — github.com/thendrix-eng/token-tool-mcp → Settings → Danger Zone → Make Public
4. **Push smithery.yaml** — already in launch folder, needs commit + push
5. **Test full flow on Sepolia** — deploy → get_token_info → mint → pause. Get real contract addresses for demo script.
6. **Update demo script** with real Sepolia contract addresses from test

---

## Launch Day Sequence (Monday March 9 — or date TBD)

| Time (CET) | Action |
|-----------|--------|
| 3:00 PM | Submit to 6 MCP registries |
| 4:00 PM | Post Show HN |
| 4:15 PM | Post Twitter thread (6 tweets, tag @AnthropicAI + @cursor_ai) |
| 4:20 PM | Quote-tweet the HN link |
| 4:30 PM | Post LinkedIn (company page) |
| 5:00–8:30 PM | Post to 7 communities (MCP Discord, r/mcp, r/ethereum, r/LocalLLaMA, ElizaOS Discord, etc.) |
| 10:00 PM | Email blast to existing TokenTool users |

---

## 5–10 People to Pitch This Afternoon

These are warm/targeted outreach targets for the MCP launch — developer advocates, newsletter writers, and ecosystem leads who can amplify:

### Tier 1 — High Impact, Should Reply Fast
| # | Person | Role | Why / Hook |
|---|--------|------|-----------|
| 1 | **David Soria Parra** | MCP Co-Creator @ Anthropic | Built the protocol — reaching out to the creator of MCP with a real-world use case is a strong signal. Will likely engage. |
| 2 | **Patrick Hughes** | Sr. Dev Advocate @ Base (Coinbase) | Base is one of our 10 chains. "Your users can now deploy tokens on Base via Claude" — direct product fit. |
| 3 | **Daniel Ortega** | Developer Relations @ Arbitrum Foundation | Same angle as Base — Arbitrum is supported. Dev advocates love showcasing third-party tooling. |
| 4 | **Anthony Sassano** | Founder @ The Daily Gwei (19K+ newsletter) | Ethereum-native newsletter, covers tooling and infrastructure. Short note + repo link. |
| 5 | **Jess Ramos** | Dev Advocate & AI Creator (450K+) | Builds Claude workflows, huge audience, covers exactly this kind of "Claude does X" content. |

### Tier 2 — Bigger targets, worth the shot
| # | Person | Role | Why / Hook |
|---|--------|------|-----------|
| 6 | **Bhaji Illuminati** | CEO @ Centrifuge | Leading RWA platform — MCP makes their stack more accessible to agentic workflows. |
| 7 | **Edwin Mata** | CEO @ Brickken | Forbes 40U40, democratizing tokenization — direct product alignment. |
| 8 | **Tom Serres** | "The Double Helix" newsletter | Covers AI x Web3 intersection — this is exactly his beat. |
| 9 | **Joachim Lebrun** | Head of Blockchain @ Apex/Tokeny | Created ERC-3643. MCP + compliance tokens = credibility story for his audience. |
| 10 | **David Hoffman** | Co-Founder @ Bankless | AI x crypto narrative leader, massive crypto media reach. |

**Suggested message format (short, fast):**
> "Hey [name] — just open-sourced TokenTool MCP, the first MCP server for compliant token issuance. 8,300+ deployments, CertiK-audited. You can deploy a token from Claude in 30 seconds. Thought you'd find it interesting: github.com/thendrix-eng/token-tool-mcp"

---

## Blog Post
Ready at: `projects/token-tool-mcp/launch/blog-post-mcp.md`
Title: *"Introducing TokenTool MCP: Deploy Compliant Tokens with AI Agents"*
~1,400 words, matches Bitbond blog style.

---

## What's Missing / Risks

| Risk | Mitigation |
|------|-----------|
| npm not published | Do it today — 10 min task |
| Repo still private | Make public day before launch |
| No real Sepolia addresses in demo | Test run Sunday |
| Launch date still Monday? | Confirm today — could move to next week if npm/repo not ready |
| Email list size unknown | Confirm with team how many TokenTool users to blast |

---

## Numbers to Know

- **8,300+** token deployments on TokenTool since 2020
- **10 chains**: ETH, Polygon, BNB, Arbitrum, Base, Optimism, Avalanche, Solana, Stellar + 3 testnets
- **11 MCP tools**: deploy, mint, burn, pause, unpause, transfer, query, estimate cost, list chains
- **$299** per mainnet deployment (same as web UI — testnet free)
- **CertiK audited** contracts
- **MIT licensed** — fully open source
- **6 registries** to submit to on launch day
- **7 communities** to post in on launch day
