import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/content: \\`\/\/ \[Auto-Generated Blueprint Node\]\\\\n\/\/ Node: Apply External Force/g, "content: `// [Auto-Generated Blueprint Node]\\n// Node: Apply External Force");
code = code.replace(/this\.ExecOut\(\);\\\\n  \}\\\\n\\\\n  public ExecOut\(\) \{\\\\n    \/\/ Output execution pin\\\\n  \}\\\\n\}\\\\n\\`/g, "this.ExecOut();\\n  }\\n\\n  public ExecOut() {\\n    // Output execution pin\\n  }\\n}\\n`");

fs.writeFileSync('src/components/AIChat.tsx', code);
