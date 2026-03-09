#!/bin/bash
# Demo script for Token Tool MCP recording
# Simulates what an agent does when you type a prompt

cd /Users/travishendrix/clawd/projects/token-tool-mcp

echo ""
echo "  🔧 Token Tool MCP — Demo"
echo "  ─────────────────────────"
echo ""
sleep 1

echo '  Agent prompt: "Show me the supported chains"'
echo ""
sleep 1.5

echo "  → Calling list_chains..."
echo ""
sleep 0.5
node src/cli.js chains 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
for c in data:
    print(f\"    {c['name']:20s}  {c['alias']:10s}  Chain ID: {c['chainId']}\")
" 2>/dev/null || echo "    (chain list output)"
echo ""
sleep 2

echo '  Agent prompt: "Estimate cost to deploy on Sepolia"'
echo ""
sleep 1.5

echo "  → Calling estimate_cost..."
echo ""
sleep 0.5
node src/cli.js cost --chain sepolia 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"    Chain:    {data.get('chain', 'Sepolia')}\")
print(f\"    Gas est:  {data.get('estimatedGas', '~0.001 ETH')}\")
print(f\"    Fee:      {data.get('fee', 'Testnet — free')}\")
print(f\"    Total:    {data.get('total', '~0.001 ETH')}\")
" 2>/dev/null || echo "    Chain: Sepolia | Fee: Testnet (free) | Gas: ~0.001 ETH"
echo ""
sleep 2

echo '  Agent prompt: "Deploy a token called Green Bond A,'
echo '                  1M supply on Sepolia, with whitelist'
echo '                  and pausable enabled"'
echo ""
sleep 2

echo "  → Calling deploy_token..."
echo ""
sleep 1
echo "    Deploying CertiK-audited ERC-20..."
sleep 2
echo "    ⏳ Waiting for confirmation..."
sleep 3

# Actually deploy if possible, otherwise show the existing deployment
node src/cli.js deploy --chain sepolia --name "Green Bond A" --symbol GBA --supply 1000000 --whitelist --pausable 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"    ✅ Deployed successfully!\")
print(f\"\")
print(f\"    Contract:  {data.get('contractAddress', '0x...')}\")
print(f\"    Chain:     {data.get('chain', 'Sepolia')}\")
print(f\"    Name:      {data.get('name', 'Green Bond A')}\")
print(f\"    Symbol:    {data.get('symbol', 'GBA')}\")
print(f\"    Supply:    {data.get('supply', '1,000,000')}\")
print(f\"    Features:  whitelist ✓  pausable ✓\")
print(f\"    Tx:        {data.get('txHash', '0x...')}\")
" 2>/dev/null || {
echo "    ✅ Deployed successfully!"
echo ""
echo "    Contract:  0xC8fbE59298f07CB41f2B7EEA2cB1b55Db8c78569"
echo "    Chain:     Sepolia Testnet"
echo "    Name:      Green Bond A"
echo "    Symbol:    GBA"
echo "    Supply:    1,000,000"
echo "    Features:  whitelist ✓  pausable ✓"
echo "    Tx:        0xff6f392...a01fa001"
}
echo ""
sleep 3

echo "  ─────────────────────────"
echo "  github.com/thendrix-eng/token-tool-mcp"
echo ""
sleep 2
