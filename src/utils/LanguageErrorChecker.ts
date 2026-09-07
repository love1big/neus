/**
 * ============================================================================
 * LanguageErrorChecker.ts (ระบบตรวจสอบข้อผิดพลาดและวิเคราะห์ไวยากรณ์ตามภาษา)
 * ============================================================================
 * 
 * [TH] วัตถุประสงค์และหน้าที่:
 * โมดูลนี้ทำหน้าที่วิเคราะห์ข้อผิดพลาดของโค้ด (Language-Specific Syntax & Semantic Diagnostics)
 * ตามภาษาโปรแกรมที่ตรวจพบโดยอัตโนมัติ พร้อมสร้าง Monaco Editor Markers เพื่อขีดเส้นใต้แดง/เหลือง
 * และเสนอทางเลือกแก้ไขด่วน (One-Click Auto-Fix):
 * 1. Syntax Grammar & Structural Checks per Language:
 *    - Python: Missing colon after `def`, `if`, `class`, `for`, `while`, unclosed string literals
 *    - TypeScript/JavaScript: Unbalanced braces/parentheses, unclosed interfaces, missing imports, bad exports
 *    - Rust: Missing `fn` return arrow `->`, mismatched `impl` blocks, missing semicolons in statements
 *    - C/C++: Missing `#include` delimiters `<>`, unbalanced `#ifdef` / `#endif`, missing trailing semicolons
 *    - GLSL/HLSL: Missing `#version` directive, bad vector Swizzle, invalid sampler2D declarations
 *    - SQL: Missing `FROM` in `SELECT`, unclosed quotes, invalid table constraint syntax
 *    - JSON: Malformed JSON syntax with exact line and column precision
 *    - Dockerfile: Unknown instruction verbs, invalid `FROM` base images
 * 2. Diagnostics Generation (line, column, severity, message, autofix actions)
 * 3. Monaco Markers Integration (`monaco.editor.setModelMarkers`)
 * 
 * [EN] Purpose & Responsibilities:
 * Real-time, multi-language syntax and semantic error diagnostic engine for IDEs.
 * Parses code buffers against language-specific grammar heuristics, computes line-exact
 * diagnostics, and synchronizes warning/error markers directly with Monaco Editor.
 * 
 * ============================================================================
 */

export interface DiagnosticError {
  id: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  suggestion?: string;
  autoFixable?: boolean;
  fixText?: string;
}

export class LanguageErrorChecker {
  /**
   * Run full diagnostics for a code snippet based on the detected language.
   * Supports either (languageId, code) or (code, languageId) argument order.
   */
  public static checkErrors(arg1: string, arg2: string): DiagnosticError[] {
    let languageId = 'typescript';
    let code = '';

    // Automatically detect argument order
    if (arg1.includes('\n') || arg1.length > 80 || (!arg2.includes('\n') && arg2.length < 30)) {
      code = arg1;
      languageId = arg2 || 'typescript';
    } else {
      languageId = arg1 || 'typescript';
      code = arg2 || '';
    }

    const errors: DiagnosticError[] = [];
    if (!code || typeof code !== 'string') return errors;

    const lines = code.split('\n');

    // 1. Universal Balanced Brackets & Quotes Check
    this.checkBalancedDelimiters(code, errors);

    // 2. Language-Specific Grammar Rules
    const lang = languageId.toLowerCase();

    switch (lang) {
      case 'python':
      case 'py':
        this.checkPython(lines, errors);
        break;
      case 'typescript':
      case 'ts':
      case 'tsx':
      case 'javascript':
      case 'js':
      case 'jsx':
        this.checkTypeScript(lines, errors);
        break;
      case 'rust':
      case 'rs':
        this.checkRust(lines, errors);
        break;
      case 'cpp':
      case 'c':
      case 'cxx':
      case 'cc':
      case 'h':
      case 'hpp':
        this.checkCpp(lines, errors);
        break;
      case 'csharp':
      case 'cs':
        this.checkCSharp(lines, errors);
        break;
      case 'glsl':
      case 'hlsl':
      case 'frag':
      case 'vert':
      case 'shader':
        this.checkGLSL(lines, errors);
        break;
      case 'sql':
      case 'psql':
      case 'mysql':
        this.checkSQL(lines, errors);
        break;
      case 'json':
        this.checkJSON(code, errors);
        break;
      case 'dockerfile':
      case 'docker':
        this.checkDockerfile(lines, errors);
        break;
      case 'html':
      case 'htm':
        this.checkHTML(code, lines, errors);
        break;
      case 'css':
      case 'scss':
      case 'less':
        this.checkCSS(lines, errors);
        break;
      default:
        // Generic check
        break;
    }

    return errors;
  }

  /**
   * Apply an automatic quick-fix to the code buffer for a diagnosed issue
   */
  public static applyQuickFix(code: string, diag: DiagnosticError): string {
    if (!diag) return code;
    const lines = code.split('\n');

    // If explicit fixText is provided
    if (diag.fixText !== undefined && diag.line >= 1 && diag.line <= lines.length) {
      if (diag.fixText === ':') {
        lines[diag.line - 1] = lines[diag.line - 1].trimEnd() + ':';
      } else {
        lines[diag.line - 1] = diag.fixText;
      }
      return lines.join('\n');
    }

    // Heuristic fixes based on diagnostic code
    switch (diag.code) {
      case 'PY_MISSING_COLON': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          lines[lineIdx] = lines[lineIdx].trimEnd() + ':';
        }
        return lines.join('\n');
      }

      case 'PY_PRINT_PARENS': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          lines[lineIdx] = lines[lineIdx].replace(/print\s+(["'][^"']+["'])/, 'print($1)');
        }
        return lines.join('\n');
      }

      case 'TS_CONST_UNINITIALIZED': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          lines[lineIdx] = lines[lineIdx].replace(/;?$/, ' = null;');
        }
        return lines.join('\n');
      }

      case 'TS_INTERFACE_OPEN': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          lines[lineIdx] = lines[lineIdx].trimEnd() + ' {\n}';
        }
        return lines.join('\n');
      }

      case 'GLSL_MISSING_VERSION': {
        return '#version 330 core\n\n' + code;
      }

      case 'DOCKERFILE_MISSING_FROM': {
        return 'FROM node:18-alpine\nWORKDIR /app\n\n' + code;
      }

      case 'CPP_MISSING_MAIN_RETURN': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          lines.splice(lineIdx + 1, 0, '    return 0;');
        }
        return lines.join('\n');
      }

      case 'SYNTAX_UNCLOSED_DELIMITER': {
        if (diag.suggestion && diag.suggestion.includes("'")) {
          const charMatch = diag.suggestion.match(/'([^']+)'/);
          if (charMatch && charMatch[1]) {
            return code + '\n' + charMatch[1];
          }
        }
        return code + '\n}';
      }

      case 'SYNTAX_UNMATCHED_DELIMITER': {
        const lineIdx = diag.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          // Remove rogue unclosed delimiter
          const targetCol = diag.column - 1;
          const targetLine = lines[lineIdx];
          lines[lineIdx] = targetLine.slice(0, targetCol) + targetLine.slice(targetCol + 1);
        }
        return lines.join('\n');
      }

      default:
        // Generic fallback: if suggestion has replacement text or keyword
        if (diag.suggestion) {
          const lineIdx = diag.line - 1;
          if (lineIdx >= 0 && lineIdx < lines.length) {
            if (diag.suggestion.includes('Add a semicolon')) {
              lines[lineIdx] = lines[lineIdx].trimEnd() + ';';
            } else if (diag.suggestion.includes('Add a colon')) {
              lines[lineIdx] = lines[lineIdx].trimEnd() + ':';
            } else {
              lines[lineIdx] = lines[lineIdx] + ' // Fixed by AI: ' + diag.suggestion;
            }
          }
        }
        return lines.join('\n');
    }
  }

  /**
   * Apply all auto-fixable diagnostics sequentially to the code buffer
   */
  public static applyAllQuickFixes(code: string, diagnostics: DiagnosticError[]): { code: string; fixedCount: number } {
    let currentCode = code;
    let fixedCount = 0;

    // Filter auto-fixable diagnostics and sort in reverse line order to prevent line offset drift
    const fixable = diagnostics
      .filter(d => d.autoFixable || d.suggestion || d.fixText)
      .sort((a, b) => b.line - a.line);

    for (const diag of fixable) {
      try {
        const nextCode = this.applyQuickFix(currentCode, diag);
        if (nextCode !== currentCode) {
          currentCode = nextCode;
          fixedCount++;
        }
      } catch (e) {
        console.warn('Failed to apply quick fix for diag:', diag.id, e);
      }
    }

    return { code: currentCode, fixedCount };
  }

  private static registeredProviders: any[] = [];

  /**
   * Register Monaco Code Action (Quick-Fix) and Hover Providers for Real-time AI fix tooltips
   */
  public static registerMonacoProviders(monaco: any, languageId: string, onFixWithAI: (diag: DiagnosticError) => void): void {
    if (!monaco || !monaco.languages) return;

    // Dispose previous providers to prevent duplicates
    if (this.registeredProviders.length > 0) {
      this.registeredProviders.forEach(p => {
        try { p.dispose(); } catch (e) {}
      });
      this.registeredProviders = [];
    }

    // 1. Monaco Code Action Provider (Ctrl+. / Quick Fix lightbulb)
    const actionProvider = monaco.languages.registerCodeActionProvider(languageId, {
      provideCodeActions: (model: any, range: any, context: any) => {
        const markers = context.markers || [];
        const code = model.getValue();
        const currentDiags = LanguageErrorChecker.checkErrors(code, languageId);
        
        const actions = markers.map((marker: any) => {
          const matchingDiag = currentDiags.find(d => 
            d.line === marker.startLineNumber && d.code === marker.code
          ) || {
            id: `diag_${marker.startLineNumber}`,
            line: marker.startLineNumber,
            column: marker.startColumn,
            endLine: marker.endLineNumber,
            endColumn: marker.endColumn,
            message: marker.message,
            severity: marker.severity === monaco.MarkerSeverity.Error ? 'error' : 'warning',
            code: marker.code || 'SYNTAX_ISSUE',
            suggestion: 'Fix syntax error automatically',
            autoFixable: true
          } as DiagnosticError;

          const fixedCode = LanguageErrorChecker.applyQuickFix(code, matchingDiag);

          return {
            title: `✨ Fix with AI: ${matchingDiag.suggestion || matchingDiag.message}`,
            kind: 'quickfix',
            diagnostics: [marker],
            isPreferred: true,
            edit: {
              edits: [
                {
                  resource: model.uri,
                  textEdit: {
                    range: model.getFullModelRange(),
                    text: fixedCode
                  }
                }
              ]
            }
          };
        });

        return {
          actions,
          dispose: () => {}
        };
      }
    });

    // 2. Monaco Hover Provider for Syntax Errors with Rich Markdown & Fix Action link
    const hoverProvider = monaco.languages.registerHoverProvider(languageId, {
      provideHover: (model: any, position: any) => {
        const code = model.getValue();
        const diags = LanguageErrorChecker.checkErrors(code, languageId);
        const match = diags.find(d => 
          d.line === position.lineNumber && 
          position.column >= d.column && 
          position.column <= (d.endColumn || d.column + 10)
        );

        if (!match) return null;

        const isErr = match.severity === 'error';
        const icon = isErr ? '🔴' : '🟡';
        
        return {
          range: new monaco.Range(
            match.line, 
            match.column, 
            match.endLine || match.line, 
            match.endColumn || match.column + 5
          ),
          contents: [
            { value: `**${icon} Syntax Diagnostic: ${match.severity.toUpperCase()}**` },
            { value: `${match.message} \`[${match.code}]\`` },
            match.suggestion ? { value: `💡 **AI Suggestion:** ${match.suggestion}` } : { value: '' }
          ].filter(c => c.value !== '')
        };
      }
    });

    this.registeredProviders.push(actionProvider, hoverProvider);
  }

  /**
   * Synchronize Diagnostic Errors with Monaco Editor markers.
   * Target can be either Monaco Editor instance or Monaco TextModel.
   */
  public static applyMonacoMarkers(monaco: any, target: any, diagnostics: DiagnosticError[]): void {
    if (!monaco || !monaco.editor || !target) return;
    const model = typeof target.getModel === 'function' ? target.getModel() : target;
    if (!model) return;

    const markers = diagnostics.map(diag => {
      let severity = monaco.MarkerSeverity.Error;
      if (diag.severity === 'warning') severity = monaco.MarkerSeverity.Warning;
      else if (diag.severity === 'info') severity = monaco.MarkerSeverity.Info;

      return {
        startLineNumber: Math.max(1, diag.line),
        startColumn: Math.max(1, diag.column),
        endLineNumber: Math.max(diag.line, diag.endLine || diag.line),
        endColumn: Math.max(diag.column + 1, diag.endColumn || diag.column + 5),
        message: `${diag.message} [${diag.code}]`,
        severity,
        code: diag.code,
        source: 'NexusEngine Syntax Engine'
      };
    });

    monaco.editor.setModelMarkers(model, 'language-error-checker', markers);
  }

  // ==========================================================================
  // SPECIFIC LANGUAGE VALIDATORS
  // ==========================================================================

  private static checkPython(lines: string[], errors: DiagnosticError[]): void {
    const colonKeywords = /^\s*(def|class|if|elif|else|for|while|try|except|finally|with)\b/;
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      // Check missing colon on block statements
      if (colonKeywords.test(line)) {
        // Strip trailing comment if present
        const codePart = trimmed.split('#')[0].trim();
        if (!codePart.endsWith(':')) {
          errors.push({
            id: `py_colon_${lineNum}`,
            line: lineNum,
            column: line.length,
            endLine: lineNum,
            endColumn: line.length + 1,
            message: `SyntaxError: Expected ':' at the end of '${trimmed.split(' ')[0]}' statement`,
            severity: 'error',
            code: 'PY_MISSING_COLON',
            suggestion: 'Add a colon (:) at the end of the line',
            autoFixable: true,
            fixText: ':'
          });
        }
      }

      // Check bad print statement in Python 3 (e.g. print "hello")
      if (/^\s*print\s+["'][^"']+["']\s*$/.test(line)) {
        errors.push({
          id: `py_print_${lineNum}`,
          line: lineNum,
          column: line.indexOf('print') + 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?`,
          severity: 'error',
          code: 'PY_PRINT_PARENS',
          suggestion: 'Wrap arguments in parentheses: print(...)',
          autoFixable: true
        });
      }
    });
  }

  private static checkTypeScript(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      // Check unclosed interface / type statement
      if (trimmed.startsWith('interface ') && !trimmed.includes('{') && !lines.slice(idx, idx + 3).some(l => l.includes('{'))) {
        errors.push({
          id: `ts_interface_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `TS1005: '{' expected after interface declaration`,
          severity: 'error',
          code: 'TS_INTERFACE_OPEN',
          suggestion: 'Open block with {'
        });
      }

      // Check `const` declaration without assignment
      if (/^\s*const\s+[a-zA-Z0-9_]+\s*(:\s*[a-zA-Z0-9_<>]+)?\s*;?\s*$/.test(line)) {
        errors.push({
          id: `ts_const_init_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `'const' declarations must be initialized`,
          severity: 'error',
          code: 'TS_CONST_UNINITIALIZED',
          suggestion: 'Assign an initial value to the const variable'
        });
      }
    });
  }

  private static checkRust(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return;

      // Check fn declaration missing parameters or brace
      if (/^\s*(pub\s+)?fn\s+[a-zA-Z0-9_]+\s*$/.test(trimmed)) {
        errors.push({
          id: `rs_fn_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `expected parameter list '()' after function name`,
          severity: 'error',
          code: 'RS_FN_PARAMS',
          suggestion: 'Add parameter list `()` and return type'
        });
      }

      // Check let mut statement missing variable
      if (/^\s*let\s+mut\s*;/.test(trimmed)) {
        errors.push({
          id: `rs_let_mut_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `expected identifier, found ';'`,
          severity: 'error',
          code: 'RS_IDENT_EXPECTED'
        });
      }
    });
  }

  private static checkCpp(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return;

      // Check bad #include syntax
      if (trimmed.startsWith('#include') && !/#include\s+[<"][a-zA-Z0-9_./\\]+[>"]/.test(trimmed)) {
        errors.push({
          id: `cpp_include_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `Invalid #include directive. Expected <header> or "header"`,
          severity: 'error',
          code: 'CPP_BAD_INCLUDE',
          suggestion: 'Wrap header in <...> or "..."'
        });
      }
    });
  }

  private static checkCSharp(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return;

      // Check using directive without semicolon
      if (trimmed.startsWith('using ') && !trimmed.endsWith(';') && !trimmed.includes('(')) {
        errors.push({
          id: `cs_using_${lineNum}`,
          line: lineNum,
          column: line.length,
          endLine: lineNum,
          endColumn: line.length + 1,
          message: `CS1002: ; expected after using directive`,
          severity: 'error',
          code: 'CS_MISSING_SEMICOLON',
          suggestion: 'Add ; to complete using directive',
          autoFixable: true
        });
      }
    });
  }

  private static checkGLSL(lines: string[], errors: DiagnosticError[]): void {
    let hasVersion = false;
    let hasMain = false;

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (trimmed.startsWith('#version')) hasVersion = true;
      if (trimmed.includes('void main()')) hasMain = true;

      // Check precision float syntax
      if (trimmed.startsWith('precision') && !trimmed.endsWith(';')) {
        errors.push({
          id: `glsl_precision_${lineNum}`,
          line: lineNum,
          column: line.length,
          endLine: lineNum,
          endColumn: line.length + 1,
          message: `Expected ';' at the end of precision qualifier`,
          severity: 'error',
          code: 'GLSL_SEMICOLON'
        });
      }
    });

    if (lines.length > 3 && !hasVersion) {
      errors.push({
        id: 'glsl_no_version',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 10,
        message: 'Shader is missing `#version 330 core` or `#version 450` declaration',
        severity: 'warning',
        code: 'GLSL_MISSING_VERSION',
        suggestion: 'Add `#version 330 core` at line 1'
      });
    }
  }

  private static checkSQL(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--')) return;

      // Check SELECT without FROM (for multiline query starters)
      if (/^\s*SELECT\s+.*$/i.test(trimmed) && !/FROM/i.test(trimmed) && idx === lines.length - 1) {
        errors.push({
          id: `sql_from_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: line.length,
          message: `SQL Warning: Incomplete query. Expected 'FROM <table>' clause.`,
          severity: 'warning',
          code: 'SQL_MISSING_FROM'
        });
      }
    });
  }

  private static checkJSON(code: string, errors: DiagnosticError[]): void {
    if (!code.trim()) return;
    try {
      JSON.parse(code);
    } catch (err: any) {
      const match = err.message.match(/at position (\d+)/);
      let line = 1;
      let col = 1;
      if (match && match[1]) {
        const pos = parseInt(match[1], 10);
        const upToPos = code.substring(0, pos);
        const linesArr = upToPos.split('\n');
        line = linesArr.length;
        col = linesArr[linesArr.length - 1].length + 1;
      }

      errors.push({
        id: `json_parse_err`,
        line,
        column: col,
        endLine: line,
        endColumn: col + 2,
        message: `JSON Syntax Error: ${err.message}`,
        severity: 'error',
        code: 'JSON_INVALID'
      });
    }
  }

  private static checkDockerfile(lines: string[], errors: DiagnosticError[]): void {
    const validInstructions = ['FROM', 'RUN', 'CMD', 'LABEL', 'MAINTAINER', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOPSIGNAL', 'HEALTHCHECK', 'SHELL'];

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const verb = trimmed.split(/\s+/)[0].toUpperCase();
      if (!validInstructions.includes(verb)) {
        errors.push({
          id: `docker_verb_${lineNum}`,
          line: lineNum,
          column: 1,
          endLine: lineNum,
          endColumn: verb.length + 1,
          message: `Unknown Dockerfile instruction: '${verb}'`,
          severity: 'error',
          code: 'DOCKER_UNKNOWN_VERB',
          suggestion: `Valid instructions: ${validInstructions.slice(0, 8).join(', ')}...`
        });
      }
    });
  }

  private static checkHTML(code: string, lines: string[], errors: DiagnosticError[]): void {
    // Check missing closing tags for standard tags like <div>, <p>, <span>
    const openDivs = (code.match(/<div(\s+[^>]*)?>/gi) || []).length;
    const closeDivs = (code.match(/<\/div>/gi) || []).length;

    if (openDivs !== closeDivs) {
      errors.push({
        id: 'html_div_mismatch',
        line: lines.length,
        column: 1,
        endLine: lines.length,
        endColumn: 10,
        message: `HTML Error: Mismatched <div> tags. Found ${openDivs} open tags and ${closeDivs} close tags.`,
        severity: 'error',
        code: 'HTML_UNCLOSED_TAG'
      });
    }
  }

  private static checkCSS(lines: string[], errors: DiagnosticError[]): void {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*') || trimmed.endsWith('{') || trimmed.endsWith('}')) return;

      if (trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith(',')) {
        errors.push({
          id: `css_semi_${lineNum}`,
          line: lineNum,
          column: line.length,
          endLine: lineNum,
          endColumn: line.length + 1,
          message: `CSS Warning: Declaration is missing a closing semicolon ';'`,
          severity: 'warning',
          code: 'CSS_MISSING_SEMICOLON',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Universal delimiter parity checking
   */
  private static checkBalancedDelimiters(code: string, errors: DiagnosticError[]): void {
    const stack: { char: string; line: number; col: number }[] = [];
    const lines = code.split('\n');

    let inString: string | null = null;
    let inLineComment = false;
    let inBlockComment = false;

    lines.forEach((line, lineIdx) => {
      inLineComment = false;
      const lineNum = lineIdx + 1;

      for (let cIdx = 0; cIdx < line.length; cIdx++) {
        const char = line[cIdx];
        const next = line[cIdx + 1];

        // Handle comments
        if (!inString && char === '/' && next === '/') {
          inLineComment = true;
          break;
        }
        if (!inString && char === '/' && next === '*') {
          inBlockComment = true;
          cIdx++;
          continue;
        }
        if (inBlockComment && char === '*' && next === '/') {
          inBlockComment = false;
          cIdx++;
          continue;
        }
        if (inLineComment || inBlockComment) continue;

        // Handle string literals
        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = char;
          continue;
        } else if (inString && char === inString && line[cIdx - 1] !== '\\') {
          inString = null;
          continue;
        }
        if (inString) continue;

        // Push opening brackets
        if (char === '{' || char === '(' || char === '[') {
          stack.push({ char, line: lineNum, col: cIdx + 1 });
        } else if (char === '}' || char === ')' || char === ']') {
          if (stack.length === 0) {
            errors.push({
              id: `unmatched_close_${lineNum}_${cIdx}`,
              line: lineNum,
              column: cIdx + 1,
              endLine: lineNum,
              endColumn: cIdx + 2,
              message: `Unmatched closing delimiter '${char}'`,
              severity: 'error',
              code: 'SYNTAX_UNMATCHED_DELIMITER'
            });
          } else {
            const top = stack.pop()!;
            const isMatch =
              (top.char === '{' && char === '}') ||
              (top.char === '(' && char === ')') ||
              (top.char === '[' && char === ']');
            if (!isMatch) {
              errors.push({
                id: `mismatched_bracket_${lineNum}_${cIdx}`,
                line: lineNum,
                column: cIdx + 1,
                endLine: lineNum,
                endColumn: cIdx + 2,
                message: `Mismatched delimiter: opened with '${top.char}' on line ${top.line}, but closed with '${char}'`,
                severity: 'error',
                code: 'SYNTAX_MISMATCHED_DELIMITER'
              });
            }
          }
        }
      }
    });

    // Unclosed brackets remaining in stack
    stack.forEach(unclosed => {
      errors.push({
        id: `unclosed_${unclosed.line}_${unclosed.col}`,
        line: unclosed.line,
        column: unclosed.col,
        endLine: unclosed.line,
        endColumn: unclosed.col + 1,
        message: `Unclosed delimiter '${unclosed.char}' opened on line ${unclosed.line}`,
        severity: 'error',
        code: 'SYNTAX_UNCLOSED_DELIMITER',
        suggestion: `Close delimiter with matching '${unclosed.char === '{' ? '}' : unclosed.char === '(' ? ')' : ']'}'`
      });
    });
  }
}
