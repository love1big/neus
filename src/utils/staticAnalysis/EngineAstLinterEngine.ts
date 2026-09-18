/**
 * ============================================================================
 * MODULE: EngineAstLinterEngine.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * เอนจินหลักสำหรับการวิเคราะห์โครงสร้างโค้ดและไวยากรณ์แบบ Real-time (Static Analysis & AST Linter)
 * สำหรับตรวจจับ Engine-Specific Anti-Patterns โดยเฉพาะ:
 * 1. ตรวจสอบโค้ดแบบบรรทัดต่อบรรทัด พร้อมระบุขอบเขตการทำงาน (Scope Context Tracking):
 *    - ตรวจจับว่าตำแหน่งปัจจุบันอยู่ใน Hot Loop หรือไม่ เช่น `update()`, `tick()`,
 *      `render()`, `onFixedUpdate()`, `for`, `while`
 *    - ตรวจจับการทำงานในระดับคลาสและระดับไฟล์ (Class & File Scopes)
 * 2. ประเมินกฎการวิเคราะห์จาก `ENGINE_STATIC_ANALYSIS_RULES`:
 *    - ค้นหา Pattern ที่ตรงกับข้อกำหนด
 *    - สร้าง `EngineAntiPatternIssue` พร้อมระบุตำแหน่งบรรทัด/คอลัมน์ที่แม่นยำ
 * 3. อินทิเกรตเข้ากับ Monaco Editor:
 *    - แสดงเส้นหยักสีแดง/ส้ม/ฟ้า (`monaco.editor.setModelMarkers`)
 *    - ลงทะเบียน Code Action Provider สำหรับรูปหลอดไฟ (Quick-Fix Lightbulb)
 *    - ลงทะเบียน Hover Provider เพื่อแสดงคำอธิบายและตัวอย่าง Before/After ทันทีที่ผู้ใช้ชี้เมาส์
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้า: `ENGINE_STATIC_ANALYSIS_RULES` และ `EngineAntiPatternTypes`
 * - ส่งออก: รายการ `EngineAntiPatternIssue[]` ให้กับ `CodeEditor.tsx` และ `EngineStaticAnalysisPanel.tsx`
 * - เชื่อมต่อโดยตรงกับ Monaco Editor Model ผ่าน `applyMonacoAntiPatternMarkers`
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - รองรับโค้ดว่างหรือ Null อย่างปลอดภัย
 * - ละเว้นบรรทัดที่เป็น Comment (`//`, `/*`, `*`) เพื่อไม่ให้เกิด False Positives
 * - ข้ามการลงทะเบียน Monaco ซ้ำซ้อนโดยใช้ ID Marker Owner เฉพาะ `'engine-anti-patterns'`
 * 
 * ============================================================================
 */

import { 
  EngineAntiPatternIssue, 
  EngineAntiPatternRule, 
  EngineAntiPatternCategory,
  AntiPatternSeverity 
} from './EngineAntiPatternTypes';
import { ENGINE_STATIC_ANALYSIS_RULES } from './EngineStaticAnalysisRules';

export class EngineAstLinterEngine {
  private static registeredMonacoProviders: any[] = [];

  /**
   * รันการสแกนวิเคราะห์โค้ดเพื่อหา Engine Anti-Patterns ทั้งหมด
   * 
   * @param code เนื้อหาโค้ดในบัฟเฟอร์ปัจจุบัน
   * @param languageId รหัสภาษา เช่น 'typescript', 'csharp', 'cpp', 'glsl'
   * @param activeRules กฎที่เปิดใช้งาน (ถ้าไม่ระบุจะใช้กฎมาตรฐานทั้งหมด)
   * @returns รายการจุดบกพร่องที่ตรวจพบ
   */
  public static analyzeCode(
    code: string,
    languageId: string = 'typescript',
    activeRules?: EngineAntiPatternRule[]
  ): EngineAntiPatternIssue[] {
    const issues: EngineAntiPatternIssue[] = [];
    if (!code || typeof code !== 'string') return issues;

    const rules = activeRules || ENGINE_STATIC_ANALYSIS_RULES.filter(r => r.enabled);
    const lines = code.split('\n');
    const normalizedLang = languageId.toLowerCase();

    // ตัวแปรติดตามสถานะของขอบเขต (Scope Tracking State)
    let currentHotFunctionName: string | null = null;
    let hotFunctionBraceDepth = 0;
    let currentBraceDepth = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const lineNumber = lineIdx + 1;
      const rawLine = lines[lineIdx];
      const trimmedLine = rawLine.trim();

      // ข้ามบรรทัดว่างและบรรทัดที่เป็น Comment ชัดเจน
      if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
        continue;
      }

      // นับ Brace Depth สำหรับการติดตาม Function Scope
      const openBraces = (rawLine.match(/\{/g) || []).length;
      const closeBraces = (rawLine.match(/\}/g) || []).length;
      currentBraceDepth += openBraces - closeBraces;

      // ตรวจหาการเริ่มต้นของฟังก์ชันที่เป็น Hot Path (Update, Tick, Render, FixedUpdate, Loop)
      const hotFnMatch = rawLine.match(/(?:public|private|protected|async|\s)?\s*(update|tick|render|fixedUpdate|onRender|onFrame|draw|processPhysics|gameLoop)\s*\(/i);
      if (hotFnMatch) {
        currentHotFunctionName = hotFnMatch[1];
        hotFunctionBraceDepth = currentBraceDepth;
      }

      // ตรวจสอบว่าหลุดออกจาก Hot Function หรือยัง
      if (currentHotFunctionName && currentBraceDepth < hotFunctionBraceDepth) {
        currentHotFunctionName = null;
      }

      const isInsideHotPath = currentHotFunctionName !== null;

      // ตรวจสอบแต่ละกฎ
      for (const rule of rules) {
        // กรองตามภาษาที่รองรับ
        const matchesLang = rule.supportedLanguages.includes(normalizedLang) || 
          rule.supportedLanguages.includes('universal') ||
          (normalizedLang.includes('type') && rule.supportedLanguages.includes('typescript')) ||
          (normalizedLang.includes('script') && rule.supportedLanguages.includes('javascript')) ||
          (normalizedLang.includes('cs') && rule.supportedLanguages.includes('csharp')) ||
          (normalizedLang.includes('c') && rule.supportedLanguages.includes('cpp')) ||
          (normalizedLang.includes('glsl') && rule.supportedLanguages.includes('glsl'));

        if (!matchesLang) continue;

        // ตรวจสอบเงื่อนไข Scope
        if (rule.scopeCondition === 'INSIDE_HOT_LOOP' && !isInsideHotPath) {
          // หากกฎนี้เจาะจงเฉพาะ Hot Loop แต่ไม่ได้อยู่ในลูป ให้ข้าม
          continue;
        }

        // ตรวจจับ Pattern ด้วย Regex
        if (rule.regexPattern) {
          rule.regexPattern.lastIndex = 0;
          const match = rule.regexPattern.exec(rawLine);
          if (match) {
            const startCol = match.index + 1;
            const endCol = startCol + match[0].length;

            // ตรวจสอบว่ามี Auto-Fix พร้อมใช้งานหรือไม่
            const canAutoFix = Boolean(
              rule.id === 'ENG-MATH-001' || 
              rule.id === 'ENG-MEM-001' || 
              rule.id === 'ENG-GC-002' ||
              rule.id === 'ENG-GPU-003' ||
              rule.id === 'ENG-MEM-004' ||
              rule.id === 'ENG-GC-001' ||
              rule.alternative.replacementTemplate
            );

            // คำนวณ Context Snippet รอบข้าง 3 บรรทัด
            const snippetStart = Math.max(0, lineIdx - 1);
            const snippetEnd = Math.min(lines.length, lineIdx + 2);
            const contextSnippet = lines.slice(snippetStart, snippetEnd).join('\n');

            issues.push({
              id: `${rule.id}-L${lineNumber}-C${startCol}`,
              ruleId: rule.id,
              ruleName: rule.name,
              category: rule.category,
              severity: rule.severity,
              lineNumber,
              columnNumber: startCol,
              endLineNumber: lineNumber,
              endColumnNumber: endCol,
              matchedCode: match[0],
              contextSnippet,
              hotspotFunction: currentHotFunctionName || undefined,
              explanation: rule.detailedExplanation,
              performanceImpact: {
                frameTimePenaltyMs: rule.alternative.theoreticalFpsGainMs,
                gcChurnBytesPerFrame: (rule.alternative.estimatedGcSavedKb || 0) * 1024,
                impactDescription: `Increases per-frame execution time by approx ~${rule.alternative.theoreticalFpsGainMs}ms and triggers GC spikes.`
              },
              optimizedAlternative: rule.alternative,
              canAutoFix,
              suggestedReplacement: rule.alternative.replacementTemplate
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * นำผลการวิเคราะห์ไปสร้าง Monaco Editor Markers (ขีดเส้นใต้ตามสีระดับความรุนแรง)
   */
  public static applyMonacoAntiPatternMarkers(monaco: any, target: any, issues: EngineAntiPatternIssue[]): void {
    if (!monaco || !monaco.editor || !target) return;
    const model = typeof target.getModel === 'function' ? target.getModel() : target;
    if (!model) return;

    const markers = issues.map(issue => {
      let severity = monaco.MarkerSeverity.Warning;
      if (issue.severity === 'CRITICAL') severity = monaco.MarkerSeverity.Error;
      else if (issue.severity === 'HIGH') severity = monaco.MarkerSeverity.Warning;
      else if (issue.severity === 'MEDIUM' || issue.severity === 'HINT') severity = monaco.MarkerSeverity.Info;

      return {
        startLineNumber: Math.max(1, issue.lineNumber),
        startColumn: Math.max(1, issue.columnNumber),
        endLineNumber: Math.max(issue.lineNumber, issue.endLineNumber || issue.lineNumber),
        endColumn: Math.max(issue.columnNumber + 1, issue.endColumnNumber || issue.columnNumber + 8),
        message: `⚡ [${issue.ruleId}] ${issue.ruleName}: ${issue.optimizedAlternative.title} (Save ~${issue.performanceImpact.frameTimePenaltyMs}ms/frame)`,
        severity,
        source: 'Engine Anti-Pattern Analyzer'
      };
    });

    // ตั้งค่า Markers ภายใต้ Owner 'engine-anti-patterns' เพื่อไม่ให้ชนกับ Monaco Syntax Diagnostics
    monaco.editor.setModelMarkers(model, 'engine-anti-patterns', markers);
  }

  /**
   * ลงทะเบียน Monaco CodeAction & Hover Providers เพื่อแสดงคำแนะนำ Quick-Fix
   */
  public static registerMonacoProviders(
    monaco: any,
    languageId: string,
    onApplyQuickFix: (issue: EngineAntiPatternIssue) => void
  ): void {
    if (!monaco || !monaco.languages) return;

    // เคลียร์ Provider เดิมเพื่อไม่ให้เกิด Event ซ้ำ
    this.registeredMonacoProviders.forEach(p => p?.dispose && p.dispose());
    this.registeredMonacoProviders = [];

    // 1. Code Action (Lightbulb) Provider
    const codeActionProvider = monaco.languages.registerCodeActionProvider(languageId, {
      provideCodeActions: (model: any, range: any) => {
        const lineContent = model.getLineContent(range.startLineNumber);
        const issues = this.analyzeCode(model.getValue(), languageId);
        const activeIssue = issues.find(i => i.lineNumber === range.startLineNumber);

        if (!activeIssue) return { actions: [], dispose: () => {} };

        const actions = [
          {
            title: `⚡ Quick-Fix: ${activeIssue.optimizedAlternative.title} (Save ~${activeIssue.performanceImpact.frameTimePenaltyMs}ms)`,
            kind: 'quickfix',
            isPreferred: true,
            run: () => onApplyQuickFix(activeIssue)
          }
        ];

        return {
          actions,
          dispose: () => {}
        };
      }
    });

    // 2. Hover Provider
    const hoverProvider = monaco.languages.registerHoverProvider(languageId, {
      provideHover: (model: any, position: any) => {
        const issues = this.analyzeCode(model.getValue(), languageId);
        const match = issues.find(i => 
          i.lineNumber === position.lineNumber && 
          position.column >= Math.max(1, i.columnNumber - 3) && 
          position.column <= (i.endColumnNumber || i.columnNumber + 20)
        );

        if (!match) return null;

        return {
          range: new monaco.Range(
            match.lineNumber, 
            match.columnNumber, 
            match.endLineNumber || match.lineNumber, 
            match.endColumnNumber || match.columnNumber + 10
          ),
          contents: [
            { value: `### ⚡ Engine Anti-Pattern: ${match.ruleName}` },
            { value: `**Severity:** \`${match.severity}\` | **Impact:** ~${match.performanceImpact.frameTimePenaltyMs} ms/frame | **GC Saved:** ${match.optimizedAlternative.estimatedGcSavedKb} KB` },
            { value: `${match.explanation}` },
            { value: `#### 💡 Recommended Alternative:\n\`\`\`\n${match.optimizedAlternative.recommendedCode}\n\`\`\`` }
          ]
        };
      }
    });

    this.registeredMonacoProviders.push(codeActionProvider, hoverProvider);
  }

  /**
   * ตัวกรองและค้นหา Issue ตามเงื่อนไข
   */
  public static filterIssues(
    issues: EngineAntiPatternIssue[],
    categoryFilter: EngineAntiPatternCategory | 'ALL',
    severityFilter: AntiPatternSeverity | 'ALL',
    searchQuery: string = ''
  ): EngineAntiPatternIssue[] {
    return issues.filter(issue => {
      const matchesCategory = categoryFilter === 'ALL' || issue.category === categoryFilter;
      const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
      const matchesQuery = !searchQuery.trim() || 
        issue.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.ruleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.matchedCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSeverity && matchesQuery;
    });
  }
}
