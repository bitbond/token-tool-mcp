# MORNING CHECKLIST — March 9, 2026 (Launch Day)
**For travi at 3:00 PM CET | Launch: 4:00 PM CET**

---

## GO / NO-GO: 🟡 GO (with 2 manual steps remaining)

All prep work is done. Two expected blockers remain — both are manual steps you planned for today.

---

## ❌ BLOCKING — Must Fix Before 4 PM

### 1. npm Publish
**Status:** Package name reserved, zero versions published. `npx -y token-tool-mcp` will fail until this is done.

```bash
cd ~/clawd/projects/token-tool-mcp
npm login          # Bitbond npm account
npm publish --access public
```

**Verify (from clean directory):**
```bash
cd /tmp && rm -rf test-mcp && mkdir test-mcp && cd test-mcp
npx -y token-tool-mcp
# Should print: "Bitbond TokenTool MCP server running (stdio)" to stderr
```

**Also verify:** https://www.npmjs.com/package/token-tool-mcp shows v1.1.0

⏱️ **Time needed:** 5-10 minutes

---

### 2. Make Repo Public
**Status:** Private (confirmed via GitHub API). Stars: 0. Nobody can see it.

**Steps:**
1. Go to https://github.com/thendrix-eng/token-tool-mcp
2. Settings → Danger Zone → Change repository visibility → Make public
3. Confirm

**Verify:**
- Open in incognito: https://github.com/thendrix-eng/token-tool-mcp
- README renders with demo GIF
- Badges display (npm badge will work after step 1)
- No internal files visible (check .gitignore is correct — it is)

⏱️ **Time needed:** 2 minutes

---

## ✅ READY — Verified and Good to Go

| Item | Status | Verified How |
|------|--------|-------------|
| README is v2 (demo-first, all install methods) | ✅ | Compared README.md to v2-README.md — identical |
| 11 MCP tools in code | ✅ | `grep -c "server.tool" src/index.js` = 11 |
| 14 chains in code, "12" in docs | ✅ | Defensible — testnets as variants |
| package.json repo URL = thendrix-eng | ✅ | Verified in file |
| LICENSE (MIT) exists | ✅ | File present |
| .gitignore covers registry.json + .env | ✅ | Both listed |
| Demo assets (demo-final.gif) exist | ✅ | File confirmed in assets/ |
| smithery.yaml committed | ✅ | Commit ea51856 |
| Sepolia test deployments working | ✅ | 9 deployments in registry |
| "12K" remnants removed from all v2 docs | ✅ | Grepped — clean |
| All docs consistent (8,300+ / 11 tools / 12 chains / $299) | ✅ | Cross-checked all 5 docs |
| HN post ready | ✅ | v2-hacker-news-post.md |
| Twitter thread ready (6 tweets) | ✅ | v2-twitter-thread.md |
| LinkedIn post ready | ✅ | v2-linkedin-post.md |
| Reddit posts pre-written (r/mcp, r/ethereum, r/LocalLLaMA) | ✅ | In MONDAY-LAUNCH-FINAL.md |
| Objection cheat sheet ready | ✅ | 7 objections + responses |
| Git history clean | ✅ | No sensitive data in commits |

---

## ⚠️ NICE-TO-HAVE — Fix If Time Permits

### 1. Demo GIF Absolute URL (5 min)
README uses `./assets/demo-final.gif` (relative path). This works on GitHub but the GIF won't render on npmjs.com. Change to:
```
https://raw.githubusercontent.com/thendrix-eng/token-tool-mcp/main/assets/demo-final.gif
```

```bash
cd ~/clawd/projects/token-tool-mcp
# Edit README.md: replace ./assets/demo-final.gif with absolute URL
git add README.md && git commit -m "fix: use absolute URL for demo GIF" && git push
```

### 2. Add "MCP is Dead" Objection to Cheat Sheet (2 min)
The "MCP is dead. Long live the CLI" blog post went viral on March 2. This WILL come up on HN. Prepared response:

> "We ship both a CLI (`token-tool deploy --chain base`) and the MCP server. CLI for scripts and CI/CD. MCP for agents that need multi-step workflows. Different interfaces, same engine."

### 3. MCP Server Version Mismatch (1 min)
`src/index.js` has `version: '1.0.0'` in the McpServer constructor, but `package.json` is `1.1.0`. Cosmetic only, but easy fix:
```bash
cd ~/clawd/projects/token-tool-mcp
sed -i '' "s/version: '1.0.0'/version: '1.1.0'/" src/index.js
git add src/index.js && git commit -m "fix: align MCP server version with package.json" && git push
```

### 4. Fresh Sepolia Test Deployment (10 min)
Run a live test to get fresh contract addresses for the demo script. Current registry has 9 deployments, most recent timestamp unknown.

---

## 📅 LAUNCH DAY TIMELINE

| Time (CET) | Action | Duration |
|-------------|--------|----------|
| **3:00 PM** | npm publish + verify `npx -y` from /tmp | 10 min |
| **3:10 PM** | Make repo public + verify in incognito | 5 min |
| **3:15 PM** | Apply nice-to-have fixes (demo URL, version) if time | 10 min |
| **3:25 PM** | Smithery registration: `npx @smithery/cli register token-tool-mcp` | 5 min |
| **3:30 PM** | Submit to registries: awesome-mcp-servers PR, mcp.so, Glama.ai, PulseMCP, FastMCP | 30 min |
| **4:00 PM** | **🚀 Submit HN post** — Title + body from v2-hacker-news-post.md | 5 min |
| **4:02 PM** | Post first HN comment: demo GIF link + "Happy to answer" | 2 min |
| **4:05 PM** | **Start HN comment monitoring** — respond to EVERY comment within 10 min | Ongoing |
| **4:15 PM** | **Post Twitter thread** (Tweet 1, self-reply all 6 within 90s each, pin Tweet 1) | 5 min |
| **4:20 PM** | Quote-tweet HN link | 1 min |
| **4:30 PM** | **Post LinkedIn** (Bitbond company page + first comment) | 5 min |
| **5:00 PM** | MCP Discord #show-and-tell | 5 min |
| **5:00–9:00 PM** | Communities (staggered every 30 min per schedule) | Ongoing |
| **10:00 PM** | Email blast to TokenTool web users | 10 min |

---

## 🔥 FIRST 2 HOURS — CRITICAL RULES

1. **Respond to EVERY HN comment within 10 minutes.** This is the #1 factor for front-page traction.
2. **Don't QRT negative Twitter takes** — reply directly.
3. **Have the "MCP is dead" response ready** — it's coming.
4. **Demo GIF must be attached to Tweet 2** — non-negotiable.
5. **Tag only @AnthropicAI and @cursor_ai** — no mass-tagging.

---

## 🚨 IF SOMETHING BREAKS

| Problem | Fix |
|---------|-----|
| npm publish fails | Check npm login, verify `npm whoami`, try `npm publish --access public` again |
| `npx -y` doesn't work after publish | npm cache: `npm cache clean --force`, wait 2-3 minutes for CDN propagation |
| Demo GIF doesn't render on GitHub | Swap to `demo.svg` or `demo-hq.gif` — both exist in assets/ |
| Repo shows stale README after making public | Force-refresh, check GitHub CDN (can take 1-2 min) |
| HN submission rejected/flagged | Re-read Show HN guidelines, ensure title format is correct, re-submit |
| Smithery registration fails | Skip — not blocking. Submit manually later. |
| Registry PRs rejected | Normal — follow up politely. These take 1-7 days. |

---

## 📊 Day 1 Success Signals

By 10 PM tonight:
- [ ] HN post has 10+ upvotes
- [ ] At least 1 meaningful HN comment conversation
- [ ] npm install count > 0 (check `npm info token-tool-mcp`)
- [ ] GitHub stars > 5
- [ ] Twitter thread has 5+ replies/quotes
- [ ] At least 2 registry submissions confirmed

**Exceptional if:** HN front page, 50+ GitHub stars, 20+ npm installs, inbound DMs.

---

*Last updated: March 9, 2026, 8:55 AM CET*
*Based on: AUDIT-TECHNICAL, AUDIT-CONTENT, AUDIT-COMPETITIVE — same date*
