# 🚀 Token Tool MCP — Monday Launch Checklist

**Target: Monday Feb 23, launch by 9 AM CET (= 3 AM EST, Show HN posts at 10 AM EST)**

---

## ✅ Pre-launch (Sunday night / Monday morning)

### Step 1 — Make repo public
1. Go to https://github.com/thendrix-eng/token-tool-mcp
2. Settings → Danger Zone → Change visibility → Public
3. Confirm

### Step 2 — npm publish
```bash
cd /Users/travishendrix/clawd/projects/token-tool-mcp
npm login  # login as Bitbond account
npm publish --access public
```
Verify: https://www.npmjs.com/package/token-tool-mcp

### Step 3 — Verify README on GitHub
- Check the repo looks clean and professional at github.com/thendrix-eng/token-tool-mcp
- Make sure CHANGELOG, LICENSE, README all render correctly

---

## 🔗 Submissions (do these Monday morning, before Show HN)

### Awesome MCP Servers (35K+ stars — highest priority)
- URL: https://github.com/punkpeye/awesome-mcp-servers
- Action: Submit PR — add this line under the Finance/Blockchain section:
```
- [token-tool-mcp](https://github.com/thendrix-eng/token-tool-mcp) — Deploy and manage compliant ERC20 tokens from Claude, Cursor, or any AI agent. CertiK-audited contracts, 10 EVM chains.
```
- PR title: `Add token-tool-mcp — compliant ERC20 deployment for AI agents`
- PR description: see launch/pr-descriptions.md

### MCP.so (16,670+ servers listed)
- URL: https://mcp.so
- Action: Go to site → Submit → paste GitHub URL
- Takes 2 minutes

### Official MCP Registry
- URL: https://github.com/modelcontextprotocol/registry
- Requires npm package to be published first (Step 2 above)
- Submit PR with registry entry JSON

### Smithery.ai
- URL: https://smithery.ai
- Action: npm publish first, then run `npx @smithery/cli register token-tool-mcp`
- smithery.yaml is ready at launch/smithery.yaml — copy to repo root first:
```bash
cp launch/smithery.yaml smithery.yaml
git add smithery.yaml && git commit -m "add smithery.yaml" && git push
```

### Glama.ai
- URL: https://glama.ai/mcp/servers
- Action: Submit form on site with GitHub URL

---

## 📣 Social (Monday 10 AM EST = 4 PM CET)

### Show HN
- URL: https://news.ycombinator.com/submit
- Title: `Show HN: Token Tool MCP – Deploy ERC20 tokens from Claude/Cursor by typing a sentence`
- Text: copy from launch/hacker-news-post.md
- **Best time: 10 AM EST sharp**

### Twitter/X Thread (from Bitbond account)
- Content: launch/twitter-thread.md
- Tweet 1 first, then self-reply each subsequent tweet
- Pin Tweet 1

### LinkedIn Post (from Bitbond company page + personal)
- Short version of the Twitter thread, more professional tone
- Tag: @Bitbond, #MCP, #RWA, #TokenizationI, #AIAgents

---

## 💬 Engagement (Monday afternoon)

- Respond to every HN comment within the first 2 hours
- Retweet + reply to anyone who shares
- Post in relevant Discord servers:
  - MCP Discord (discord.gg/mcp)
  - Anthropic Developer Discord
  - ElizaOS Discord
  - Virtuals Protocol Discord

---

## 📊 Track

| Metric | Target | Check |
|--------|--------|-------|
| GitHub stars | 20+ day 1 | |
| npm downloads | 50+ week 1 | |
| HN upvotes | 50+ | |
| Twitter thread impressions | 10K+ | |

---

## ⚠️ Don't forget
- Never send from personal Bitbond account unless agreed
- All public repo content must be reviewed — no internal notes exposed
- Private key docs clearly say env var only, never hardcoded
