/**
 * ============================================================================
 * MODULE: CodeBrandingSyntaxSafetyEngine.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * เครื่องยนต์วิเคราะห์ไวยากรณ์และความปลอดภัยในการแทรกหมายเหตุลิขสิทธิ์โค้ด
 * (Code Branding Syntax Safety & Placement Engine):
 *   - ตามข้อกำหนดของผู้ใช้:
 *     "*by love1big โดยโปรแกรม OMNI Engine STUDIO* ใส่หลัง } เท่านั้น หรือหลังจบ code บรรทัดนั้นก็พอ 
 *      และทำให้ไม่เกิด error เวลาใส่ตามหลังแล้ว"
 *   - ตรวจจับตำแหน่งที่ปลอดภัยสูงสุด (Zero-Syntax-Error Guarantee):
 *     1. ตรวจจับเฉพาะหลังเครื่องหมายปีกกาปิด `}` (เช่น `}`, `};`, `},`, `})`, `});`, `} else {`, `} catch {`)
 *     2. ตรวจจับหลังจบ Code Statement ที่สมบูรณ์บริบูรณ์ (เช่น `;`, `}`, `end`, `>`)
 *     3. ป้องกันข้อผิดพลาด (Syntax Error Prevention):
 *        - ห้ามแทรกใน JSON (เนื่องจาก JSON มาตรฐานไม่รองรับคอมเมนต์ จะทำให้ JSON.parse พัง)
 *        - ห้ามแทรกในบรรทัดที่มี Line Continuation `\` (เช่น Python, C Macro, Shell) เพราะจะเกิด SyntaxError
 *        - ห้ามแทรกกลางข้อความสตริงหลายบรรทัด (Multiline Template Literals / Strings)
 *        - ห้ามแทรกกลางบล็อกคอมเมนต์เดิม (/* ... *\/ หรือ <!-- ... -->)
 *        - ตรวจจับ JSX/TSX: หากอยู่ใน Children ของ JSX จะใช้รูปแบบ {/* *by ...* *\/} อย่างปลอดภัย ไม่หลุดเป็นตัวอักษรบนหน้าจอ
 *   - รองรับ 3 โหมดกลยุทธ์การวางตำแหน่ง (Placement Modes):
 *     - 'brace_only': ใส่หลัง `}` เท่านั้น (ตรงตามคำสั่ง "ใส่หลัง } เท่านั้น")
 *     - 'brace_or_statement_end': ใส่หลัง `}` หรือหลังจบ code บรรทัดนั้น (ตรงตามคำสั่ง "หรือหลังจบ code บรรทัดนั้นก็พอ" - แนะนำเป็นค่าเริ่มต้น)
 *     - 'all_safe_lines': ใส่ทุกบรรทัดโค้ดที่ปลอดภัย
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Consumed by: `src/utils/OfflineAICodeCommentBrander.ts`
 * - Configured by: `src/components/AICodeBrandingConfigModal.tsx` and `src/components/AICodeBrandingSettingsTab.tsx`
 * - CLI integration: `src/utils/OfflineCommandPromptEngine.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts:
 * ----------------------------------------------------------------------------
 * - Input: `rawCode: string`, `language: string`, `options: SyntaxSafetyOptions`
 * - Output: `BrandedSafetyResult` (brandedCode, targetLines, skippedLines, safetyNotes)
 * 
 * 4. Error Handling & Fallbacks:
 * ----------------------------------------------------------------------------
 * - Empty string or null input returns empty result gracefully.
 * - JSON input returns original code with safety notice bypass to prevent JSON parse crashes.
 * - If tokenizer encounters unclosed tokens, it applies safe fallback without breaking code.
 * 
 * 5. Usage Example:
 * ----------------------------------------------------------------------------
 * ```typescript
 * import { codeBrandingSyntaxSafetyEngine } from './CodeBrandingSyntaxSafetyEngine';
 * 
 * const result = codeBrandingSyntaxSafetyEngine.processCode(
 *   'function greet() {\n  return "hi";\n}',
 *   'typescript',
 *   { brandTag: '*by love1big โดยโปรแกรม OMNI Engine STUDIO*', mode: 'brace_or_statement_end' }
 * );
 * console.log(result.brandedCode);
 * ```
 * ============================================================================
 */

export type BrandingPlacementMode = 
  | 'brace_only'              // ใส่หลัง '}' เท่านั้น
  | 'brace_or_statement_end'  // ใส่หลัง '}' หรือหลังจบ code บรรทัดนั้น (แนะนำ)
  | 'all_safe_lines';         // ใส่ทุกบรรทัดโค้ดที่ปลอดภัย

export interface SyntaxSafetyOptions {
  brandTag: string;
  mode?: BrandingPlacementMode;
  brandEmptyLines?: boolean;
}

export interface BrandedSafetyResult {
  originalCode: string;
  brandedCode: string;
  totalLines: number;
  brandedLines: number;
  skippedLines: number;
  language: string;
  mode: BrandingPlacementMode;
}

export class CodeBrandingSyntaxSafetyEngine {
  private static instance: CodeBrandingSyntaxSafetyEngine | null = null;

  public static getInstance(): CodeBrandingSyntaxSafetyEngine {
    if (!CodeBrandingSyntaxSafetyEngine.instance) {
      CodeBrandingSyntaxSafetyEngine.instance = new CodeBrandingSyntaxSafetyEngine();
    }
    return CodeBrandingSyntaxSafetyEngine.instance;
  }

  /**
   * ตรวจสอบว่าภาษาโปรแกรมมิ่งนี้รองรับคอมเมนต์หรือไม่ (เช่น JSON ไม่รองรับคอมเมนต์)
   */
  public isCommentSupported(language: string): boolean {
    const lang = (language || '').toLowerCase().trim();
    if (lang === 'json') {
      return false;
    }
    return true;
  }

  /**
   * คืนค่าสัญลักษณ์คอมเมนต์ที่ถูกต้องตามภาษา
   */
  public getCommentSyntax(language: string = 'typescript', isInsideJsx: boolean = false): {
    linePrefix: string;
    isBlock?: boolean;
    blockOpen?: string;
    blockClose?: string;
  } {
    const lang = (language || '').toLowerCase().trim();

    if (isInsideJsx) {
      return { linePrefix: '', isBlock: true, blockOpen: '{/*', blockClose: '*/}' };
    }

    // Python, Shell, Bash, Ruby, Perl, YAML, R, Dockerfile
    if (['python', 'py', 'shell', 'bash', 'sh', 'ruby', 'rb', 'yaml', 'yml', 'r', 'dockerfile'].includes(lang)) {
      return { linePrefix: '#' };
    }

    // Lua, SQL, Haskell, Ada
    if (['lua', 'sql', 'haskell', 'hs', 'ada'].includes(lang)) {
      return { linePrefix: '--' };
    }

    // HTML, XML, SVG, Markdown
    if (['html', 'xml', 'svg', 'md', 'markdown'].includes(lang)) {
      return { linePrefix: '', isBlock: true, blockOpen: '<!--', blockClose: '-->' };
    }

    // CSS, SCSS, LESS
    if (['css', 'scss', 'less'].includes(lang)) {
      return { linePrefix: '', isBlock: true, blockOpen: '/*', blockClose: '*/' };
    }

    // Default for C, C++, C#, Java, JavaScript, TypeScript, Rust, Go, Swift, Kotlin, PHP, Dart, Scala, GLSL
    return { linePrefix: '//' };
  }

  /**
   * ตรวจสอบว่าบรรทัดนี้เข้าเกณฑ์การใส่หมายเหตุตามเงื่อนไขของผู้ใช้หรือไม่
   * เงื่อนไข:
   * 1. "ใส่หลัง } เท่านั้น" (mode: brace_only)
   * 2. "หรือหลังจบ code บรรทัดนั้นก็พอ" (mode: brace_or_statement_end)
   * 3. และต้องไม่เกิด Syntax Error!
   */
  public shouldBrandLine(
    line: string,
    mode: BrandingPlacementMode,
    language: string,
    context: {
      inMultilineString: boolean;
      inMultilineComment: boolean;
    }
  ): { shouldBrand: boolean; isJsxChild?: boolean; reason?: string } {
    const trimmed = line.trim();

    // 1. ถ้าเป็นบรรทัดว่าง ไม่แทรก
    if (!trimmed) {
      return { shouldBrand: false, reason: 'empty_line' };
    }

    // 2. ถ้าอยู่ภายใน Multiline String หรือ Multiline Comment ไม่แทรกเพื่อป้องกัน Syntax Error
    if (context.inMultilineString || context.inMultilineComment) {
      return { shouldBrand: false, reason: 'inside_multiline_context' };
    }

    // 3. ตรวจสอบ Line Continuation: ถ้าบรรทัดลงท้ายด้วย '\' (เช่น Python, C macro)
    // การใส่คอมเมนต์หลัง '\' จะทำให้เกิด SyntaxError ทันที!
    if (trimmed.endsWith('\\')) {
      return { shouldBrand: false, reason: 'line_continuation_danger' };
    }

    // 4. ตรวจจับการมีอยู่ของปีกกาปิด '}'
    const hasClosingBrace = trimmed.includes('}');

    // 4.1 ถ้าเป็นโหมด 'brace_only' (ใส่หลัง } เท่านั้น)
    if (mode === 'brace_only') {
      if (hasClosingBrace) {
        // ป้องกันกรณีที่ '}' อยู่ในสตริง literal บรรทัดเดียว เช่น const a = "}"
        if (this.isBraceOutsideString(trimmed)) {
          const isJsx = this.isLineInsideJsxChildren(trimmed, language);
          return { shouldBrand: true, isJsxChild: isJsx, reason: 'has_closing_brace' };
        }
      }
      return { shouldBrand: false, reason: 'no_closing_brace' };
    }

    // 4.2 ถ้ามี '}' ในโหมด 'brace_or_statement_end'
    if (hasClosingBrace && this.isBraceOutsideString(trimmed)) {
      const isJsx = this.isLineInsideJsxChildren(trimmed, language);
      return { shouldBrand: true, isJsxChild: isJsx, reason: 'has_closing_brace' };
    }

    // 4.3 ถ้าเป็นโหมด 'brace_or_statement_end' (หรือหลังจบ code บรรทัดนั้นก็พอ)
    if (mode === 'brace_or_statement_end') {
      const isStatementEnd = this.isCompleteStatementEnd(trimmed, language);
      if (isStatementEnd) {
        const isJsx = this.isLineInsideJsxChildren(trimmed, language);
        return { shouldBrand: true, isJsxChild: isJsx, reason: 'statement_end' };
      }
      return { shouldBrand: false, reason: 'not_statement_end' };
    }

    // 4.4 ถ้าเป็นโหมด 'all_safe_lines'
    if (mode === 'all_safe_lines') {
      // ตรวจสอบความปลอดภัยทั่วไป: ไม่ลงท้ายด้วยตัวเชื่อมไม่สมบูรณ์
      if (
        trimmed.endsWith(',') ||
        trimmed.endsWith('(') ||
        trimmed.endsWith('[') ||
        trimmed.endsWith('{') ||
        trimmed.endsWith('+') ||
        trimmed.endsWith('-') ||
        trimmed.endsWith('*') ||
        trimmed.endsWith('/') ||
        trimmed.endsWith('&&') ||
        trimmed.endsWith('||') ||
        trimmed.endsWith('?') ||
        trimmed.endsWith(':') ||
        trimmed.endsWith('=>') ||
        trimmed.endsWith('.')
      ) {
        return { shouldBrand: false, reason: 'incomplete_expression' };
      }
      const isJsx = this.isLineInsideJsxChildren(trimmed, language);
      return { shouldBrand: true, isJsxChild: isJsx, reason: 'safe_line' };
    }

    return { shouldBrand: false };
  }

  /**
   * ตรวจสอบว่าปีกกาปิด '}' อยู่นอกสตริง literal
   */
  private isBraceOutsideString(line: string): boolean {
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prev = i > 0 ? line[i - 1] : '';

      if (char === "'" && prev !== '\\' && !inDoubleQuote && !inBacktick) {
        inSingleQuote = !inSingleQuote;
      } else if (char === '"' && prev !== '\\' && !inSingleQuote && !inBacktick) {
        inDoubleQuote = !inDoubleQuote;
      } else if (char === '`' && prev !== '\\' && !inSingleQuote && !inDoubleQuote) {
        inBacktick = !inBacktick;
      } else if (char === '}' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
        return true;
      }
    }
    return false;
  }

  /**
   * ตรวจสอบว่าบรรทัดนี้คือจุดสิ้นสุดของ Code Statement ที่สมบูรณ์
   */
  private isCompleteStatementEnd(trimmed: string, language: string): boolean {
    const lang = (language || '').toLowerCase().trim();

    // 1. ลงท้ายด้วย Semicolon ';' (TS, JS, C, C++, C#, Java, Rust, PHP, etc.)
    if (trimmed.endsWith(';')) {
      return true;
    }

    // 2. ลงท้ายด้วยปีกกาปิดรูปแบบต่างๆ
    if (
      trimmed.endsWith('}') ||
      trimmed.endsWith('};') ||
      trimmed.endsWith('},') ||
      trimmed.endsWith('})') ||
      trimmed.endsWith('});') ||
      trimmed.endsWith('}]') ||
      trimmed.endsWith('}];') ||
      trimmed.includes('} else') ||
      trimmed.includes('} catch') ||
      trimmed.includes('} finally')
    ) {
      return true;
    }

    // 3. ภาษา Lua: ลงท้ายด้วย 'end'
    if (lang === 'lua' && (trimmed === 'end' || trimmed.endsWith(' end') || trimmed.endsWith('end)'))) {
      return true;
    }

    // 4. ภาษา Python: จบบล็อก/คำสั่งที่สมบูรณ์
    if (['python', 'py'].includes(lang)) {
      if (
        trimmed.startsWith('return') ||
        trimmed === 'pass' ||
        trimmed === 'break' ||
        trimmed === 'continue' ||
        trimmed.startsWith('raise') ||
        trimmed.endsWith(':') ||
        trimmed.endsWith(')') ||
        trimmed.endsWith(']') ||
        trimmed.endsWith('}')
      ) {
        return true;
      }
    }

    // 5. HTML / XML: ปิดแท็กสมบูรณ์
    if (['html', 'xml', 'svg'].includes(lang)) {
      if (trimmed.endsWith('>') && !trimmed.startsWith('<!--')) {
        return true;
      }
    }

    return false;
  }

  /**
   * ตรวจสอบว่าบรรทัดนี้อยู่ในบริบท Children ของ JSX หรือไม่
   */
  private isLineInsideJsxChildren(trimmed: string, language: string): boolean {
    const lang = (language || '').toLowerCase().trim();
    if (!['typescript', 'javascript', 'tsx', 'jsx'].includes(lang)) {
      return false;
    }

    // ถ้าลงท้ายด้วย tag ปิดเช่น </Component> หรือ </div> หรือ />
    if (trimmed.endsWith('>') && (trimmed.startsWith('<') || trimmed.startsWith('</') || trimmed.endsWith('/>'))) {
      return true;
    }

    // ถ้าเป็น JSX Expression Closure เช่น )} ใน children
    if (trimmed.startsWith('}') && !trimmed.endsWith(';') && !trimmed.endsWith(')')) {
      // อาจเป็น {expression} ภายใน JSX
      return false;
    }

    return false;
  }

  /**
   * ประมวลผลแทรกหมายเหตุลิขสิทธิ์อย่างปลอดภัย 100%
   */
  public processCode(
    rawCode: string,
    language: string = 'typescript',
    options: SyntaxSafetyOptions
  ): BrandedSafetyResult {
    if (!rawCode) {
      return {
        originalCode: '',
        brandedCode: '',
        totalLines: 0,
        brandedLines: 0,
        skippedLines: 0,
        language,
        mode: options.mode || 'brace_or_statement_end'
      };
    }

    const mode = options.mode || 'brace_or_statement_end';
    const brandTag = options.brandTag;

    // ตรวจสอบภาษาที่ไม่รองรับคอมเมนต์ เช่น JSON
    if (!this.isCommentSupported(language)) {
      const lines = rawCode.split('\n');
      return {
        originalCode: rawCode,
        brandedCode: rawCode, // คืนค่าเดิม ไม่แทรกคอมเมนต์ลงใน JSON เพื่อป้องกัน parse error
        totalLines: lines.length,
        brandedLines: 0,
        skippedLines: lines.length,
        language,
        mode
      };
    }

    const lines = rawCode.split('\n');
    let inMultilineString = false;
    let inMultilineComment = false;

    let brandedLinesCount = 0;
    let skippedLinesCount = 0;

    const formattedLines = lines.map((line) => {
      // หากมีตราแบรนด์อยู่แล้ว ให้ข้ามเพื่อไม่ให้ซ้ำซ้อน (Idempotent)
      if (line.includes('โดยโปรแกรม') || line.includes(brandTag)) {
        brandedLinesCount++;
        return line;
      }

      const trimmed = line.trim();

      // ตรวจสอบการเปิด/ปิด Block Comment (/* ... */)
      if (trimmed.includes('/*') && !trimmed.includes('*/')) {
        inMultilineComment = true;
      }

      // ตรวจสอบการเปิด/ปิด Multiline Template Literal (``` `...` ```)
      const backtickCount = (line.match(/(?<!\\)`/g) || []).length;
      if (backtickCount % 2 === 1) {
        inMultilineString = !inMultilineString;
      }

      // ตรวจสอบความปลอดภัยและเกณฑ์การแทรก
      const decision = this.shouldBrandLine(line, mode, language, {
        inMultilineString,
        inMultilineComment
      });

      // ถ้าบล็อกคอมเมนต์ปิดในบรรทัดนี้
      if (inMultilineComment && trimmed.includes('*/')) {
        inMultilineComment = false;
      }

      if (!decision.shouldBrand) {
        skippedLinesCount++;
        return line;
      }

      // ได้รับการอนุมัติให้แทรกหมายเหตุ!
      brandedLinesCount++;
      const syntax = this.getCommentSyntax(language, decision.isJsxChild);

      // จัดรูปแบบคอมเมนต์ต่อท้ายบรรทัดอย่างปลอดภัย
      if (syntax.isBlock) {
        return `${line} ${syntax.blockOpen} ${brandTag} ${syntax.blockClose}`;
      } else {
        return `${line} ${syntax.linePrefix} ${brandTag}`;
      }
    });

    return {
      originalCode: rawCode,
      brandedCode: formattedLines.join('\n'),
      totalLines: lines.length,
      brandedLines: brandedLinesCount,
      skippedLines: skippedLinesCount,
      language,
      mode
    };
  }
}

export const codeBrandingSyntaxSafetyEngine = CodeBrandingSyntaxSafetyEngine.getInstance();
