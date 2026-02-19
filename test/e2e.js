#!/usr/bin/env node
/**
 * End-to-end MCP protocol test
 * Spawns the server as a subprocess and communicates via JSON-RPC 2.0 over stdio
 * Simulates exactly what Claude Desktop / Cursor does
 */

const { spawn } = require('child_process');
const path = require('path');

const SERVER = path.join(__dirname, '../src/index.js');
const PRIVATE_KEY = process.env.BITBOND_PRIVATE_KEY || '0x7185160047fd33adfb07e984e752e7109b66a45b105c46df26d7380a3d87c4dc';

let id = 1;
const pending = new Map();
let buf = '';

function send(proc, method, params = {}) {
  return new Promise((resolve, reject) => {
    const reqId = id++;
    const msg = JSON.stringify({ jsonrpc: '2.0', id: reqId, method, params });
    pending.set(reqId, { resolve, reject });
    proc.stdin.write(msg + '\n');
  });
}

function handleData(data) {
  buf += data.toString();
  const lines = buf.split('\n');
  buf = lines.pop(); // keep incomplete line
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    } catch (e) {
      // ignore non-JSON lines (server might log to stdout)
    }
  }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runTests() {
  console.log('🚀 Starting MCP E2E test...\n');

  const proc = spawn('node', [SERVER], {
    env: { ...process.env, BITBOND_PRIVATE_KEY: PRIVATE_KEY },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', handleData);
  proc.stderr.on('data', d => process.stderr.write(`[server] ${d}`));
  proc.on('error', e => { console.error('Server error:', e.message); process.exit(1); });

  await sleep(1000); // let server start

  let passed = 0, failed = 0;

  async function test(name, fn) {
    process.stdout.write(`  ${name}... `);
    try {
      await fn();
      console.log('✅');
      passed++;
    } catch (e) {
      console.log(`❌  ${e.message}`);
      failed++;
    }
  }

  // ── 1. Initialize (required MCP handshake) ──────────────────────────────
  await test('MCP initialize handshake', async () => {
    const res = await send(proc, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'test-client', version: '1.0.0' },
    });
    if (!res.serverInfo) throw new Error('No serverInfo in response');
    console.log(`\n     Server: ${res.serverInfo.name} v${res.serverInfo.version}`);
  });

  // ── 2. List tools ────────────────────────────────────────────────────────
  await test('tools/list returns 11 tools', async () => {
    const res = await send(proc, 'tools/list', {});
    if (!res.tools || res.tools.length < 11)
      throw new Error(`Got ${res.tools?.length} tools, expected 11`);
    console.log(`\n     Tools: ${res.tools.map(t => t.name).join(', ')}`);
  });

  // ── 3. list_chains ───────────────────────────────────────────────────────
  await test('list_chains returns supported chains', async () => {
    const res = await send(proc, 'tools/call', {
      name: 'list_chains',
      arguments: {},
    });
    const data = JSON.parse(res.content[0].text);
    if (!data.chains || data.chains.length < 8)
      throw new Error(`Only ${data.chains?.length} chains found`);
    console.log(`\n     Chains: ${data.chains.map(c => c.key).join(', ')}`);
  });

  // ── 4. estimate_cost ─────────────────────────────────────────────────────
  await test('estimate_cost on sepolia', async () => {
    const res = await send(proc, 'tools/call', {
      name: 'estimate_cost',
      arguments: { chain: 'sepolia', mintable: true },
    });
    const data = JSON.parse(res.content[0].text);
    if (!data.costUsd) throw new Error('No costUsd in response');
    console.log(`\n     Cost: $${data.costUsd} USD (${data.costNative} ETH)`);
  });

  // ── 5. get_wallet_info ───────────────────────────────────────────────────
  await test('get_wallet_info on sepolia', async () => {
    const res = await send(proc, 'tools/call', {
      name: 'get_wallet_info',
      arguments: { chain: 'sepolia' },
    });
    const data = JSON.parse(res.content[0].text);
    if (!data.address) throw new Error('No address in response');
    console.log(`\n     Wallet: ${data.address} | ${data.balance} ${data.symbol}`);
  });

  // ── 6. list_deployed_tokens ──────────────────────────────────────────────
  await test('list_deployed_tokens', async () => {
    const res = await send(proc, 'tools/call', {
      name: 'list_deployed_tokens',
      arguments: {},
    });
    const data = JSON.parse(res.content[0].text);
    console.log(`\n     Registry: ${data.count} tokens`);
  });

  // ── 7. get_token_info for a known deployed token ──────────────────────────
  await test('get_token_info for CLAWDollars v2', async () => {
    const res = await send(proc, 'tools/call', {
      name: 'get_token_info',
      arguments: {
        contract_address: '0xc4656b8F3383077922Bf98adf5089F038B668A31',
        chain: 'sepolia',
      },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    console.log(`\n     Token: ${data.name} (${data.symbol}) supply=${data.totalSupply}`);
  });

  // ── 8. deploy_token (live deploy) ────────────────────────────────────────
  await test('deploy_token: MCPTestToken on sepolia', async () => {
    console.log('\n     [deploying — takes ~30s...]');
    const res = await send(proc, 'tools/call', {
      name: 'deploy_token',
      arguments: {
        name: 'MCP Test Token',
        symbol: 'MCPT',
        supply: '500000',
        chain: 'sepolia',
        mintable: true,
        burnable: true,
        pausable: false,
      },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!data.contractAddress) throw new Error('No contractAddress in result');
    console.log(`\n     ✨ Deployed at: ${data.contractAddress}`);
    console.log(`     Tx: ${data.txHash}`);
    console.log(`     Explorer: https://sepolia.etherscan.io/token/${data.contractAddress}`);
  });

  // ── Done ─────────────────────────────────────────────────────────────────
  proc.kill();
  await sleep(200);

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) console.log('🎉 All tests passed — MCP protocol E2E verified!');
  else console.log('⚠️  Some tests failed — see above');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(e => {
  console.error('Fatal test error:', e.message);
  process.exit(1);
});
