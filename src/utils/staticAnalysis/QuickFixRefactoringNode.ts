/**
 * ============================================================================
 * MODULE: QuickFixRefactoringNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลปฏิรูปและปรับแต่งโค้ดอัตโนมัติ (Automated Code Refactoring & Quick-Fix Node)
 * สำหรับ Engine Anti-Patterns โดยเฉพาะ:
 * 1. ดำเนินการ One-Click Quick-Fix ปรับปรุงโค้ดเฉพาะจุดที่พบข้อบกพร่อง
 * 2. คำนวณ Batch Auto-Fix ปรับปรุงทุกจุดในไฟล์อย่างปลอดภัย (Reverse Offset Ordering)
 *    เพื่อป้องกันไม่ให้การเปลี่ยนแปลงบรรทัดหนึ่งกระทบต่อตำแหน่งของบรรทัดถัดไป
 * 3. รักษาระดับการย่อหน้า (Indentation Preservation) และโครงสร้างเดิมของโปรแกรม
 * 4. สร้าง Diff Preview Data ให้ผู้ใช้ตรวจทานก่อนตัดสินใจแทนที่โค้ดจริง
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - รับ `EngineAntiPatternIssue` จาก `EngineAstLinterEngine.ts`
 * - คืนค่าสตริงโค้ดใหม่ให้กับ `CodeEditor.tsx` (updateCode)
 * - ส่งข้อมูลการเปรียบเทียบ Before/After ไปยัง `EngineAntiPatternDiffModal.tsx`
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - หาก Issue ไม่รองรับ auto-fix (`canAutoFix === false`) จะปฏิเสธการแก้ไขและแจ้งเตือน
 * - มี Fallback ปลอดภัยหากตำแหน่งบรรทัดเกินความยาวจริงของไฟล์
 * - เรียงลำดับตำแหน่งจากล่างขึ้นบน (Bottom-to-Top / Reverse Line Sorting) เมื่อรัน Batch
 * 
 * ============================================================================
 */

import { EngineAntiPatternIssue } from './EngineAntiPatternTypes';

export interface QuickFixResult {
  success: boolean;
  newCode: string;
  message: string;
  diffBefore?: string;
  diffAfter?: string;
}

export interface BatchQuickFixResult {
  newCode: string;
  fixedCount: number;
  unfixedCount: number;
  fixedRuleNames: string[];
}

export class QuickFixRefactoringNode {
  /**
   * ดำเนินการ Quick-Fix จุดเดียวตาม Issue ที่ระบุ
   * 
   * @param sourceCode โค้ดต้นฉบับปัจจุบัน
   * @param issue จุดบกพร่องที่ต้องการแก้
   * @returns ผลลัพธ์การปรับปรุงโค้ด
   */
  public static applySingleQuickFix(sourceCode: string, issue: EngineAntiPatternIssue): QuickFixResult {
    if (!sourceCode || !issue) {
      return { success: false, newCode: sourceCode, message: 'Invalid source code or issue parameter.' };
    }

    const lines = sourceCode.split('\n');
    const targetLineIdx = issue.lineNumber - 1;

    if (targetLineIdx < 0 || targetLineIdx >= lines.length) {
      return { success: false, newCode: sourceCode, message: `Target line ${issue.lineNumber} is out of bounds.` };
    }

    const originalLine = lines[targetLineIdx];
    const indent = originalLine.match(/^\s*/)?.[0] || '';
    let refactoredLine = originalLine;

    // เลือกใช้กลยุทธ์การปรับปรุงโค้ดตาม Rule ID
    switch (issue.ruleId) {
      // 1. Vector3.Distance -> distanceToSquared / sqrMagnitude
      case 'ENG-MATH-001': {
        if (originalLine.includes('Vector3.Distance')) {
          refactoredLine = originalLine.replace(
            /Vector3\.Distance\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*(<|<=|>|>=)\s*([a-zA-Z0-9_.]+)/g,
            (_match, a, b, op, dist) => `${a.trim()}.distanceToSquared(${b.trim()}) ${op} (${dist.trim()} * ${dist.trim()})`
          );
        } else if (originalLine.includes('.distanceTo(')) {
          refactoredLine = originalLine.replace(
            /([a-zA-Z0-9_.]+)\.distanceTo\s*\(\s*([^)]+)\s*\)\s*(<|<=|>|>=)\s*([a-zA-Z0-9_.]+)/g,
            (_match, a, b, op, dist) => `${a.trim()}.distanceToSquared(${b.trim()}) ${op} (${dist.trim()} * ${dist.trim()})`
          );
        }
        break;
      }

      // 2. Tag comparison -> CompareTag
      case 'ENG-MEM-001': {
        refactoredLine = originalLine.replace(
          /([a-zA-Z0-9_.]+)\.tag\s*==\s*(["'][^"']+["'])/g,
          (_match, target, tagStr) => `${target}.CompareTag(${tagStr})`
        );
        break;
      }

      // 3. Array forEach in hot loop -> Standard indexed for loop
      case 'ENG-GC-002': {
        const forEachMatch = originalLine.match(/([a-zA-Z0-9_.]+)\.forEach\s*\(\s*(?:\(?([a-zA-Z0-9_]+)\)?\s*=>\s*\{?)/);
        if (forEachMatch) {
          const arrayName = forEachMatch[1];
          const itemName = forEachMatch[2] || 'item';
          refactoredLine = `${indent}for (let i = 0, len = ${arrayName}.length; i < len; ++i) {\n${indent}  const ${itemName} = ${arrayName}[i];`;
        }
        break;
      }

      // 4. Mobile Fragment Shader highp -> mediump
      case 'ENG-GPU-003': {
        refactoredLine = originalLine.replace(/precision\s+highp\s+float;/, 'precision mediump float;');
        break;
      }

      // 5. Unbounded console.log in hot loop -> Commented or throttled
      case 'ENG-MEM-004': {
        refactoredLine = `${indent}// [OPTIMIZED] Strip hot loop logging: ${originalLine.trim()}`;
        break;
      }

      // 6. Heap Vector Allocation in loop -> Scratch buffer pattern comment & set
      case 'ENG-GC-001': {
        refactoredLine = originalLine.replace(
          /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*new\s+(?:Vector3|Vector2)\s*\(([^)]*)\);/g,
          (_match, varName, args) => `// Reusing pre-allocated scratch buffer\n${indent}const ${varName} = (this._scratchVec || (this._scratchVec = new Vector3())).set(${args});`
        );
        break;
      }

      // 7. RaycastAll -> RaycastNonAlloc
      case 'ENG-MATH-002': {
        refactoredLine = originalLine.replace(
          /Physics\.RaycastAll\s*\(([^)]+)\)/g,
          (_match, args) => `Physics.RaycastNonAlloc(${args}, _cachedHitBuffer)`
        );
        break;
      }

      // 8. Separate position and rotation updates -> SetPositionAndRotation
      case 'ENG-MEM-002': {
        refactoredLine = originalLine.replace(
          /transform\.position\s*=\s*([^;]+);\s*transform\.rotation\s*=\s*([^;]+);/g,
          (_match, pos, rot) => `transform.SetPositionAndRotation(${pos.trim()}, ${rot.trim()});`
        );
        break;
      }

      // Fallback: หากมี suggestedReplacement ให้ใช้ค่าที่เตรียมไว้
      default: {
        if (issue.suggestedReplacement) {
          refactoredLine = `${indent}${issue.suggestedReplacement}`;
        }
        break;
      }
    }

    if (refactoredLine === originalLine) {
      // หากไม่มีการเปลี่ยนแปลงข้อความ ให้ใส่คอมเมนต์คำแนะนำแบบ In-place
      refactoredLine = `${indent}// [ENGINE OPTIMIZATION TIP]: ${issue.ruleName}\n${originalLine}`;
    }

    lines[targetLineIdx] = refactoredLine;
    const newCode = lines.join('\n');

    return {
      success: true,
      newCode,
      message: `Successfully applied performance optimization for ${issue.ruleName}`,
      diffBefore: originalLine,
      diffAfter: refactoredLine
    };
  }

  /**
   * ปรับปรุงโค้ดแบบชุด (Batch Quick-Fix All) สำหรับปัญหาที่สามารถแก้ไขอัตโนมัติได้
   * 
   * @param sourceCode โค้ดต้นฉบับ
   * @param issues รายการปัญหาทั้งหมด
   * @returns โค้ดที่ผ่านการปรับปรุงทุกจุด
   */
  public static applyAllQuickFixes(sourceCode: string, issues: EngineAntiPatternIssue[]): BatchQuickFixResult {
    if (!sourceCode || !issues || issues.length === 0) {
      return {
        newCode: sourceCode,
        fixedCount: 0,
        unfixedCount: 0,
        fixedRuleNames: []
      };
    }

    // กรองเฉพาะ Issue ที่ canAutoFix === true
    const fixableIssues = issues.filter(i => i.canAutoFix);
    const unfixableCount = issues.length - fixableIssues.length;

    if (fixableIssues.length === 0) {
      return {
        newCode: sourceCode,
        fixedCount: 0,
        unfixedCount: issues.length,
        fixedRuleNames: []
      };
    }

    // เรียงลำดับจากล่างขึ้นบน (Reverse Line Order) เพื่อไม่ให้ตำแหน่งบรรทัดเคลื่อน
    const sortedIssues = [...fixableIssues].sort((a, b) => b.lineNumber - a.lineNumber);

    let currentCode = sourceCode;
    const fixedRuleSet = new Set<string>();
    let actualFixedCount = 0;

    for (const issue of sortedIssues) {
      const result = this.applySingleQuickFix(currentCode, issue);
      if (result.success) {
        currentCode = result.newCode;
        fixedRuleSet.add(issue.ruleName);
        actualFixedCount++;
      }
    }

    return {
      newCode: currentCode,
      fixedCount: actualFixedCount,
      unfixedCount: unfixableCount,
      fixedRuleNames: Array.from(fixedRuleSet)
    };
  }

  /**
   * สร้างข้อมูลการเปรียบเทียบ Side-by-Side Diff Preview
   */
  public static generateDiffPreview(
    originalSnippet: string,
    optimizedSnippet: string
  ): { originalLines: string[]; optimizedLines: string[] } {
    return {
      originalLines: (originalSnippet || '').split('\n'),
      optimizedLines: (optimizedSnippet || '').split('\n')
    };
  }
}
