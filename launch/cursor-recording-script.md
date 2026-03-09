# Cursor Demo Recording Script
**Goal:** 30-45 second clip showing token deployment from Cursor Agent
**Pre-req:** TokenTool MCP configured in Cursor + BITBOND_PRIVATE_KEY set

## Setup (do before hitting record)
1. Open Cursor
2. Open the Agent panel (Cmd+L → switch to Agent mode)
3. Make sure TokenTool MCP is enabled in Cursor settings
4. Have a clean, empty chat open

## The Script (type this slowly, let the agent run)

**Type this prompt:**
```
Deploy a token called Carbon Credit A, symbol CCA, 1 million supply on Sepolia testnet. Make it pausable and mintable.
```

**Then just wait** — the agent will:
1. Call `deploy_token` 
2. Show the tool execution
3. Return the contract address

## Recording Tips
- Use QuickTime → File → New Screen Recording → select just the Cursor window
- Zoom in on the chat panel so text is readable
- Let it run fully — the tool call animation + contract address return is the money shot
- ~30-45 seconds total

## After recording
Send it over and I'll cut it into the mashup.

## If MCP isn't configured in Cursor yet
Add this to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "token-tool": {
      "command": "npx",
      "args": ["-y", "token-tool-mcp"],
      "env": {
        "BITBOND_PRIVATE_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}
```
Then restart Cursor.
