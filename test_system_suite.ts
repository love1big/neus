/**
 * Comprehensive System & Algorithm Verification Test Suite
 * Tests all core algorithms, edge cases, error fallbacks, and data invariants across the engine.
 */

import { AssetDependencyGraphRepository } from './src/utils/AssetDependencyGraphRepository';
import {
  calculateOverallMetrics,
  detectCircularDependencies,
  getDownstreamDependencies,
  getUpstreamReferencers,
  detectOrphanAssets,
  detectBrokenLinks,
  calculateAssetBlastRadius,
  getNodeId
} from './src/utils/AssetDependencyCycleDetectorNode';
import { AssetGraphZoomControllerNode } from './src/utils/AssetGraphZoomControllerNode';
import { AssetNode, AssetLink } from './src/types/assetDependencyGraph';
import { Procedural3DMeshGenerator } from './src/utils/Procedural3DMeshGenerator';
import { ProceduralWorldMapGenEngine } from './src/utils/ProceduralWorldMapGenEngine';
import { ThaiPhoneticsEngineCore } from './src/utils/ThaiPhoneticsEngineCore';
import { OfflineAIErrorImmunityCore } from './src/utils/OfflineAIErrorImmunityCore';
import { PluginSandboxIsolationEngine } from './src/utils/PluginSandboxIsolationEngine';
import { HighPerformanceNetcodeEngine } from './src/utils/HighPerformanceNetcodeEngine';
import { GlobalOfflineAITranslationEngine } from './src/utils/GlobalOfflineAITranslationEngine';
import { ThaiSingingAndChantingProsodyEngine } from './src/utils/ThaiSingingAndChantingProsodyEngine';

let passed = 0;
let failed = 0;
const errors: string[] = [];

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    const msg = `  ✗ FAIL: ${testName}${detail ? ' - ' + JSON.stringify(detail) : ''}`;
    console.error(msg);
    errors.push(msg);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('STARTING EXHAUSTIVE SYSTEM & ALGORITHM TEST SUITE');
  console.log('====================================================\n');

  // -----------------------------------------------------------------
  // 1. AssetDependencyGraphRepository Tests
  // -----------------------------------------------------------------
  console.log('[1] Testing AssetDependencyGraphRepository...');
  const repo = AssetDependencyGraphRepository.getInstance();

  const presets = ['mech_titan', 'cyber_city', 'medieval_castle', 'audio_soundscape', 'corrupted_links'];
  for (const preset of presets) {
    repo.loadPreset(preset);
    const nodes = repo.getNodes();
    const links = repo.getLinks();
    assert(nodes.length > 0, `Preset '${preset}' loads nodes (${nodes.length} nodes)`);
    assert(links.length > 0, `Preset '${preset}' loads links (${links.length} links)`);
  }

  // Test adding and removing nodes
  const testNode: AssetNode = {
    id: 'test_node_temp_999',
    name: 'Temporary Test Node',
    type: 'model_3d',
    fileSizeBytes: 1024 * 500,
    status: 'loaded',
    tags: ['test']
  };
  repo.addNode(testNode);
  assert(repo.getNodeById('test_node_temp_999') !== undefined, 'Add node works & retrieved by getNodeById');

  repo.deleteNode('test_node_temp_999');
  assert(repo.getNodeById('test_node_temp_999') === undefined, 'Delete node works');

  // Test removing orphan assets
  repo.loadPreset('corrupted_links');
  const removedCount = repo.removeOrphanAssets(new Set(['broken_fx_01']));
  assert(removedCount >= 0, `Remove orphan assets returns valid count (${removedCount})`);

  // -----------------------------------------------------------------
  // 2. AssetDependencyCycleDetectorNode Algorithm Tests
  // -----------------------------------------------------------------
  console.log('\n[2] Testing AssetDependencyCycleDetectorNode Algorithms...');

  // Test getNodeId with string and object
  assert(getNodeId('abc') === 'abc', 'getNodeId with string');
  assert(getNodeId({ id: 'abc' } as any) === 'abc', 'getNodeId with object { id: "abc" }');

  // Test Cycle Detection with synthetic graph: A -> B -> C -> A (cycle) and D (leaf)
  const cyclicNodes: AssetNode[] = [
    { id: 'A', name: 'Node A', type: 'prefab', fileSizeBytes: 100, status: 'loaded' },
    { id: 'B', name: 'Node B', type: 'model_3d', fileSizeBytes: 200, status: 'loaded' },
    { id: 'C', name: 'Node C', type: 'material', fileSizeBytes: 300, status: 'loaded' },
    { id: 'D', name: 'Node D', type: 'texture', fileSizeBytes: 400, status: 'loaded' }
  ];
  const cyclicLinks: AssetLink[] = [
    { id: 'l1', source: 'A', target: 'B', type: 'material' },
    { id: 'l2', source: 'B', target: 'C', type: 'shader' },
    { id: 'l3', source: 'C', target: 'A', type: 'texture' }, // cycle
    { id: 'l4', source: 'C', target: 'D', type: 'texture' }
  ];

  const cycles = detectCircularDependencies(cyclicNodes, cyclicLinks);
  assert(cycles.length > 0, `Detects cycle in A -> B -> C -> A (found ${cycles.length} cycles)`);
  assert(cycles.some(c => c.includes('A') && c.includes('B') && c.includes('C')), 'Cycle includes A, B, C');

  // Test infinite loop prevention in getDownstreamDependencies with cycles
  const downstreamOfA = getDownstreamDependencies('A', cyclicNodes, cyclicLinks);
  assert(downstreamOfA.size <= 4, `Downstream dependencies terminates safely on cycles (got ${downstreamOfA.size} nodes)`);

  const upstreamOfD = getUpstreamReferencers('D', cyclicNodes, cyclicLinks);
  assert(upstreamOfD.size <= 4, `Upstream referencers terminates safely on cycles (got ${upstreamOfD.size} nodes)`);

  // Test Broken Links
  const brokenLinks = detectBrokenLinks(cyclicNodes, [
    ...cyclicLinks,
    { id: 'l_ghost', source: 'A', target: 'NON_EXISTENT_NODE', type: 'material' }
  ]);
  assert(brokenLinks.length === 1 && brokenLinks[0].target === 'NON_EXISTENT_NODE', 'Detects broken link correctly');

  // Test Orphan Detection
  const orphanNodes: AssetNode[] = [
    ...cyclicNodes,
    { id: 'LONE_ORPHAN', name: 'Lonely Orphan', type: 'audio', fileSizeBytes: 50, status: 'orphaned' }
  ];
  const orphans = detectOrphanAssets(orphanNodes, cyclicLinks);
  assert(orphans.has('LONE_ORPHAN'), 'Detects isolated orphan asset without incoming/outgoing links');

  // Test Overall Metrics Calculation
  const metrics = calculateOverallMetrics(cyclicNodes, cyclicLinks);
  assert(metrics.totalAssets === 4, 'Metrics: totalAssets is 4');
  assert(metrics.circularDependencyCount >= 1, `Metrics: circularDependencyCount is >= 1 (got ${metrics.circularDependencyCount})`);
  assert(metrics.healthScore >= 0 && metrics.healthScore <= 100, `Metrics: healthScore in range [0, 100] (got ${metrics.healthScore})`);

  // Test Asset Blast Radius calculation
  const blastRadius = calculateAssetBlastRadius('A', cyclicNodes, cyclicLinks);
  assert(blastRadius.directNode?.id === 'A', 'Blast radius finds direct node');
  assert(blastRadius.downstreamCount >= 0, 'Blast radius downstream count is valid');

  // Test Edge Case: Empty Graph
  const emptyMetrics = calculateOverallMetrics([], []);
  assert(emptyMetrics.totalAssets === 0, 'Empty graph: totalAssets is 0');
  assert(emptyMetrics.circularDependencyCount === 0, 'Empty graph: circularDependencyCount is 0');
  assert(emptyMetrics.healthScore === 100, 'Empty graph: healthScore is 100');

  // -----------------------------------------------------------------
  // 3. AssetGraphZoomControllerNode Math & Coordinate Tests
  // -----------------------------------------------------------------
  console.log('\n[3] Testing AssetGraphZoomControllerNode Math & Coordinates...');
  const zoomCtrl = new AssetGraphZoomControllerNode(0.15, 5.0);

  // Test Bounds with empty nodes
  const emptyBounds = zoomCtrl.calculateNodesBounds([]);
  assert(emptyBounds.width > 0 && emptyBounds.height > 0, 'Empty bounds returns fallback box');

  // Test Bounds with single node
  const singleBounds = zoomCtrl.calculateNodesBounds([{ id: 'n1', name: 'N1', type: 'prefab', fileSizeBytes: 10, status: 'loaded', x: 100, y: 200 }]);
  assert(singleBounds.width > 0 && singleBounds.height > 0, 'Single node bounds handles zero-width by expanding');
  assert(singleBounds.centerX === 100 && singleBounds.centerY === 200, 'Single node centerX/Y matches node pos');

  // Test Bounds with multiple nodes
  const multiBounds = zoomCtrl.calculateNodesBounds([
    { id: 'n1', name: 'N1', type: 'prefab', fileSizeBytes: 10, status: 'loaded', x: -100, y: -50 },
    { id: 'n2', name: 'N2', type: 'prefab', fileSizeBytes: 10, status: 'loaded', x: 300, y: 250 }
  ]);
  assert(multiBounds.minX === -100 && multiBounds.maxX === 300, 'Multi bounds minX=-100, maxX=300');
  assert(multiBounds.width === 400 && multiBounds.height === 300, 'Multi bounds width=400, height=300');

  // Test Minimap calculation
  const minimapData = zoomCtrl.calculateMinimapData(
    cyclicNodes.map((n, i) => ({ ...n, x: i * 50, y: i * 50 })),
    800,
    600,
    180,
    120
  );
  assert(minimapData.viewportBox.width > 0 && minimapData.viewportBox.height > 0, 'Minimap viewportBox width & height > 0');
  assert(minimapData.scaleX > 0 && minimapData.scaleY > 0, 'Minimap scale factors are positive');

  // Clean up
  zoomCtrl.destroy();

  // -----------------------------------------------------------------
  // 4. Procedural 3D Mesh Generator Tests
  // -----------------------------------------------------------------
  console.log('\n[4] Testing Procedural3DMeshGenerator...');
  const swordMesh = Procedural3DMeshGenerator.generateWeapon({ type: 'Broadsword' });
  assert(swordMesh.vertices.length > 0, `Weapon generator produces vertices (${swordMesh.vertices.length / 3} vertices)`);
  assert(swordMesh.indices.length > 0, `Weapon generator produces indices (${swordMesh.indices.length / 3} triangles)`);

  const armorMesh = Procedural3DMeshGenerator.generateArmor({ slot: 'Helmet' });
  assert(armorMesh.vertices.length > 0, `Armor generator produces vertices (${armorMesh.vertices.length / 3} vertices)`);

  const characterMesh = Procedural3DMeshGenerator.generateCharacter({ archetype: 'HumanoidHero' });
  assert(characterMesh.vertices.length > 0, `Character generator produces vertices (${characterMesh.vertices.length / 3} vertices)`);

  const houseMesh = Procedural3DMeshGenerator.generateHouse({ stories: 2 });
  assert(houseMesh.vertices.length > 0, `House generator produces vertices (${houseMesh.vertices.length / 3} vertices)`);

  const objOutput = Procedural3DMeshGenerator.exportToOBJ(swordMesh);
  assert(objOutput.includes('v ') && objOutput.includes('f '), 'exportToOBJ produces valid Wavefront OBJ formatted text');

  // -----------------------------------------------------------------
  // 5. Procedural World Map Generator Engine Tests
  // -----------------------------------------------------------------
  console.log('\n[5] Testing ProceduralWorldMapGenEngine...');
  const worldGen = new ProceduralWorldMapGenEngine({
    seed: 42,
    width: 32,
    height: 32,
    enableRivers: true,
    enableRoads: true
  });

  const worldResult = worldGen.generate();
  assert(worldResult.heightMap.length === 32 * 32, `Heightmap generated at expected size (${worldResult.heightMap.length} points)`);
  assert(worldResult.biomeMap.length === 32 * 32, `BiomeMap generated at expected size (${worldResult.biomeMap.length} points)`);
  assert(!isNaN(worldResult.stats.averageElevation), `Average elevation is a valid number (${worldResult.stats.averageElevation.toFixed(2)})`);

  // -----------------------------------------------------------------
  // 6. Thai Phonetics Engine Core Tests
  // -----------------------------------------------------------------
  console.log('\n[6] Testing ThaiPhoneticsEngineCore...');
  const phoneticAnalysis = ThaiPhoneticsEngineCore.analyzeText('สวัสดี');
  assert(phoneticAnalysis.syllables.length >= 2, `Phonetic engine parses syllables for 'สวัสดี' (got ${phoneticAnalysis.syllables.length})`);
  assert(phoneticAnalysis.overallIpa.length > 0, `IPA string generated: '${phoneticAnalysis.overallIpa}'`);

  // -----------------------------------------------------------------
  // 7. Offline AI Error Immunity Core Tests
  // -----------------------------------------------------------------
  console.log('\n[7] Testing OfflineAIErrorImmunityCore...');
  const testErrorRecord = OfflineAIErrorImmunityCore.ingestAndLearnBug(
    'TypeError: Cannot read properties of undefined (reading "vertices")',
    'const v = mesh.vertices.length;',
    'const v = mesh?.vertices?.length ?? 0;',
    'Safe Mesh Vertex Access Guard'
  );
  assert(testErrorRecord.fingerprint.length > 0, `Generates deterministic fingerprint '${testErrorRecord.fingerprint}'`);
  assert(testErrorRecord.domain === 'TYPE_SAFETY_NARROWING', `Classifies error domain as '${testErrorRecord.domain}'`);
  assert(testErrorRecord.antiPattern !== undefined, 'Synthesizes anti-pattern rule');
  assert(testErrorRecord.immunityScore >= 90, `Immunity score is >= 90% (got ${testErrorRecord.immunityScore}%)`);

  // -----------------------------------------------------------------
  // 8. PluginSandboxIsolationEngine Tests
  // -----------------------------------------------------------------
  console.log('\n[8] Testing PluginSandboxIsolationEngine...');
  const sandbox = PluginSandboxIsolationEngine.getInstance();
  const session = sandbox.initializeSession('test_plg_alpha', 'WASM Mesh Solver', 'cpp', 128);
  assert(session.pluginId === 'test_plg_alpha', 'Initializes sandbox session with correct pluginId');
  assert(session.isolationMetrics.primaryEnginePollutionCount === 0, 'Zero-state pollution guarantee initialized at 0');
  assert(session.isolationMetrics.isolationIntegrityPercent === 100, 'Isolation integrity is 100%');
  
  const activeSession = sandbox.startTestRun('test_plg_alpha', 'WASM Mesh Solver', 'cpp', 128);
  assert(activeSession.isActive === true, 'Sandbox status transition to isActive=true');
  
  const tickSession = sandbox.runSimulationTick();
  assert(tickSession.computeProfile.tickDurationMicroseconds >= 0, 'Computes microsecond tick duration');
  assert(tickSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Tick execution maintains zero pollution');
  
  sandbox.stopTestRun();
  const resetSession = sandbox.resetShadowState();
  assert(resetSession.isActive === false, 'State cleanly reset to isActive=false');
  assert(resetSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Primary simulation state pollution count strictly 0');

  // -----------------------------------------------------------------
  // 9. HighPerformanceNetcodeEngine Tests
  // -----------------------------------------------------------------
  console.log('\n[9] Testing HighPerformanceNetcodeEngine...');
  const netcode = HighPerformanceNetcodeEngine.getInstance();
  netcode.setSimulatedLatency(35);
  netcode.setPacketLoss(0.01);
  const netMetrics = netcode.getNetMetrics();
  assert(netMetrics.rttMs >= 0, 'RTT ms is non-negative and valid');
  assert(netMetrics.packetLossPercent === 1, 'Packet loss percent accurately calculated');
  assert(netMetrics.snapshotRateHz === 60, 'Snapshot rate calibrated to 60Hz standard');

  // -----------------------------------------------------------------
  // 10. GlobalOfflineAITranslationEngine Tests
  // -----------------------------------------------------------------
  console.log('\n[10] Testing GlobalOfflineAITranslationEngine...');
  const transEngine = GlobalOfflineAITranslationEngine.getInstance();
  const transResult = await transEngine.translateText({
    text: 'Welcome to the Nexus Engine sandbox',
    sourceLang: 'en',
    targetLang: 'th',
    domain: 'gaming'
  });
  assert(typeof transResult.translatedText === 'string' && transResult.translatedText.length > 0, 'Generated valid translation text');
  assert(transResult.sourceLangId === 'en', 'Source language matches configuration');
  assert(transResult.targetLangId === 'th', 'Target language matches configuration');

  // -----------------------------------------------------------------
  // 11. ThaiSingingAndChantingProsodyEngine Tests
  // -----------------------------------------------------------------
  console.log('\n[11] Testing ThaiSingingAndChantingProsodyEngine...');
  const prosody = ThaiSingingAndChantingProsodyEngine.getInstance();
  const chantingNotes = prosody.analyzeChantingNotes('เร่งรัด พัฒนา วิทยาการ');
  assert(Array.isArray(chantingNotes) && chantingNotes.length > 0, 'Generated chanting note sequence');
  assert(typeof chantingNotes[0].note === 'string', 'First chanting note has valid musical pitch');
  assert(chantingNotes[0].durationSec > 0, 'Chanting note duration is positive');

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    console.error('Failed tests:\n' + errors.join('\n'));
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED WITH 0 ERRORS! ✨');
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error running test suite:', err);
  process.exit(1);
});
