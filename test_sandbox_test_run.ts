/**
 * ============================================================================
 * TEST SUITE: PLUGIN SANDBOX TEST RUN & ISOLATION ENGINE
 * ============================================================================
 * 
 * Verifies that:
 * 1. PluginSandboxIsolationEngine initializes sessions with valid profiles.
 * 2. Primary simulation engine state remains 100% untouched (primaryEnginePollutionCount = 0).
 * 3. Memory profiling tracks allocated heap, scratch buffers, peak usage, and virtual GC.
 * 4. Compute profiling calculates tick duration (microseconds), CPU load, and FPS impact.
 * 5. Stress test scenarios run without crashing and preserve zero-pollution isolation.
 * 6. Shadow state reset accurately restores factory baselines.
 */

import { PluginSandboxIsolationEngine } from './src/utils/PluginSandboxIsolationEngine';
import { StressTestType } from './src/types/pluginSandboxTestRun';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED] ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Plugin Sandbox Test Run Verification Suite...');
  const engine = PluginSandboxIsolationEngine.getInstance();

  // Test 1: Initialize Session
  console.log('Test 1: Initialize Session & Verify Defaults');
  const session = engine.initializeSession('test_plg_01', 'SoftBody WASM Physics', 'cpp', 128);
  assert(session.pluginId === 'test_plg_01', 'Session ID should match');
  assert(session.memoryProfile.quotaMB === 128, 'Quota should be 128MB');
  assert(session.isolationMetrics.primaryEnginePollutionCount === 0, 'Initial engine pollution must be 0');
  assert(session.isolationMetrics.isolationIntegrityPercent === 100, 'Integrity must be 100%');
  console.log('  ✓ Test 1 Passed');

  // Test 2: Toggle & Start Isolated Test Run
  console.log('Test 2: Start Isolated Test Run Execution');
  const activeSession = engine.startTestRun('test_plg_01', 'SoftBody WASM Physics', 'cpp', 128);
  assert(activeSession.isActive === true, 'Session should be active');
  assert(activeSession.status === 'running', 'Session status should be running');
  console.log('  ✓ Test 2 Passed');

  // Test 3: Execute Multiple Isolated Ticks & Verify Metrics
  console.log('Test 3: Execute Isolated Simulation Ticks');
  for (let i = 0; i < 10; i++) {
    engine.executeIsolatedTick('test_plg_01', 0.016);
  }

  assert(activeSession.isolationMetrics.virtualTicksProcessed === 10, 'Should have processed 10 virtual ticks');
  assert(activeSession.isolationMetrics.interceptedMutationsCount > 0, 'Mutations should be intercepted');
  assert(activeSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Primary engine pollution MUST REMAIN ZERO');
  assert(activeSession.computeProfile.lastTickDurationUs > 0, 'Microsecond tick duration should be recorded');
  assert(activeSession.memoryProfile.allocatedHeapMB > 0, 'Heap memory should be tracked');
  assert(activeSession.memoryProfile.historySamples.length > 2, 'History samples should accumulate');
  console.log(`  ✓ Test 3 Passed (Allocated Heap: ${activeSession.memoryProfile.allocatedHeapMB}MB, Last Tick: ${activeSession.computeProfile.lastTickDurationUs}μs, Pollution: ${activeSession.isolationMetrics.primaryEnginePollutionCount})`);

  // Test 4: Stress Test Surge - Compute & Memory Spikes
  console.log('Test 4: Execute Compute Surge Stress Test');
  engine.triggerStressTest('test_plg_01', 'compute_surge_1000');
  assert(activeSession.activeStressTest === 'compute_surge_1000', 'Active stress test should be set');
  assert(activeSession.status === 'stress_testing', 'Status should reflect stress testing');

  // Advance ticks until stress test completes
  while (activeSession.activeStressTest !== null) {
    engine.executeIsolatedTick('test_plg_01', 0.016);
  }

  assert(activeSession.status === 'running', 'Status should return to running after stress completion');
  assert(activeSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Pollution must remain ZERO even after stress test');
  console.log('  ✓ Test 4 Passed');

  // Test 5: Memory Allocation Spike & Virtual GC Cycle
  console.log('Test 5: Memory Allocation Spike Stress Test & Virtual GC');
  engine.triggerStressTest('test_plg_01', 'memory_allocation_spike');
  while (activeSession.activeStressTest !== null) {
    engine.executeIsolatedTick('test_plg_01', 0.016);
  }
  assert(activeSession.memoryProfile.peakHeapMB >= activeSession.memoryProfile.allocatedHeapMB, 'Peak heap must be >= current heap');
  assert(activeSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Pollution remains ZERO');
  console.log(`  ✓ Test 5 Passed (Peak Heap: ${activeSession.memoryProfile.peakHeapMB}MB, GC Cycles: ${activeSession.memoryProfile.gcCyclesCount})`);

  // Test 6: Stop Test Run & Reset Shadow State
  console.log('Test 6: Stop & Reset Shadow State to Factory Baseline');
  engine.stopTestRun('test_plg_01');
  assert(activeSession.isActive === false, 'Session must be inactive');
  assert(activeSession.status === 'idle', 'Session status must be idle');

  engine.resetIsolationState('test_plg_01');
  assert(activeSession.isolationMetrics.interceptedMutationsCount === 0, 'Mutations count reset to 0');
  assert(activeSession.isolationMetrics.primaryEnginePollutionCount === 0, 'Pollution must be 0');
  console.log('  ✓ Test 6 Passed');

  console.log('\n🎉 ALL 6 SANDBOX TEST RUN ISOLATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
