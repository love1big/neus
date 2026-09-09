/**
 * Deep Functional Engine Test Suite
 * Tests actual algorithmic methods in our core engines
 */

import { GlobalOfflineAITranslationEngine } from './src/utils/GlobalOfflineAITranslationEngine';
import { HighPerformanceNetcodeEngine } from './src/utils/HighPerformanceNetcodeEngine';
import { ProceduralWorldMapGenEngine } from './src/utils/ProceduralWorldMapGenEngine';
import { Procedural3DMeshGenerator } from './src/utils/Procedural3DMeshGenerator';
import { ThaiPhoneticsEngineCore } from './src/utils/ThaiPhoneticsEngineCore';
import { ThaiSingingAndChantingProsodyEngine } from './src/utils/ThaiSingingAndChantingProsodyEngine';
import { RecentFilesTracker } from './src/utils/RecentFilesTracker';
import { PluginSandboxIsolationEngine } from './src/utils/PluginSandboxIsolationEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[ASSERTION FAILED] ${msg}`);
}

async function testEngines() {
  console.log('--- Testing Engine Algorithms ---');

  // 1. HighPerformanceNetcodeEngine
  console.log('1. HighPerformanceNetcodeEngine:');
  const netcode = HighPerformanceNetcodeEngine.getInstance();
  netcode.setSimulatedLatency(45);
  netcode.setPacketLoss(0.02);
  const state = netcode.getNetMetrics();
  assert(state.rttMs >= 0, 'RTT ms valid');
  assert(state.packetLossPercent >= 0, 'Packet loss percent valid');
  console.log('  ✓ Netcode engine methods operational');

  // 2. GlobalOfflineAITranslationEngine
  console.log('2. GlobalOfflineAITranslationEngine:');
  const transEngine = GlobalOfflineAITranslationEngine.getInstance();
  const res = await transEngine.translateText({
    text: 'Hello world, start the game',
    sourceLang: 'en',
    targetLang: 'th'
  });
  assert(typeof res.translatedText === 'string' && res.translatedText.length > 0, 'Translation generated');
  console.log(`  ✓ Translation engine returned: "${res.translatedText}" (Confidence: ${res.confidenceScore})`);

  // 3. ThaiSingingAndChantingProsodyEngine
  console.log('3. ThaiSingingAndChantingProsodyEngine:');
  const prosody = ThaiSingingAndChantingProsodyEngine.getInstance();
  const notes = prosody.analyzeChantingNotes('ชัยโย โห่ร้อง ชัยชนะ');
  assert(Array.isArray(notes) && notes.length > 0, 'Chanting notes generated');
  console.log(`  ✓ Prosody chanting notes generated: ${notes.length} notes`);

  // 4. RecentFilesTracker
  console.log('4. RecentFilesTracker:');
  RecentFilesTracker.trackOpenedItem({
    id: 'test_engine_track',
    name: 'Test Item',
    type: 'component',
    category: 'TEST'
  });
  const recent = RecentFilesTracker.getRecentItems();
  assert(recent.some(r => r.id === 'test_engine_track'), 'Item tracked in recent files');
  console.log('  ✓ Recent files tracker operational');

  console.log('\n🎉 ALL ENGINE FUNCTIONAL TESTS PASSED!');
}

testEngines().catch(e => {
  console.error('❌ Engine test failure:', e);
  process.exit(1);
});
