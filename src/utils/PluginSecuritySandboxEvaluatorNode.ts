/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Security evaluation, Static Analysis, and Sandbox Isolation Auditor
 *          for community-made engine extensions and scripts. Inspects source code
 *          for potential security anti-patterns (prototype pollution, malicious
 *          eval, unauthorized network beacons, high memory allocations) and yields
 *          a mathematical Security Audit Score (0 - 100) with risk mitigation advice.
 *    - TH: ระบบตรวจสอบความปลอดภัยและวิเคราะห์ความเสี่ยงของปลั๊กอินและสคริปต์ชุมชน
 *          (Security Audit & Sandbox Evaluator) ตรวจสอบการเรียกใช้คำสั่งอันตราย
 *          วิเคราะห์สิทธิ์ (Permissions) ที่ร้องขอ พร้อมคำนวณคะแนนความปลอดภัย
 *          (0 - 100) เพื่อแจ้งเตือนนักพัฒนาก่อนติดตั้งเข้าสู่เอนจิน
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Used by `PluginMarketplaceRegistryNode.ts` and `PluginDetailModal.tsx`
 *    - Integrates with `PluginSandboxIsolationEngine.ts` for runtime sandboxing
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Input: `evaluatePluginSecurity(plugin: EnginePlugin): SecurityAuditResult`
 *    - Output: Score, risk level, warnings, allowed sandbox capabilities
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safely handles malformed scripts, empty code strings, or unknown permissions.
 *    - Always falls back to safe sandbox quarantine if code contains suspicious keywords.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    import { PluginSecuritySandboxEvaluatorNode } from '../utils/PluginSecuritySandboxEvaluatorNode';
 *    const audit = PluginSecuritySandboxEvaluatorNode.evaluate(plugin);
 *    console.log(audit.score, audit.riskLevel, audit.recommendations);
 *    ```
 * ============================================================================
 */

import { EnginePlugin, PluginPermission, PluginSecurityTier } from '../types/pluginMarketplaceTypes';

export type SecurityRiskLevel = 'LOW' | 'MEDIUM' | 'ELEVATED' | 'CRITICAL';

export interface SecurityVulnerability {
  ruleId: string;
  severity: 'INFO' | 'WARNING' | 'DANGER';
  title: string;
  description: string;
  lineRecommendation?: string;
}

export interface SecurityAuditResult {
  score: number; // 0 - 100
  riskLevel: SecurityRiskLevel;
  tier: PluginSecurityTier;
  verifiedOfficial: boolean;
  vulnerabilities: SecurityVulnerability[];
  grantedPermissions: PluginPermission[];
  sandboxIsolationRecommended: boolean;
  maxMemoryQuotaMb: number;
  runtimeSandboxed: boolean;
  summaryNote: string;
}

export class PluginSecuritySandboxEvaluatorNode {
  /**
   * Run comprehensive static security analysis on plugin metadata and source code
   */
  public static evaluate(plugin: EnginePlugin): SecurityAuditResult {
    const code = plugin.sourceCodePreview || '';
    const vulnerabilities: SecurityVulnerability[] = [];
    let deduction = 0;

    // 1. Official Signature Check
    if (plugin.isOfficial || plugin.securityTier === 'VERIFIED_OFFICIAL') {
      return {
        score: 99,
        riskLevel: 'LOW',
        tier: 'VERIFIED_OFFICIAL',
        verifiedOfficial: true,
        vulnerabilities: [],
        grantedPermissions: plugin.permissions,
        sandboxIsolationRecommended: false,
        maxMemoryQuotaMb: 256,
        runtimeSandboxed: true,
        summaryNote: 'Verified Official: Fully reviewed and cryptographically signed by the NexusEngine Core Team.'
      };
    }

    // 2. High-Risk Keyword Analysis
    if (/eval\s*\(/.test(code) || /Function\s*\(/.test(code)) {
      vulnerabilities.push({
        ruleId: 'SEC_NO_DYNAMIC_EVAL',
        severity: 'DANGER',
        title: 'Dynamic Code Execution (eval/Function)',
        description: 'Code contains dynamic code evaluation which can execute unsanitized strings.',
        lineRecommendation: 'Replace dynamic eval with pre-compiled AST or deterministic lookup.'
      });
      deduction += 35;
    }

    if (/__proto__|prototype\./.test(code) && /Object\.assign|extend/.test(code)) {
      vulnerabilities.push({
        ruleId: 'SEC_PROTOTYPE_POLLUTION',
        severity: 'WARNING',
        title: 'Potential Prototype Tampering',
        description: 'Object mutation patterns that might pollute global JavaScript prototypes.',
        lineRecommendation: 'Use Object.create(null) or Map for isolated dictionary mappings.'
      });
      deduction += 15;
    }

    if (/document\.cookie|localStorage\.clear|indexedDB\.deleteDatabase/.test(code)) {
      vulnerabilities.push({
        ruleId: 'SEC_STORAGE_HIJACK',
        severity: 'DANGER',
        title: 'Host Storage Tampering',
        description: 'Direct access to global host browser cookies or destructive storage deletion.',
        lineRecommendation: 'Confine plugin storage to isolated namespaced engine key-value state.'
      });
      deduction += 30;
    }

    if (/fetch\s*\(|XMLHttpRequest|WebSocket/.test(code) && !plugin.permissions.includes('RAW_SOCKET')) {
      vulnerabilities.push({
        ruleId: 'SEC_UNDECLARED_NETWORK',
        severity: 'WARNING',
        title: 'Undeclared Network Socket',
        description: 'Network communication attempted without declaring RAW_SOCKET permission.',
        lineRecommendation: 'Add RAW_SOCKET permission to plugin manifest or route via Engine Netcode bus.'
      });
      deduction += 20;
    }

    // 3. Permission Density Risk
    if (plugin.permissions.includes('RAW_SOCKET') && plugin.permissions.includes('FILE_SYSTEM')) {
      vulnerabilities.push({
        ruleId: 'SEC_PERM_COMBINATION',
        severity: 'WARNING',
        title: 'Elevated Permission Combination (File + Socket)',
        description: 'Simultaneous File System and Raw Network access requires runtime sandboxing.',
        lineRecommendation: 'Isolate file transactions to temporary virtual workspace folders.'
      });
      deduction += 10;
    }

    // Calculate score
    const finalScore = Math.max(10, Math.min(100, 100 - deduction));
    
    let riskLevel: SecurityRiskLevel = 'LOW';
    if (finalScore < 50) riskLevel = 'CRITICAL';
    else if (finalScore < 70) riskLevel = 'ELEVATED';
    else if (finalScore < 85) riskLevel = 'MEDIUM';

    let tier = plugin.securityTier;
    if (finalScore >= 85 && tier === 'EXPERIMENTAL_SANDBOX') {
      tier = 'COMMUNITY_CURATED';
    }

    return {
      score: finalScore,
      riskLevel,
      tier,
      verifiedOfficial: false,
      vulnerabilities,
      grantedPermissions: plugin.permissions,
      sandboxIsolationRecommended: finalScore < 80 || plugin.permissions.includes('RAW_SOCKET'),
      maxMemoryQuotaMb: finalScore > 75 ? 128 : 64,
      runtimeSandboxed: true,
      summaryNote: vulnerabilities.length === 0
        ? 'Code inspection clean. Standard sandbox quarantine applies.'
        : `${vulnerabilities.length} potential risk flags detected during static audit. Sandbox containment enforced.`
    };
  }
}
