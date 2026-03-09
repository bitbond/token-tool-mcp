# Post-Launch Momentum Playbook — TokenTool MCP
*Launch: Wednesday March 5, 2026 — 4:00 PM CET / 10:00 AM EST*
*Owner: Travis (BD lead) | Bitbond GmbH*

---

## 1. HOUR BY HOUR: First 6 Hours

### Hour 0 (4:00–5:00 PM CET) — IGNITION

**4:00 PM** — Submit Show HN. Copy title + body exactly from `v2-hacker-news-post.md`. Open HN in a dedicated browser tab. Set a 5-minute auto-refresh or use HN notifications.

**4:05 PM** — Post first HN comment yourself: the demo GIF link + "Happy to answer anything about the architecture, the CertiK audit, or MCP development in general." This seeds discussion and pushes you into the comments early.

**4:15 PM** — Fire Twitter thread from `v2-twitter-thread.md`. Self-reply every 90 seconds. Pin Tweet 1 immediately.

**4:20 PM** — Quote-tweet the HN link with: "Just posted on Show HN. Curious what the crowd thinks. 👀 [HN link]"

**4:30 PM** — LinkedIn personal post goes live.

**What to watch:**
- HN upvote count (every 5 min). If you hit 5 upvotes in first 15 min, you're trending toward front page.
- Twitter impressions on Tweet 1. If >1K in first hour, the algo picked it up.
- Any immediate bug reports or install failures → fix instantly.

**What to do:**
- Reply to EVERY HN comment within 10 minutes. Non-negotiable. HN algorithm rewards active OPs.
- Reply to every Twitter reply. Like every quote tweet.
- Do NOT leave the computer.

### Hour 1 (5:00–6:00 PM CET) — FEED THE ALGORITHM

- Continue HN comment responses. Prioritize technical questions (these generate sub-threads, which boost ranking).
- Post in first community: **MCP Discord #show-and-tell**. This is the friendliest, most aligned audience.
- Submit to **Smithery.ai** and **mcp.so** if not done in Phase 1.
- Check npm install count: `npm show token-tool-mcp`. Screenshot it. You'll want the delta later.

**Watch for:**
- HN rank. Check https://news.ycombinator.com/ — are you on the front page? If yes, everything accelerates.
- Negative comments. Respond calmly, with facts. Never get defensive. See Section 2 for pre-written responses.

### Hour 2 (6:00–7:00 PM CET) — EXPAND

- Post in **Anthropic Developer Discord** #mcp channel.
- Post in **r/mcp** — dev-focused, link to repo + HN discussion.
- Continue HN/Twitter replies.
- If anyone notable (>5K followers) tweets about it, DM them a thank you + offer early access to upcoming features.

**Watch for:**
- GitHub star velocity. If >10 stars in 2 hours, you're doing well. >30 = exceptional.
- Any GitHub issues filed. Respond within 30 minutes.

### Hour 3 (7:00–8:00 PM CET) — CROSS-POLLINATE

- Post in **r/ethereum** — lead with the compliance/RWA angle, not the AI angle.
- Post in **ElizaOS Discord** — agent builder audience, frame as "give your agents token deployment superpowers."
- If HN is still climbing, tweet about it: "Somehow on the HN front page. Wasn't expecting this kind of response. [screenshot]" — social proof compounds.

### Hour 4 (8:00–9:00 PM CET) — CONSOLIDATE

- Do a full pass through ALL HN comments. Reply to anything you missed.
- Do a full pass through Twitter. Reply, like, follow anyone who engaged substantively.
- Post in **r/LocalLLaMA** — frame as "MCP tool for local agent workflows."
- Check registry PRs. Comment on any that are stale.

### Hour 5 (9:00–10:00 PM CET) — CAPTURE

- Screenshot all metrics: HN rank, GitHub stars, npm installs, Twitter impressions, registry status.
- Note the top 3 questions/objections that came up. If any aren't covered by your pre-written responses, draft new ones.
- Post in **r/SolDev** — SPL token support angle.

### Hour 6 (10:00–11:00 PM CET) — WIND DOWN

- Final HN comment sweep.
- Final Twitter reply sweep.
- Send the email blast to existing TokenTool web users: "TokenTool now works with AI agents." 3 sentences + repo link.
- Log all metrics in a launch-day tracker file. You'll need this for Day 2–3 decisions.
- Set an alarm for 8 AM Thursday to check overnight HN/Twitter activity.

---

## 2. HN RESPONSE STRATEGY: 8 Pre-Written Templates

These are cheat sheets. **Personalize every response** — HN users can smell copy-paste. Use the framing and facts, adapt the tone to match the commenter's style.

### Response 1: The Skeptic — "Nobody needs this"

> Fair question — who actually needs AI-deployed tokens?
>
> Two use cases we're seeing: (1) RWA platforms that need to issue tokens programmatically as part of an agent workflow — compliance features baked in from deployment, no manual config. (2) DAO tooling builders who want their agents to spin up governance tokens or treasury tokens without context-switching to a deployment UI.
>
> You might not need it. But the 8,300 deployments through our web UI suggest a decent number of people are already doing this manually. This makes it agent-native.

### Response 2: The Technical Deep-Dive — "How does the contract factory work?"

> The smart contract factory is already deployed on each supported chain. When the MCP server calls `deploy_token`, it constructs a transaction that calls the factory's create function with your parameters (name, symbol, supply, compliance flags). The factory deploys a new ERC-20 contract using the CertiK-audited bytecode. You become the contract owner.
>
> The key detail: no new bytecode is deployed per token. Every token uses the same audited implementation. The factory parameterizes it at construction time. This is why we can guarantee audit coverage — it's not "similar to audited code," it's the audited code.

### Response 3: "Why not Thirdweb / Coinbase AgentKit / Hardhat?"

> Different tools for different jobs.
>
> Thirdweb and AgentKit handle generic smart contract deployment. If you want to deploy any arbitrary contract, they're great.
>
> TokenTool MCP is narrower on purpose — it's specifically for compliant token issuance. Whitelist/blacklist, pausable, force transfer, document URI reference. These are the features that regulated issuers, RWA platforms, and institutional use cases require. You can't configure these through a generic deployer without writing custom contract code.
>
> If you need a vanilla ERC-20, you don't need this. If you need compliance features, this saves you from building and auditing your own contracts.

### Response 4: The Pricing Objection — "$299 is a lot for a token deployment"

> $299 is Bitbond's standard TokenTool pricing — same on the web UI, the API, and now the MCP server. You're paying for:
>
> 1. CertiK-audited contracts (auditing a smart contract independently runs $10K–$50K+)
> 2. Compliance features built in (whitelist, blacklist, pausable, force transfer)
> 3. 12-chain support out of the box
>
> Testnet is free and functionally identical. Deploy on Sepolia first, verify everything works, then go to mainnet when you're ready. Most people test 3–5 times before a mainnet deploy.

### Response 5: The Security Concern — "Private key in env var is insecure"

> You're right to flag it. Some context on the threat model:
>
> The MCP server uses stdio transport — there's no HTTP listener, no network socket. The key is read from the env var at startup, held in process memory, and used exclusively for local transaction signing. It never appears in logs, CLI arguments, or network traffic.
>
> This is the same approach Hardhat, Foundry, and every other local smart contract framework uses. It's appropriate for development and testnet. For production mainnet use, we recommend (1) using a dedicated deployment wallet with limited funds, and (2) enabling human-in-the-loop confirmation in your MCP client (Claude Desktop has this by default).
>
> Hardware wallet integration (Ledger/Trezor) is on the roadmap for Q2.

### Response 6: "Just a wrapper — where's the innovation?"

> Yep, it's a wrapper. That's what MCP servers are.
>
> Stripe's MCP server wraps their payments API. Alpaca's wraps their trading API. GitHub's wraps their REST API. The "innovation" in each case isn't the wrapper — it's making the underlying infrastructure addressable by AI agents through a standard protocol.
>
> Before this existed, if you wanted an agent to deploy compliant tokens, you had to build a bespoke integration against the TokenTool API, handle auth, parse responses, manage errors, and re-do it every time the API changed. Now it's `npx -y token-tool-mcp` and a config line.

### Response 7: "This sounds like it could be used for scam tokens"

> Real concern. A few things:
>
> The compliance features are specifically designed for legitimate issuance — whitelisting restricts who can hold the token, blacklisting can freeze bad actors, pausable lets you halt trading if something goes wrong. These are tools regulators expect, not tools scammers want.
>
> Bitbond is a regulated German fintech — we've been operating under BaFin oversight since 2013. Our web UI has the same capabilities and the same price, and it's been live for years.
>
> Could someone misuse it? Theoretically, same as Stripe or AWS. But the $299 fee, the compliance-first feature set, and the audit trail make it a poor choice for that compared to free alternatives.

### Response 8: "Cool project — what's next on the roadmap?"

> Thanks! Near-term roadmap:
>
> - **Hardware wallet support** (Ledger/Trezor) — Q2 2026
> - **Multi-sig deployment** — deploy from a Gnosis Safe
> - **Token management dashboard** in agent context — natural language queries about your deployed tokens across chains
> - **ERC-721/1155 support** — NFTs with the same compliance feature set
> - **Batch operations** — deploy + configure + distribute in a single agent conversation
>
> What would be most useful to you? Genuine question — roadmap is partly shaped by what the first users actually want.

---

## 3. TWITTER ENGAGEMENT STRATEGY

### Who to Tag (in thread or follow-up tweets)

| Handle | Why | When |
|--------|-----|------|
| @AnthropicAI | Built MCP protocol | Tweet 1 (already planned) |
| @cursor_ai | MCP client | Tweet 5 (already planned) |
| @alexalbert__ | Anthropic, MCP lead | Day 2 follow-up if thread gets traction |
| @daboross | MCP ecosystem builder | Quote-tweet if they engage |
| @_jxnlco | AI tooling influencer | DM if they like/RT |
| @balloob | Home Assistant / MCP early adopter | Day 2 tag in "which integrations" conversation |
| @dunaborosz / @DuneAnalytics | Just launched their MCP server | Day 2 — "MCP servers are becoming the new APIs" angle |
| @jessepollak | Base chain lead | If Base-specific discussion emerges |
| @haaborosz | Ethereum dev community | r/ethereum cross-post announcement |

### Who to DM After They Engage

**Trigger: anyone with >3K followers who likes, RTs, or replies.**

DM template (keep casual):
> Hey — saw you engaged with the TokenTool MCP thread. Thanks for that. Curious if you've been building with MCP servers? We're looking for early power users to shape the roadmap. Happy to jump on a quick call or just swap ideas async.

**Trigger: anyone from a crypto/RWA/DeFi company who engages.**

DM template (BD-oriented):
> Hey, noticed you're at [company]. We built TokenTool MCP for exactly the kind of token infrastructure [company] works with. Would love to show you a quick demo — 15 min, no pitch deck. Interested?

### Extending Thread Life Over 48 Hours

**Hour 6:** Post a "launch day results" tweet. Raw numbers, no spin. "X stars, Y installs, Z HN comments. Didn't expect this. Here's what I learned today." People love transparency + humility.

**Day 2 (Thursday):**
- Post the "Which chains?" follow-up tweet from `v2-twitter-thread.md`.
- Quote-tweet 2–3 of the best replies from Day 1 with commentary.
- If any bugs were found and fixed, tweet about it: "Someone found [issue] within hours of launch. Fixed and pushed. Open source at work."

**Day 3 (Friday):**
- Post the "MCP is the new API" thought piece tweet.
- Share a screenshot of the npm install chart if numbers are growing.
- Reply to your original thread with a "48-hour update" — stars, installs, what you learned, what you're building next.

**Compounding tactics:**
- Never let a reply go unanswered for >2 hours in the first 48h.
- Like every single reply. Repliers get a notification, come back, bring their followers.
- If someone asks a great question, reply with a detailed answer AND screenshot-quote it into a new standalone tweet. Double the surface area.

---

## 4. BD CONVERSION: GitHub Stars → Pipeline

### Identifying High-Value Stars

**Daily (Day 1–7):** Check new stars on the repo.

```bash
# Get recent stargazers with their profiles
gh api repos/thendrix-eng/token-tool-mcp/stargazers \
  -H "Accept: application/vnd.github.star+json" \
  --paginate | jq '.[] | {user: .user.login, starred_at: .starred_at, bio: .user.bio, company: .user.company}'
```

**Filter for BD targets:**
- Has a company listed in their GitHub profile
- Company is in crypto, RWA, DeFi, fintech, or tokenization
- Has >50 followers (indicates active developer, not a bot)
- Bio mentions "founder," "CTO," "lead," "architect," or company keywords

**Manual enrichment:**
- Click through to their GitHub profile
- Check if they have a Twitter/X linked — follow them
- Check if their company has a website — note what they do
- Search LinkedIn for their name + company

### The Star → DM Pipeline

**Step 1: Follow them on GitHub + Twitter/X** (same day they star)

**Step 2: If they have Twitter, DM within 24 hours:**

> Hey [name] — saw you starred TokenTool MCP. Thanks! Curious what drew your attention — are you building something that needs token deployment, or just exploring MCP servers?
>
> Either way, happy to help if you have questions.

Keep it short. Don't pitch. Let them tell you their use case.

**Step 3: If they respond with a use case, move to BD:**

> That's a solid use case. We've seen a few teams building [similar thing]. Would it be useful to jump on a 15-min call? I can walk you through the compliance features and how they map to [their specific need].

**Step 4: If they file an issue or PR, treat them as warm leads:**

Issue filers are 10x more valuable than stargazers. They've actually tried the tool. Respond to the issue within 1 hour, then follow up with a personal DM/email asking about their broader project.

### Identifying Target Company Stars

**Priority companies to watch for:**

| Company Type | Why | Signal |
|-------------|-----|--------|
| RWA platforms (Centrifuge, Ondo, Maple) | Direct product fit | Immediate BD outreach |
| DAO tooling (Aragon, Tally, Snapshot) | Token deployment is core workflow | Feature collaboration |
| Crypto exchanges with listing services | They help projects launch tokens | Partnership potential |
| AI agent platforms (ElizaOS, AutoGPT, LangChain) | MCP integration stories | Co-marketing |
| Enterprise blockchain teams | Compliance features are their bread and butter | Enterprise BD |

---

## 5. COMMUNITY SEQUENCING

### Posting Order & Timing

| # | Community | Time | Why This Order |
|---|-----------|------|---------------|
| 1 | **Show HN** | 4:00 PM CET | Anchors everything. HN link gets shared everywhere else. |
| 2 | **Twitter thread** | 4:15 PM CET | Drives impressions, tags bring ecosystem attention. |
| 3 | **LinkedIn** | 4:30 PM CET | Professional network, Bitbond's existing audience. |
| 4 | **MCP Discord** (#show-and-tell) | 5:00 PM CET | Friendliest, most aligned. Warm reception seeds confidence for harder communities. |
| 5 | **Anthropic Developer Discord** (#mcp) | 5:30 PM CET | Semi-official MCP community. Higher bar. |
| 6 | **r/mcp** | 6:00 PM CET | Reddit's MCP-specific sub. Dev-focused. |
| 7 | **r/ethereum** | 7:00 PM CET | Large, skeptical. Post after you have social proof (HN upvotes, stars). |
| 8 | **ElizaOS Discord** | 7:30 PM CET | Agent builder audience. Different framing needed. |
| 9 | **r/LocalLLaMA** | 8:00 PM CET | Local AI enthusiasts. Frame around local tool calling. |
| 10 | **r/SolDev** | 8:30 PM CET | Solana-specific angle. |
| 11 | **Telegram RWA/Web3 groups** | 9:00 PM CET | Targeted groups where token issuance is relevant. |
| 12 | **Email blast** | 10:00 PM CET | Existing users. Converts at highest rate but doesn't generate viral spread. |

### Messaging Adaptation Per Community

**MCP Discord / Anthropic Discord:**
> Just shipped TokenTool MCP — the first MCP server for compliant token issuance. CertiK-audited ERC-20s with whitelist, blacklist, pausable, force transfer. 12 chains. `npx -y token-tool-mcp` and you're up.
>
> Built it because MCP servers exist for payments, trading, and banking — but nothing for token deployment with compliance features.
>
> Repo: [link] | Show HN: [link]
>
> Would love feedback from this community. What features would make this more useful for your agent workflows?

**r/mcp:**
> **TokenTool MCP — first MCP server for compliant token issuance**
>
> We just open-sourced an MCP server that deploys CertiK-audited ERC-20 tokens with compliance features (whitelist, blacklist, pausable) from Claude, Cursor, or any MCP client.
>
> 11 tools covering deploy → mint → burn → pause → transfer → query. 12 chains. stdio transport.
>
> What we found building it: [1–2 interesting technical insights from the build process].
>
> GitHub: [link]
>
> Happy to answer questions about MCP server development or the token infrastructure.

**r/ethereum:**
> **Open-sourced an MCP server for compliant ERC-20 issuance — whitelist, blacklist, pausable, force transfer**
>
> We've been running TokenTool (tokentool.bitbond.com) since 2020 — 8,300+ deployments, CertiK-audited contracts. Just shipped an MCP server so AI agents can deploy and manage compliant tokens directly.
>
> Why this matters for Ethereum: RWA issuers and institutional platforms need compliance features at the contract level. This makes that infrastructure programmable via AI agents — useful for platforms that issue tokens at scale.
>
> Not a generic deployer. Specifically built for tokens that need investor whitelists, transfer restrictions, and emergency controls.
>
> Repo: [link]

*Do NOT lead with "AI" in r/ethereum. Lead with compliance and the Ethereum use case. AI is the delivery mechanism, not the story.*

**ElizaOS Discord:**
> Hey — just shipped an MCP server that lets agents deploy and manage ERC-20 tokens with compliance features. 12 chains, CertiK-audited.
>
> Thinking about ElizaOS integration — imagine an agent that can autonomously create tokens for DAOs, manage supply, whitelist holders, pause trading if something goes wrong. All from natural language.
>
> Anyone building agent workflows that need token operations? Would love to explore integration.

**r/LocalLLaMA:**
> **TokenTool MCP — deploy tokens from your local AI agent**
>
> Built an MCP server that works with any MCP-compatible local client. Deploy CertiK-audited ERC-20 tokens with compliance features from your local agent workflow.
>
> stdio transport, no cloud dependency. Private key stays local. Works with Claude Desktop, Cursor, any MCP client.
>
> Interesting for anyone building autonomous agent systems that need on-chain capabilities.
>
> Repo: [link]

**r/SolDev:**
> **MCP server for SPL token deployment — CertiK-audited, compliance features built in**
>
> Just open-sourced TokenTool MCP. Deploys tokens on Solana (and 11 other chains) from Claude, Cursor, or any MCP client. Includes whitelist, blacklist, pausable — features Solana token projects usually have to build from scratch.
>
> 8,300+ deployments across chains via our web UI. Now agent-native.
>
> Repo: [link]

---

## 6. DAY 2–3: Sustaining Momentum

### Thursday (Day 2)

**Morning (9 AM CET):**
- Full sweep: HN comments, Twitter replies, GitHub issues, Discord messages.
- Reply to everything that came in overnight.
- Check HN rank — if still on front page, this is your highest-leverage activity. Keep responding.
- Post Day 2 follow-up tweet ("Which chains?" tweet from v2-twitter-thread.md).

**Midday (12 PM CET):**
- Check registry PR status. Comment on any that haven't been reviewed.
- If awesome-mcp-servers PR is still open, that's normal (35K+ star repo = slow reviews). Don't push.
- Post a "Day 1 results" tweet: raw numbers, learnings, surprises. Transparency plays well.

**Afternoon (3 PM CET):**
- Identify the top 5 people who engaged most on Twitter. DM each one (see Section 4).
- Review GitHub stargazers. Run the API query. Flag any target-company employees.
- If any bugs surfaced, fix them and push a patch. Tweet about the fix.

**Evening:**
- Write a short "Day 1 retrospective" in your launch tracker. What worked, what didn't, what to double down on.
- Check npm install stats again. Calculate Day 1 delta.

### Friday (Day 3)

**Morning:**
- Post the "MCP is the new API" thought piece tweet.
- This is a standalone thought leadership piece. Don't link to the repo in the tweet — let people find it from your profile/pinned tweet. This is about reach, not conversion.

**Midday:**
- Cross-post the thought piece to LinkedIn as a text post.
- Quote-tweet 2–3 of the best community responses from the week.
- Reply to your original Twitter thread with a "48-hour update" — stars, installs, what changed.

**Afternoon:**
- Begin partnership outreach (see Section 7).
- File any feature requests that emerged from community feedback as GitHub issues. Tag them `community-request`.
- If any registries are now live, tweet about each one individually: "TokenTool MCP is now listed on [registry]. [screenshot]"

**Evening:**
- Compile full launch metrics. Compare against targets from the checklist.
- Write a brief internal post-mortem. Share key learnings.
- Plan Week 2 content: a technical blog post or tutorial.

### Weekend Buffer

Don't go dark. Check HN and Twitter once on Saturday, once on Sunday. Reply to anything new. The weekend tail can be surprisingly productive — fewer competing posts, same algorithm dynamics.

---

## 7. PARTNERSHIP OUTREACH TIMING

### Dune Analytics

**Context:** Dune just launched their own MCP server. They're in "MCP ecosystem builder" mode. Natural co-marketing fit.

**When:** Friday afternoon (Day 3) — after you have launch metrics to share.

**Who:** Find the person who tweeted about Dune's MCP launch. Usually a DevRel or product lead.

**Channel:** Twitter DM first. If no response in 24h, LinkedIn.

**Message:**
> Hey [name] — congrats on the Dune MCP server launch. We just shipped TokenTool MCP (first MCP server for compliant token issuance) and got [X] stars / [Y] HN upvotes in the first 48h.
>
> There's a natural integration story: deploy a token with TokenTool MCP → track it on Dune via Dune MCP. Would love to explore a co-marketing piece or even a technical integration. Quick call next week?

**Why Friday, not Wednesday:** You need social proof before reaching out. "We just launched" is weak. "We launched and got [impressive numbers]" is strong. Wait for the metrics.

### @zeneca (Weekly Roundup)

**Context:** Zeneca publishes a weekly crypto/NFT/Web3 roundup. Getting featured = massive qualified reach.

**When:** Thursday evening (Day 2) — their roundup typically covers the current week, so you need to be on their radar before they write it.

**Channel:** Twitter DM.

**Message:**
> Hey Zeneca — we just launched TokenTool MCP, the first MCP server for compliant token issuance (CertiK-audited, 12 chains). Got some good traction on HN and Twitter this week.
>
> Thought it might be relevant for your weekly roundup — it's at the intersection of AI agents and on-chain infrastructure. Here's the repo: [link]
>
> No pressure either way. Love the roundup regardless.

**Why Thursday:** Their roundup usually goes out Friday or weekend. Thursday gives them time to look at it. Earlier = more likely to be included.

### Additional Partnership Targets (Week 2)

| Partner | Angle | Timing |
|---------|-------|--------|
| **Anthropic DevRel** | Featured MCP server, case study | Week 2 Monday — once registry listings are live |
| **Cursor team** | Featured integration, in-app discovery | Week 2 — after install numbers prove demand |
| **LangChain / LangGraph** | Agent toolkit integration | Week 2–3 — when you have integration examples |
| **CertiK** | Co-marketing on audit + MCP angle | Week 1 Friday — they benefit from visibility too |
| **Base / Optimism DevRel** | L2-specific showcases | Week 2 — after chain-specific usage data |

### CertiK Co-Marketing (Low-Hanging Fruit)

**When:** Friday (Day 3)

**Why:** CertiK loves showcasing projects that use their audits. This is free marketing for both sides.

**Message:**
> Hey CertiK team — we just launched TokenTool MCP, an open-source MCP server that deploys CertiK-audited ERC-20 tokens from AI agents. Got [X] traction in the first 48h. Would love to do a co-marketing piece — your audit is a core part of our value proposition. Open to a tweet thread, blog feature, or case study.

---

## Quick Reference: Decision Tree

```
IF HN hits front page (top 30):
  → Drop everything else. Respond to HN comments exclusively for 2 hours.
  → Tweet about being on the front page (screenshot).
  → This is your highest-leverage moment of the entire launch.

IF HN stalls (<10 upvotes in first hour):
  → Don't force it. Redirect energy to Twitter and communities.
  → Consider re-submitting at a different time in 48h (HN allows this for Show HN).

IF a bug is reported:
  → Fix it within 1 hour if possible. Push the fix.
  → Tweet: "Someone found X within hours of launch. Fixed and pushed. That's the power of open source."
  → This is GOOD for optics. Fast response = trust.

IF someone influential shares it:
  → Reply publicly thanking them.
  → DM privately within 30 minutes.
  → Offer them something: early access, free mainnet deploy, roadmap input.

IF negative press / critical thread emerges:
  → DO NOT quote-tweet (amplifies it).
  → Reply directly, calmly, with facts.
  → If it's a legitimate concern, acknowledge it: "You're right. Here's what we're doing about it."
  → If it's bad faith, one factual correction and move on. Don't engage further.
```

---

*This playbook is a living document. Update it with real metrics and learnings as the launch unfolds.*
