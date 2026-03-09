# Launch Checklist — v2 (Opus)
*Target: Wednesday March 4, 2026*
*All social + HN synchronized to 4 PM CET / 10 AM EST (peak developer window)*

---

## T-1 Day (Today, Tuesday March 3) — Prep

### Code & Repo
- [ ] Replace repo root `README.md` with `v2-README.md` content. Commit.
- [ ] Verify `npx -y token-tool-mcp` works end-to-end from a clean directory
- [ ] Run full Sepolia flow: `deploy → get_token_info → mint → pause → unpause → transfer`
- [ ] Confirm `data/registry.json` is either empty or in `.gitignore`
- [ ] Confirm `LICENSE` file exists (MIT)
- [ ] Confirm all 5 README badges will render (they reference npm — won't fully work until publish)
- [ ] Verify Cursor deeplink URL actually works (click it, see if Cursor opens with config)
- [ ] Verify VS Code deeplink URL works

### npm Publish
```bash
cd ~/clawd/projects/token-tool-mcp
npm login          # Bitbond npm account
npm publish --access public
```
- [ ] Verify: https://www.npmjs.com/package/token-tool-mcp
- [ ] Test `npx -y token-tool-mcp` from a temp directory — confirm it starts the MCP server
- [ ] Test `npm install -g token-tool-mcp` — confirm `token-tool` CLI command works

### Make Repo Public
- [ ] github.com/thendrix-eng/token-tool-mcp → Settings → Danger Zone → Change visibility → Public
- [ ] Verify: README renders correctly, badges display, deeplinks work, no internal files exposed

### 🎬 Demo Video — CRITICAL (do today, before launch)
This is the single highest-impact asset. Without it, the Twitter thread loses half its power and the HN post has no visual.

Record 45–60 seconds:
1. Open Claude Desktop (clean conversation)
2. Type a deploy prompt targeting Sepolia
3. Show the MCP tool call happening (Claude will display the tool invocation)
4. Show the contract address returned
5. **Bonus**: Open Sepolia Etherscan, paste the contract address, show it's real

Tools:
- **Screen recording**: QuickTime (macOS) → File → New Screen Recording
- **Convert to GIF**: [Gifski](https://gif.ski/) or `ffmpeg -i demo.mp4 -vf "fps=10,scale=800:-1" demo.gif`
- **Keep the MP4** for LinkedIn (supports video) and HN (link in comments)

- [ ] GIF created and embedded in README under "See It in Action"
- [ ] MP4 saved for LinkedIn post

---

## Launch Day (Wednesday March 4)

### Phase 1: Registries — 3:00 PM CET (do 1 hour before social)

**Why first**: registry PRs take time to review. Submit early so they're pending when traffic arrives.

| # | Registry | Stars/Size | Action |
|---|----------|-----------|--------|
| 1 | **awesome-mcp-servers** | 35K+ ⭐ | PR to `punkpeye/awesome-mcp-servers` — add under Finance/Blockchain |
| 2 | **Official MCP Registry** | — | PR to `modelcontextprotocol/registry` (requires npm published) |
| 3 | **Smithery.ai** | 10K+ servers | `cp launch/smithery.yaml smithery.yaml && git push`, then `npx @smithery/cli register token-tool-mcp` |
| 4 | **mcp.so** | 16K+ servers | Submit form → paste GitHub URL |
| 5 | **Glama.ai** | — | Submit form → paste GitHub URL |
| 6 | **PulseMCP** | 5K+ servers | Submit form |
| 7 | **MCP Server Finder** | — | Submit form |

**awesome-mcp-servers PR text:**
```
- [token-tool-mcp](https://github.com/thendrix-eng/token-tool-mcp) — Deploy and manage CertiK-audited ERC-20 tokens with compliance features (whitelist, blacklist, pausable) from Claude, Cursor, or any AI agent. 10 networks.
```

### Phase 2: Show HN — 4:00 PM CET / 10:00 AM EST

- [ ] Submit at news.ycombinator.com/submit
- [ ] Title: `Show HN: TokenTool MCP – Deploy CertiK-audited ERC-20 tokens from Claude/Cursor in 30 seconds`
- [ ] Body: copy from `v2-hacker-news-post.md` (exclude the pre-written objection responses — those are for your reference)
- [ ] **Respond to every comment in the first 2 hours.** This is non-negotiable for HN visibility.
- [ ] Use the pre-written objection responses as a cheat sheet, but personalize each reply

### Phase 3: Twitter — 4:15 PM CET

- [ ] Post Tweet 1 from `v2-twitter-thread.md`
- [ ] Self-reply each subsequent tweet within 90 seconds
- [ ] Pin Tweet 1
- [ ] Tag @AnthropicAI in Tweet 1
- [ ] Tag @cursor_ai in Tweet 5
- [ ] Once HN post is live, quote-tweet it with a brief comment

### Phase 4: LinkedIn — 4:30 PM CET

- [ ] Post personal post from `v2-linkedin-post.md`
- [ ] Immediately add first comment with links
- [ ] Post shorter version from Bitbond company page, tagging the personal post
- [ ] Tag 2-3 relevant builders in the comments

### Phase 5: Communities — 5:00 PM CET

**Reddit** (adapt voice for each sub):
- [ ] r/mcp — straightforward dev-focused post
- [ ] r/ethereum — compliance/RWA angle
- [ ] r/LocalLLaMA — MCP tool for local agent workflows
- [ ] r/SolDev — SPL token support angle

**Discord**:
- [ ] MCP Discord — #show-and-tell or #projects
- [ ] Anthropic Developer Discord — #mcp channel
- [ ] ElizaOS Discord — agent builder audience

**Telegram**:
- [ ] Relevant RWA / Web3 developer groups

### Phase 6: Email — Evening

- [ ] Email existing TokenTool web users
- [ ] Subject: "TokenTool now works with AI agents"
- [ ] Body: 3 sentences + link to repo. Don't over-explain.

---

## T+1 Day (Thursday March 5)

- [ ] Check HN — respond to any new comments
- [ ] Engage with every Twitter reply and retweet
- [ ] Post Day 2 follow-up tweet (the "which chains?" tweet)
- [ ] Check registry PRs — follow up if no response
- [ ] Monitor npm install count: `npm show token-tool-mcp` or check npmjs.com stats
- [ ] Note any bugs or questions that surfaced → fix and push
- [ ] Update README if any confusion emerged from HN/Twitter feedback

---

## T+3 Days (Saturday March 7)

- [ ] Post Day 3 thought piece tweet ("MCP is the new API")
- [ ] Check which registries are live, follow up on pending
- [ ] Compile launch metrics

---

## Success Metrics

| Metric | Minimum | Target | Exceptional |
|--------|---------|--------|-------------|
| GitHub stars (48h) | 30 | 100 | 500+ |
| npm installs (week 1) | 50 | 200 | 1000+ |
| HN front page | Top 50 | Top 20 | Top 5 |
| Twitter thread impressions | 10K | 50K | 200K+ |
| Registry listings live | 3 | 5 | 7 |
| Inbound messages/issues | 3 | 10 | 30+ |

---

## Objection Cheat Sheet

| Objection | Response |
|-----------|----------|
| **"$299 is expensive"** | Same price as the web UI. CertiK-audited contracts with compliance features. Testnet is free — start there. |
| **"Private key in env var?"** | Standard for local dev tools (Hardhat, Foundry do the same). Never logged, never transmitted. stdio transport = no network listener. Hardware wallet support on roadmap. |
| **"Just a wrapper?"** | Yes — so is Stripe's MCP server, and Alpaca's. MCP servers make infrastructure addressable by agents through a standard protocol. |
| **"Why not Thirdweb?"** | Thirdweb handles generic contract deployment. TokenTool MCP is for compliant issuance — whitelist, blacklist, pausable, force transfer. Different use cases. |
| **"8,300+ deployments — proof?"** | tokentool.bitbond.com — visible on the site. Bitbond GmbH is a regulated German fintech, operating since 2013. |
