#!/bin/bash
# Demo recording script - simulates Claude Code interaction with real deploy

CLI="node /Users/travishendrix/clawd/projects/token-tool-mcp/src/cli.js"

# Colors
BLUE='\033[1;34m'
GREEN='\033[1;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
DIM='\033[2m'
RESET='\033[0m'

clear

# Header
echo ""
echo -e "${BLUE}╭─────────────────────────────────────────────────────╮${RESET}"
echo -e "${BLUE}│${RESET}  ${WHITE}Token Tool MCP${RESET}  ${DIM}— Deploy tokens via natural language${RESET}  ${BLUE}│${RESET}"
echo -e "${BLUE}╰─────────────────────────────────────────────────────╯${RESET}"
echo ""

# Simulate the user prompt
sleep 1
echo -e "${DIM}You:${RESET}"
sleep 0.3

# Type out the prompt character by character
PROMPT="Deploy a token called Launch Demo, symbol DEMO, 1 million supply on Sepolia, with whitelist and pausable enabled."
for (( i=0; i<${#PROMPT}; i++ )); do
  echo -n "${PROMPT:$i:1}"
  sleep 0.02
done
echo ""
echo ""
sleep 0.8

# Show the agent thinking
echo -e "${CYAN}⟡ Calling deploy_token...${RESET}"
echo ""
sleep 0.5

# Show parameters
echo -e "${DIM}  Chain:      ${WHITE}sepolia${RESET}"
echo -e "${DIM}  Name:       ${WHITE}Launch Demo${RESET}"
echo -e "${DIM}  Symbol:     ${WHITE}DEMO${RESET}"
echo -e "${DIM}  Supply:     ${WHITE}1,000,000${RESET}"
echo -e "${DIM}  Whitelist:  ${GREEN}enabled${RESET}"
echo -e "${DIM}  Pausable:   ${GREEN}enabled${RESET}"
echo ""
sleep 0.5

echo -e "${YELLOW}⏳ Deploying to Sepolia...${RESET}"
echo ""

# Actually deploy
RESULT=$($CLI deploy --chain sepolia --name "Launch Demo" --symbol DEMO --supply 1000000 --whitelist --pausable 2>&1)

# Parse the result
CONTRACT=$(echo "$RESULT" | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)
TX=$(echo "$RESULT" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -n "$CONTRACT" ]; then
  echo -e "${GREEN}✓ Token deployed successfully${RESET}"
  echo ""
  echo -e "${DIM}  Contract:   ${WHITE}${CONTRACT}${RESET}"
  echo -e "${DIM}  Tx Hash:    ${WHITE}${TX}${RESET}"
  echo -e "${DIM}  Explorer:   ${CYAN}https://sepolia.etherscan.io/address/${CONTRACT}${RESET}"
  echo ""
  echo -e "${DIM}  CertiK-audited ERC-20 • Whitelist + Pausable • 30 seconds${RESET}"
else
  echo -e "${YELLOW}Raw output:${RESET}"
  echo "$RESULT"
fi

echo ""
sleep 5
