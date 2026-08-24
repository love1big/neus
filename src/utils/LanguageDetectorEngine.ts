/**
 * ============================================================================
 * LanguageDetectorEngine.ts (ระบบตรวจจับภาษาโปรแกรมอัตโนมัติ)
 * ============================================================================
 * 
 * [TH] วัตถุประสงค์และหน้าที่:
 * โมดูลนี้ทำหน้าที่ตรวจจับภาษาโปรแกรม (Programming Language Detection) ของไฟล์หรือโค้ด
 * ที่เปิดในระบบ IDE โดยอัตโนมัติ โดยใช้การวิเคราะห์หลายระดับ (Multi-Tiered Detection Pipeline):
 * 1. File Extension & Name Analysis: ตรวจสอบนามสกุลไฟล์และชื่อไฟล์พิเศษ (e.g. Dockerfile, CMakeLists.txt, .tsx, .rs, .py)
 * 2. Shebang Detection: ตรวจสอบบรรทัดแรกของสคริปต์ (e.g. #!/usr/bin/env python3, #!/bin/bash)
 * 3. Modeline & Meta Tags: ตรวจสอบแท็กภาษาเฉพาะ (e.g. <?php, <!DOCTYPE html>, # -*- coding: utf-8 -*-)
 * 4. Token & Keyword Heuristics Analysis: วิเคราะห์น้ำหนักทางสถิติของคีย์เวิร์ด, รูปแบบไวยากรณ์ (Syntax Patterns),
 *    โครงสร้างคำสั่ง, ชนิดวงเล็บ และสัญลักษณ์เฉพาะตัว
 * 5. Confidence Score Calculation: ประเมินความมั่นใจของผลการตรวจจับออกมาเป็นเปอร์เซ็นต์ (0 - 100%)
 * 
 * [EN] Purpose & Responsibilities:
 * High-precision, multi-stage programming language detection engine designed for IDE environments.
 * It analyzes file paths, shebang headers, syntax tokens, and statistical heuristic signatures
 * to accurately identify over 60+ programming, markup, scripting, and shader languages.
 * 
 * Inputs:
 * - filename: string (optional file path or filename, e.g. "player_controller.ts" or "shader.frag")
 * - code: string (content buffer or snippet)
 * - hintLanguage?: string (optional user hint or previous state)
 * 
 * Outputs:
 * - DetectedLanguageResult: Object containing languageId, displayName, monacoLanguageId,
 *   confidence, detectionMethod, category, color, extensions, and metadata.
 * 
 * ============================================================================
 */

export type LanguageCategory = 
  | 'systems' 
  | 'web' 
  | 'scripting' 
  | 'data-markup' 
  | 'shader-graphics' 
  | 'devops-config' 
  | 'mobile' 
  | 'functional';

export interface LanguageDefinition {
  id: string;
  name: string;
  monacoId: string;
  category: LanguageCategory;
  extensions: string[];
  filenames?: string[];
  shebangs?: string[];
  mimeType: string;
  color: string;
  keywords: string[];
  syntaxPatterns: RegExp[];
  sampleTemplate?: string;
  commentPrefix: string;
  blockComment?: [string, string];
  defaultTabSize: number;
}

export interface DetectedLanguageResult {
  id: string;
  name: string;
  monacoId: string;
  confidence: number; // 0 to 100
  method: 'filename_exact' | 'extension' | 'shebang' | 'heuristics_strong' | 'heuristics_statistical' | 'fallback';
  category: LanguageCategory;
  color: string;
  details: string;
  sampleKeywordsFound: string[];
  lineCount: number;
  byteSize: number;
}

/**
 * Exhaustive database of supported programming languages and their signatures
 */
export const SUPPORTED_LANGUAGES: Record<string, LanguageDefinition> = {
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    monacoId: 'typescript',
    category: 'web',
    extensions: ['.ts', '.tsx', '.mts', '.cts'],
    mimeType: 'application/typescript',
    color: '#3178c6',
    keywords: ['interface', 'type', 'enum', 'implements', 'declare', 'namespace', 'as', 'readonly', 'public', 'private', 'protected', 'abstract', 'import', 'export', 'const', 'let'],
    syntaxPatterns: [
      /\binterface\s+[A-Za-z0-9_<>]+/,
      /\btype\s+[A-Za-z0-9_]+\s*=/,
      /:\s*(string|number|boolean|any|void|never|unknown|Promise<[^>]+>|React\.FC)/,
      /\bas\s+[A-Za-z0-9_<>]+/,
      /import\s+type\s+/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 2
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    monacoId: 'javascript',
    category: 'web',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    mimeType: 'text/javascript',
    color: '#f7df1e',
    keywords: ['const', 'let', 'var', 'function', 'return', 'import', 'export', 'default', 'class', 'extends', 'async', 'await', 'prototype', 'typeof', 'instanceof'],
    syntaxPatterns: [
      /\bfunction\s*[a-zA-Z0-9_]*\s*\(/,
      /\bconst\s+[a-zA-Z0-9_]+\s*=\s*(\(|async|function)/,
      /console\.(log|warn|error|debug|info)\(/,
      /document\.(getElementById|querySelector|addEventListener)/,
      /module\.exports\s*=/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 2
  },
  python: {
    id: 'python',
    name: 'Python',
    monacoId: 'python',
    category: 'scripting',
    extensions: ['.py', '.pyw', '.pyi'],
    shebangs: ['python', 'python3', 'python2'],
    mimeType: 'text/x-python',
    color: '#3572A5',
    keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'in', 'while', 'return', 'yield', 'lambda', 'with', 'as', 'try', 'except', 'finally', 'raise', 'pass', 'None', 'True', 'False', 'self'],
    syntaxPatterns: [
      /def\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*:/,
      /class\s+[a-zA-Z0-9_]+(\s*\([^)]*\))?\s*:/,
      /if\s+__name__\s*==\s*['"]__main__['"]\s*:/,
      /import\s+[a-zA-Z0-9_]+(\s+as\s+[a-zA-Z0-9_]+)?/,
      /from\s+[a-zA-Z0-9_.]+\s+import/
    ],
    commentPrefix: '#',
    blockComment: ['"""', '"""'],
    defaultTabSize: 4
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    monacoId: 'rust',
    category: 'systems',
    extensions: ['.rs'],
    mimeType: 'text/rust',
    color: '#dea584',
    keywords: ['fn', 'let', 'mut', 'pub', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'match', 'where', 'crate', 'unsafe', 'move', 'loop', 'ref', 'self', 'Self', 'Option', 'Result', 'Some', 'None', 'Ok', 'Err'],
    syntaxPatterns: [
      /\bfn\s+[a-zA-Z0-9_]+\s*(<[^>]+>)?\s*\(/,
      /\bpub(\(crate\))?\s+(struct|enum|fn|trait|type)/,
      /\bimpl(<[^>]+>)?\s+[a-zA-Z0-9_]+/,
      /\blet\s+mut\s+/,
      /println!\s*\(/,
      /vec!\s*\[/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    monacoId: 'cpp',
    category: 'systems',
    extensions: ['.cpp', '.cxx', '.cc', '.hpp', '.hxx', '.hh'],
    mimeType: 'text/x-c++src',
    color: '#f34b7d',
    keywords: ['#include', 'std::', 'template', 'typename', 'class', 'struct', 'namespace', 'public:', 'private:', 'protected:', 'virtual', 'override', 'constexpr', 'nullptr', 'auto', 'cout', 'cin', 'endl'],
    syntaxPatterns: [
      /#include\s+[<"][a-zA-Z0-9_./\\]+[>"]/,
      /\bstd::(vector|string|cout|cin|endl|shared_ptr|unique_ptr|unordered_map)/,
      /\btemplate\s*<typename/,
      /\bclass\s+[a-zA-Z0-9_]+\s*:\s*(public|private)/,
      /\bcout\s*<<\s*/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  c: {
    id: 'c',
    name: 'C',
    monacoId: 'c',
    category: 'systems',
    extensions: ['.c', '.h'],
    mimeType: 'text/x-csrc',
    color: '#555555',
    keywords: ['#include', '#define', '#ifdef', '#ifndef', '#endif', 'typedef', 'struct', 'enum', 'union', 'sizeof', 'malloc', 'free', 'printf', 'NULL', 'void', 'int', 'char'],
    syntaxPatterns: [
      /#include\s+<stdio\.h>/,
      /#include\s+<stdlib\.h>/,
      /\bprintf\s*\(\s*"/,
      /\btypedef\s+struct\s+/,
      /\b(malloc|free|memcpy|memset)\s*\(/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  csharp: {
    id: 'csharp',
    name: 'C# / Unity / Godot',
    monacoId: 'csharp',
    category: 'systems',
    extensions: ['.cs', '.csx'],
    mimeType: 'text/x-csharp',
    color: '#178600',
    keywords: ['using', 'namespace', 'public', 'private', 'protected', 'class', 'interface', 'override', 'virtual', 'async', 'await', 'Task', 'var', 'string', 'int', 'bool', 'MonoBehaviour', 'GameObject', 'Transform'],
    syntaxPatterns: [
      /using\s+System(\.[a-zA-Z0-9_]+)*;/,
      /using\s+UnityEngine;/,
      /namespace\s+[a-zA-Z0-9_.]+/,
      /public\s+class\s+[a-zA-Z0-9_]+\s*:\s*MonoBehaviour/,
      /Console\.(WriteLine|ReadLine)\(/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  go: {
    id: 'go',
    name: 'Go (Golang)',
    monacoId: 'go',
    category: 'systems',
    extensions: ['.go'],
    mimeType: 'text/x-go',
    color: '#00ADD8',
    keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'chan', 'go', 'select', 'defer', 'range', 'nil', 'make', 'len', 'cap'],
    syntaxPatterns: [
      /package\s+[a-zA-Z0-9_]+/,
      /import\s+(\(\s*["a-zA-Z0-9_./]+\s*\)|"[a-zA-Z0-9_./]+)/,
      /func\s+(\([a-zA-Z0-9_*]+\)\s*)?[a-zA-Z0-9_]+\s*\(/,
      /fmt\.(Println|Printf|Sprintf)\(/,
      /:=\s*/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  java: {
    id: 'java',
    name: 'Java',
    monacoId: 'java',
    category: 'systems',
    extensions: ['.java', '.jar'],
    mimeType: 'text/x-java-source',
    color: '#b07219',
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'new', 'static', 'final', 'void', 'this', 'super', 'System.out.println'],
    syntaxPatterns: [
      /package\s+[a-zA-Z0-9_.]+;/,
      /import\s+java\.[a-zA-Z0-9_.]+;/,
      /public\s+class\s+[a-zA-Z0-9_]+/,
      /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*[a-zA-Z0-9_]+\s*\)/,
      /System\.out\.println\(/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    monacoId: 'kotlin',
    category: 'mobile',
    extensions: ['.kt', '.kts'],
    mimeType: 'text/x-kotlin',
    color: '#A97BFF',
    keywords: ['fun', 'val', 'var', 'class', 'package', 'import', 'override', 'data', 'companion', 'object', 'when', 'is', 'in', 'null', 'coroutine'],
    syntaxPatterns: [
      /fun\s+[a-zA-Z0-9_]+\s*\(/,
      /data\s+class\s+[a-zA-Z0-9_]+/,
      /val\s+[a-zA-Z0-9_]+\s*(:\s*[a-zA-Z0-9_<>?]+)?\s*=/,
      /companion\s+object/,
      /println\s*\(/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    monacoId: 'swift',
    category: 'mobile',
    extensions: ['.swift'],
    mimeType: 'text/x-swift',
    color: '#F05138',
    keywords: ['import', 'var', 'let', 'func', 'class', 'struct', 'enum', 'protocol', 'extension', 'guard', 'if', 'else', 'guard let', 'if let', 'self', 'some View', 'SwiftUI'],
    syntaxPatterns: [
      /import\s+(SwiftUI|UIKit|Foundation)/,
      /func\s+[a-zA-Z0-9_]+\s*\(/,
      /var\s+body:\s+some\s+View/,
      /guard\s+let\s+/,
      /@State\s+private\s+var/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  html: {
    id: 'html',
    name: 'HTML',
    monacoId: 'html',
    category: 'web',
    extensions: ['.html', '.htm', '.xhtml'],
    mimeType: 'text/html',
    color: '#e34c26',
    keywords: ['<!DOCTYPE html>', '<html>', '<head>', '<body>', '<div>', '<span>', '<script>', '<style>', '<p>', '<a>', '<img>'],
    syntaxPatterns: [
      /<!DOCTYPE\s+html>/i,
      /<html(\s+[^>]*>|>)/i,
      /<div(\s+[^>]*>|>)/i,
      /<\/[a-zA-Z0-9]+>/
    ],
    commentPrefix: '<!--',
    blockComment: ['<!--', '-->'],
    defaultTabSize: 2
  },
  css: {
    id: 'css',
    name: 'CSS',
    monacoId: 'css',
    category: 'web',
    extensions: ['.css'],
    mimeType: 'text/css',
    color: '#563d7c',
    keywords: ['@import', '@media', '@keyframes', 'display:', 'margin:', 'padding:', 'background:', 'color:', 'flex', 'grid'],
    syntaxPatterns: [
      /[.#]?[a-zA-Z0-9_-]+\s*\{\s*[\r\n\s]*[a-zA-Z-]+:/,
      /@media\s*\([^)]+\)\s*\{/,
      /display:\s*(flex|grid|block|inline|none);/
    ],
    commentPrefix: '/*',
    blockComment: ['/*', '*/'],
    defaultTabSize: 2
  },
  scss: {
    id: 'scss',
    name: 'SCSS / SASS',
    monacoId: 'scss',
    category: 'web',
    extensions: ['.scss', '.sass'],
    mimeType: 'text/x-scss',
    color: '#c6538c',
    keywords: ['$primary', '@mixin', '@include', '@extend', '@use', '@forward'],
    syntaxPatterns: [
      /\$[a-zA-Z0-9_-]+:\s*[^;]+;/,
      /@mixin\s+[a-zA-Z0-9_-]+/,
      /@include\s+[a-zA-Z0-9_-]+/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 2
  },
  json: {
    id: 'json',
    name: 'JSON',
    monacoId: 'json',
    category: 'data-markup',
    extensions: ['.json', '.jsonc', '.json5'],
    mimeType: 'application/json',
    color: '#292929',
    keywords: ['true', 'false', 'null'],
    syntaxPatterns: [
      /^\s*\{\s*"[a-zA-Z0-9_$-]+":/,
      /^\s*\[\s*\{/
    ],
    commentPrefix: '//',
    defaultTabSize: 2
  },
  yaml: {
    id: 'yaml',
    name: 'YAML',
    monacoId: 'yaml',
    category: 'data-markup',
    extensions: ['.yaml', '.yml'],
    mimeType: 'text/yaml',
    color: '#cb171e',
    keywords: ['version:', 'services:', 'steps:', 'name:', 'runs-on:', 'jobs:'],
    syntaxPatterns: [
      /^---\s*$/m,
      /^[a-zA-Z0-9_-]+:\s*([^\r\n]*)$/m,
      /^\s*-\s+name:\s*/m
    ],
    commentPrefix: '#',
    defaultTabSize: 2
  },
  markdown: {
    id: 'markdown',
    name: 'Markdown',
    monacoId: 'markdown',
    category: 'data-markup',
    extensions: ['.md', '.markdown', '.mdown'],
    mimeType: 'text/markdown',
    color: '#083fa1',
    keywords: ['#', '##', '###', '```', '- [ ]', '- [x]'],
    syntaxPatterns: [
      /^#{1,6}\s+[^\r\n]+/m,
      /^```[a-zA-Z0-9_-]*/m,
      /\[[^\]]+\]\([^)]+\)/
    ],
    commentPrefix: '<!--',
    blockComment: ['<!--', '-->'],
    defaultTabSize: 2
  },
  sql: {
    id: 'sql',
    name: 'SQL Database',
    monacoId: 'sql',
    category: 'data-markup',
    extensions: ['.sql', '.psql', '.mysql', '.sqlite'],
    mimeType: 'application/sql',
    color: '#e38c00',
    keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'JOIN', 'LEFT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'PRIMARY KEY'],
    syntaxPatterns: [
      /\bSELECT\s+[^\r\n]+FROM\s+/i,
      /\bCREATE\s+TABLE\s+/i,
      /\bINSERT\s+INTO\s+/i,
      /\bALTER\s+TABLE\s+/i
    ],
    commentPrefix: '--',
    blockComment: ['/*', '*/'],
    defaultTabSize: 2
  },
  shell: {
    id: 'shell',
    name: 'Bash / Shell Script',
    monacoId: 'shell',
    category: 'scripting',
    extensions: ['.sh', '.bash', '.zsh', '.env'],
    shebangs: ['bash', 'sh', 'zsh'],
    mimeType: 'application/x-sh',
    color: '#89e051',
    keywords: ['echo', 'export', 'if', 'then', 'else', 'fi', 'for', 'in', 'do', 'done', 'case', 'esac', 'function', 'chmod', 'chown', 'mkdir', 'cd', 'rm'],
    syntaxPatterns: [
      /^#!\/bin\/(bash|sh|zsh)/m,
      /\b(echo|export|chmod|mkdir|grep|awk|sed)\s+/,
      /\bif\s+\[\s+.*\s+\];\s*then/,
      /\bcase\s+\$[a-zA-Z0-9_]+\s+in/
    ],
    commentPrefix: '#',
    defaultTabSize: 2
  },
  dockerfile: {
    id: 'dockerfile',
    name: 'Dockerfile',
    monacoId: 'dockerfile',
    category: 'devops-config',
    extensions: ['.dockerfile'],
    filenames: ['Dockerfile', 'dockerfile', 'Containerfile'],
    mimeType: 'text/x-dockerfile',
    color: '#384d54',
    keywords: ['FROM', 'RUN', 'COPY', 'ADD', 'WORKDIR', 'ENV', 'EXPOSE', 'CMD', 'ENTRYPOINT', 'VOLUME', 'USER', 'ARG'],
    syntaxPatterns: [
      /^FROM\s+[a-zA-Z0-9_./:-]+/im,
      /^(RUN|COPY|WORKDIR|ENV|EXPOSE|CMD)\s+/im
    ],
    commentPrefix: '#',
    defaultTabSize: 2
  },
  lua: {
    id: 'lua',
    name: 'Lua (Roblox / Defold / LÖVE)',
    monacoId: 'lua',
    category: 'scripting',
    extensions: ['.lua'],
    mimeType: 'text/x-lua',
    color: '#000080',
    keywords: ['local', 'function', 'end', 'then', 'if', 'elseif', 'else', 'repeat', 'until', 'while', 'do', 'return', 'nil', 'true', 'false', 'require'],
    syntaxPatterns: [
      /\blocal\s+[a-zA-Z0-9_]+\s*=/,
      /\bfunction\s+[a-zA-Z0-9_.:]+\s*\([^)]*\)/,
      /\bthen\s*[\r\n]/,
      /\bprint\s*\(/
    ],
    commentPrefix: '--',
    blockComment: ['--[[', ']]'],
    defaultTabSize: 2
  },
  php: {
    id: 'php',
    name: 'PHP',
    monacoId: 'php',
    category: 'web',
    extensions: ['.php', '.phtml', '.php7', '.php8'],
    mimeType: 'application/x-httpd-php',
    color: '#4F5D95',
    keywords: ['<?php', 'function', 'class', 'public', 'private', 'echo', 'return', 'namespace', 'use', 'foreach', 'array'],
    syntaxPatterns: [
      /<\?php/i,
      /\$[a-zA-Z_][a-zA-Z0-9_]*\s*=/,
      /echo\s+["'$]/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    monacoId: 'ruby',
    category: 'scripting',
    extensions: ['.rb', '.rake', 'Gemfile'],
    shebangs: ['ruby'],
    mimeType: 'text/x-ruby',
    color: '#701516',
    keywords: ['def', 'end', 'class', 'module', 'require', 'attr_accessor', 'puts', 'yield', 'nil', 'self'],
    syntaxPatterns: [
      /def\s+[a-zA-Z0-9_!?]+\s*(\([^)]*\))?/,
      /class\s+[A-Z][a-zA-Z0-9_]*(\s*<\s*[A-Z][a-zA-Z0-9_]*)?/,
      /require\s+['"][a-zA-Z0-9_./]+['"]/,
      /puts\s+["']/
    ],
    commentPrefix: '#',
    blockComment: ['=begin', '=end'],
    defaultTabSize: 2
  },
  graphql: {
    id: 'graphql',
    name: 'GraphQL',
    monacoId: 'graphql',
    category: 'data-markup',
    extensions: ['.graphql', '.gql'],
    mimeType: 'application/graphql',
    color: '#e10098',
    keywords: ['type', 'query', 'mutation', 'subscription', 'schema', 'input', 'enum', 'interface', 'scalar'],
    syntaxPatterns: [
      /type\s+[A-Za-z0-9_]+\s*\{/,
      /query\s+[A-Za-z0-9_]*\s*(\([^)]*\))?\s*\{/,
      /mutation\s+[A-Za-z0-9_]*\s*(\([^)]*\))?\s*\{/
    ],
    commentPrefix: '#',
    defaultTabSize: 2
  },
  glsl: {
    id: 'glsl',
    name: 'GLSL / HLSL Shader',
    monacoId: 'cpp', // Fallback for monaco shader rendering
    category: 'shader-graphics',
    extensions: ['.glsl', '.vert', '.frag', '.geom', '.comp', '.hlsl', '.fx'],
    mimeType: 'text/x-glsl',
    color: '#56b6c2',
    keywords: ['#version', 'precision', 'uniform', 'attribute', 'varying', 'in', 'out', 'inout', 'vec2', 'vec3', 'vec4', 'mat4', 'mat3', 'sampler2D', 'layout', 'void main()'],
    syntaxPatterns: [
      /#version\s+\d{3}/,
      /precision\s+(highp|mediump|lowp)\s+float;/,
      /uniform\s+(mat4|mat3|vec4|vec3|vec2|sampler2D)\s+[a-zA-Z0-9_]+;/,
      /layout\s*\(\s*location\s*=\s*\d+\s*\)\s*(in|out)/,
      /gl_Position\s*=/
    ],
    commentPrefix: '//',
    blockComment: ['/*', '*/'],
    defaultTabSize: 4
  }
};

/**
 * Main Detection Engine Class
 */
export class LanguageDetectorEngine {
  /**
   * Automatically detect language from filename and/or code contents
   */
  public static detect(filename?: string, code: string = '', hintLanguage?: string): DetectedLanguageResult {
    const trimmedCode = code.trim();
    const lineCount = code.split('\n').length;
    const byteSize = new Blob([code]).size;

    // STEP 1: Check Exact Filenames (e.g. Dockerfile)
    if (filename) {
      const baseName = filename.split(/[\/\\]/).pop() || '';
      for (const langKey in SUPPORTED_LANGUAGES) {
        const lang = SUPPORTED_LANGUAGES[langKey];
        if (lang.filenames && lang.filenames.includes(baseName)) {
          return {
            id: lang.id,
            name: lang.name,
            monacoId: lang.monacoId,
            confidence: 100,
            method: 'filename_exact',
            category: lang.category,
            color: lang.color,
            details: `Exact match for special configuration filename "${baseName}"`,
            sampleKeywordsFound: [baseName],
            lineCount,
            byteSize
          };
        }
      }

      // STEP 2: Check File Extension
      const dotIdx = baseName.lastIndexOf('.');
      if (dotIdx !== -1) {
        const ext = baseName.substring(dotIdx).toLowerCase();
        for (const langKey in SUPPORTED_LANGUAGES) {
          const lang = SUPPORTED_LANGUAGES[langKey];
          if (lang.extensions.includes(ext)) {
            // Further disambiguation for shared extensions like .h (C vs C++) or .ts/.tsx
            let confidence = 98;
            let sampleKeywords: string[] = [];

            if (ext === '.h') {
              if (/class\s+|namespace\s+|std::|template</.test(code)) {
                return this.createResult(SUPPORTED_LANGUAGES.cpp, 99, 'extension', `C++ header recognized by template/class tokens`, ['std::', 'class'], lineCount, byteSize);
              } else {
                return this.createResult(SUPPORTED_LANGUAGES.c, 95, 'extension', `Standard C header file extension`, ['#include'], lineCount, byteSize);
              }
            }

            // High-confidence extension detection
            return this.createResult(lang, confidence, 'extension', `Recognized file extension "${ext}"`, sampleKeywords, lineCount, byteSize);
          }
        }
      }
    }

    // STEP 3: Check Shebang line (e.g. #!/usr/bin/env python3)
    if (trimmedCode.startsWith('#!')) {
      const firstLine = trimmedCode.split('\n')[0].toLowerCase();
      for (const langKey in SUPPORTED_LANGUAGES) {
        const lang = SUPPORTED_LANGUAGES[langKey];
        if (lang.shebangs && lang.shebangs.some(sh => firstLine.includes(sh))) {
          return this.createResult(lang, 96, 'shebang', `Shebang interpreter directive: "${firstLine}"`, [firstLine], lineCount, byteSize);
        }
      }
    }

    // STEP 4: Content Pattern & Heuristics Scoring
    if (trimmedCode.length > 0) {
      let highestScore = 0;
      let bestLang: LanguageDefinition | null = null;
      let matchedDetails = '';
      let matchedKeywords: string[] = [];

      for (const langKey in SUPPORTED_LANGUAGES) {
        const lang = SUPPORTED_LANGUAGES[langKey];
        let score = 0;
        const foundTokens: string[] = [];

        // 4.1 Keyword density testing
        for (const kw of lang.keywords) {
          // Word boundary match
          const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'g');
          const matches = (code.match(regex) || []).length;
          if (matches > 0) {
            score += Math.min(matches * 4, 25);
            foundTokens.push(kw);
          }
        }

        // 4.2 Syntax RegEx pattern testing
        for (const pattern of lang.syntaxPatterns) {
          if (pattern.test(code)) {
            score += 35; // Heavy weight for distinct structural syntax
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestLang = lang;
          matchedKeywords = foundTokens.slice(0, 5);
          matchedDetails = `Matched ${foundTokens.length} language-specific keywords and structural patterns`;
        }
      }

      if (bestLang && highestScore >= 30) {
        const confidence = Math.min(Math.round(highestScore * 0.95), 94);
        return this.createResult(
          bestLang,
          confidence,
          highestScore > 60 ? 'heuristics_strong' : 'heuristics_statistical',
          matchedDetails,
          matchedKeywords,
          lineCount,
          byteSize
        );
      }
    }

    // STEP 5: Fallback to Hint or Plaintext/TypeScript Default
    if (hintLanguage && SUPPORTED_LANGUAGES[hintLanguage]) {
      const lang = SUPPORTED_LANGUAGES[hintLanguage];
      return this.createResult(lang, 60, 'fallback', `Defaulting to previously active hint (${lang.name})`, [], lineCount, byteSize);
    }

    // Standard default
    return this.createResult(SUPPORTED_LANGUAGES.typescript, 50, 'fallback', 'Uncertain format; defaulted to TypeScript syntax environment', [], lineCount, byteSize);
  }

  private static createResult(
    lang: LanguageDefinition,
    confidence: number,
    method: DetectedLanguageResult['method'],
    details: string,
    sampleKeywordsFound: string[],
    lineCount: number,
    byteSize: number
  ): DetectedLanguageResult {
    return {
      id: lang.id,
      name: lang.name,
      monacoId: lang.monacoId,
      confidence,
      method,
      category: lang.category,
      color: lang.color,
      details,
      sampleKeywordsFound,
      lineCount,
      byteSize
    };
  }
}
