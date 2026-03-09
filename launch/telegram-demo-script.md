# Telegram Demo Script — TokenTool MCP

**Setup:**
- Rename Ders contact → "Bitbond" (or "TokenTool") in Telegram
- Eleanor screen records the phone
- Clean chat, no old messages visible
- Do one rehearsal, then the real take

**Duration target:** 30-40 seconds of usable footage

---

## Take 1 — Deploy

### You type:
```
Deploy a security token called EuroFund on Sepolia. 1 million supply, symbol EFUND, with whitelist and blacklist enabled, pausable and mintable.
```

### I respond:
```
✅ EuroFund deployed on Sepolia

Contract: 0x7a3B...4f2E
Explorer: sepolia.etherscan.io/address/0x7a3B...4f2E

Token details:
• Name: EuroFund
• Symbol: EFUND
• Supply: 1,000,000
• Decimals: 18

Compliance features:
• ✅ Whitelist — only approved holders
• ✅ Blacklist — block restricted addresses
• ✅ Pausable — emergency stop
• ✅ Mintable — issue additional supply

CertiK-audited contract. Ready for distribution.
```

*[2-3 second pause for viewer to read]*

---

## Take 2 — Transfer

### You type:
```
Transfer 25,000 EFUND to 0xAb8...9cD1
```

### I respond:
```
✅ Transfer complete

Sent: 25,000 EFUND
To: 0xAb8...9cD1
Tx: sepolia.etherscan.io/tx/0x91f...

Remaining balance: 975,000 EFUND
```

---

## Notes

- The deploy response is the money shot. Make sure it's fully visible on screen before moving to the transfer.
- Keep typing speed natural — not too fast, not hunt-and-peck.
- If there's a typo, don't delete — just send a corrected message. But ideally nail it first try.
- The compliance features list is what catches institutional eyes. That block needs to be readable.

## What we're NOT showing (and why)
- No whitelist add/remove (tool doesn't exist yet — only deploy-time flag)
- No wallet setup or config (magic = it just works)
- No errors or edge cases

## Stitching order (final video)
1. **Claude Desktop** — deploy (shows standard MCP integration)
2. **Terminal/SVG** — deploy (shows dev workflow)
3. **Telegram** — deploy + transfer (shows mobile/chat = the differentiator)

Each clip ~15-20 sec. Total video: 45-60 sec. Fast cuts, maybe a subtle transition between surfaces.
