/**
 * ============================================================================
 * LanguageEditorConfigurator.ts (ระบบตั้งค่า Editor ตามภาษาโปรแกรมที่ตรวจพบ)
 * ============================================================================
 * 
 * [TH] วัตถุประสงค์และหน้าที่:
 * โมดูลนี้ทำหน้าที่แปลงผลการตรวจจับภาษา (Language Detection Result) ไปเป็นการตั้งค่า Editor
 * ของ Monaco Editor และ UI ควบคุมของ IDE อย่างแม่นยำและเหมาะสมที่สุด ครอบคลุม:
 * 1. Syntax Highlighting Target (monacoLanguageId)
 * 2. Indentation & Tab Size (e.g. 2 spaces สำหรับ Web/JSON/YAML, 4 spaces สำหรับ C++/Python/Rust)
 * 3. Auto-Closing Pairs, Brackets Colorization, และ Word Wrapping
 * 4. Line/Block Comment Markers สำหรับ Shortcut Cmd+/ และ Alt+Shift+A
 * 5. Formatting Profiles & Lint Presets
 * 
 * [EN] Purpose & Responsibilities:
 * Transforms detected language metadata into optimized Monaco Editor options,
 * tokenization themes, indentation models, and formatting configurations.
 * 
 * ============================================================================
 */

import { DetectedLanguageResult, SUPPORTED_LANGUAGES, LanguageDefinition } from './LanguageDetectorEngine';

export interface EditorConfigurationProfile {
  languageId: string;
  monacoLanguage: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  formatOnType: boolean;
  formatOnPaste: boolean;
  bracketPairColorization: boolean;
  renderWhitespace: 'all' | 'none' | 'boundary' | 'selection';
  commentPrefix: string;
  blockComment?: [string, string];
  linterName: string;
  formatterName: string;
  encoding: string;
  lineEnding: 'LF' | 'CRLF';
}

export class LanguageEditorConfigurator {
  /**
   * Generates editor options customized for the detected language
   */
  public static getConfiguration(detected: DetectedLanguageResult): EditorConfigurationProfile {
    const langDef: LanguageDefinition | undefined = SUPPORTED_LANGUAGES[detected.id];

    const tabSize = langDef?.defaultTabSize || (['python', 'rust', 'cpp', 'c', 'csharp', 'java', 'kotlin'].includes(detected.id) ? 4 : 2);
    const commentPrefix = langDef?.commentPrefix || '//';
    const blockComment = langDef?.blockComment || ['/*', '*/'];

    // Specialized formatters and linters per language
    let linterName = 'ESLint / TypeScript Linter';
    let formatterName = 'Prettier';

    switch (detected.id) {
      case 'python':
        linterName = 'Ruff / Flake8 / Pylint';
        formatterName = 'Black / PEP8 Formatter';
        break;
      case 'rust':
        linterName = 'Clippy (rustc)';
        formatterName = 'rustfmt';
        break;
      case 'cpp':
      case 'c':
        linterName = 'Clang-Tidy / Cppcheck';
        formatterName = 'Clang-Format (LLVM)';
        break;
      case 'csharp':
        linterName = 'Roslyn Analyzer';
        formatterName = 'OmniSharp Formatter';
        break;
      case 'go':
        linterName = 'golangci-lint';
        formatterName = 'gofmt / goimports';
        break;
      case 'sql':
        linterName = 'SQLFluff';
        formatterName = 'sql-formatter';
        break;
      case 'json':
      case 'yaml':
      case 'markdown':
        linterName = 'SchemaValidator';
        formatterName = 'Prettier Formatter';
        break;
      case 'dockerfile':
        linterName = 'Hadolint';
        formatterName = 'Dockerfile Formatter';
        break;
      case 'lua':
        linterName = 'Luacheck';
        formatterName = 'StyLua Formatter';
        break;
      default:
        linterName = 'Standard Engine Linter';
        formatterName = 'Prettier';
    }

    return {
      languageId: detected.id,
      monacoLanguage: detected.monacoId,
      tabSize,
      insertSpaces: true,
      wordWrap: ['markdown', 'html', 'json', 'yaml'].includes(detected.id) ? 'on' : 'off',
      formatOnType: true,
      formatOnPaste: true,
      bracketPairColorization: true,
      renderWhitespace: 'selection',
      commentPrefix,
      blockComment,
      linterName,
      formatterName,
      encoding: 'UTF-8',
      lineEnding: 'LF'
    };
  }

  /**
   * Returns Monaco Editor options object directly
   */
  public static getMonacoOptions(config: EditorConfigurationProfile) {
    return {
      tabSize: config.tabSize,
      insertSpaces: config.insertSpaces,
      wordWrap: config.wordWrap,
      formatOnType: config.formatOnType,
      formatOnPaste: config.formatOnPaste,
      'bracketPairColorization.enabled': config.bracketPairColorization,
      renderWhitespace: config.renderWhitespace,
      minimap: { enabled: true, renderCharacters: false },
      fontSize: 14,
      fontFamily: "var(--code-font, 'Fira Code', 'Courier New', monospace)",
      scrollBeyondLastLine: true,
      smoothScrolling: true,
      padding: { top: 16 },
      cursorBlinking: 'smooth' as const,
      cursorSmoothCaretAnimation: 'on' as const,
      lineNumbers: 'on' as const,
      glyphMargin: true,
      folding: true
    };
  }
}
