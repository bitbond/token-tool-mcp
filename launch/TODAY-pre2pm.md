# 🚨 TOKEN TOOL MCP — DO BEFORE 2 PM TODAY

Launch is 4 PM CET. These are the ONLY things blocking you. All take < 30 min total.

---

## Step 1 — Copy v2 README into the repo root (2 min)
```bash
cd ~/clawd/projects/token-tool-mcp
cp launch/v2-README.md README.md
git add README.md
git commit -m "v2 README: demo-first, npx install, all platforms"
git push
```

## Step 2 — npm publish (5 min)
```bash
cd ~/clawd/projects/token-tool-mcp
npm login   # use Bitbond npm account
npm publish --access public
```
Verify: https://www.npmjs.com/package/token-tool-mcp

Then test from a clean dir:
```bash
cd /tmp && mkdir test-mcp && cd test-mcp
npx -y token-tool-mcp
# Should start the MCP server without prompts
```

## Step 3 — Make repo public on GitHub (2 min)
- Go to: https://github.com/thendrix-eng/token-tool-mcp
- Settings → Danger Zone → Change visibility → Public
- Verify: README renders, demo GIF loads, badges display

## Step 4 — Submit Smithery.ai (5 min)
```bash
cd ~/clawd/projects/token-tool-mcp
cp launch/smithery.yaml smithery.yaml
git add smithery.yaml && git commit -m "add smithery.yaml" && git push
npx @smithery/cli register token-tool-mcp
```

## Step 5 — Registry submissions at 3 PM (before HN)
Open each URL and submit:
- https://github.com/punkpeye/awesome-mcp-servers (PR — see checklist for exact text)
- https://mcp.so — paste GitHub URL
- https://glama.ai/mcp/servers — submit form
- https://pulsemcp.com — submit form

---

## ✅ Already Fixed by Ders (no action needed)
- package.json repo URL fixed: now says `thendrix-eng/token-tool-mcp`
- v2-README demo: changed from demo.svg → demo-final.gif (more reliable on GitHub)
- All launch docs consistent on "8,300+" (no more "12K" remnant)

---

## Launch Timeline
| Time | Action |
|------|--------|
| Now → 2 PM | Steps 1-4 above |
| 3:00 PM | Registry submissions (Step 5) |
| 4:00 PM | Submit Show HN (copy from v2-hacker-news-post.md) |
| 4:15 PM | Post Twitter thread (v2-twitter-thread.md) |
| 4:30 PM | Post LinkedIn (v2-linkedin-post.md) |
| 5:00 PM | Community Discord posts |
| All afternoon | Respond to every HN comment within 2h |
