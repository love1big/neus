/**
 * Comprehensive Runtime Dynamic Import Test for all registered components in App.tsx
 */

import fs from 'fs';
import path from 'path';

// Extract componentImports from App.tsx
const appTsx = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');
const componentImportsMatch = appTsx.match(/export const componentImports: Record<string, \(\) => Promise<any>> = \{([\s\S]*?)\};/);
if (!componentImportsMatch) {
  console.error('Could not find componentImports');
  process.exit(1);
}

const componentImportsBlock = componentImportsMatch[1];
const lines = componentImportsBlock.split('\n');
const targets: { key: string; file: string }[] = [];

for (const line of lines) {
  const m = line.match(/^\s*([A-Za-z0-9_]+):\s*\(\)\s*=>\s*import\(["']\.\/components\/([A-Za-z0-9_]+)["']\)/);
  if (m) {
    targets.push({ key: m[1], file: `./src/components/${m[2]}.tsx` });
  }
}

console.log(`Testing dynamic import for ${targets.length} registered components...`);

async function run() {
  let passed = 0;
  let failed = 0;
  const failureDetails: { key: string; file: string; error: string }[] = [];
  const missingDefaultExport: string[] = [];

  for (const target of targets) {
    try {
      // Import the module dynamically
      const fullPath = path.resolve(process.cwd(), target.file);
      const mod = await import(fullPath);
      
      // Verify that the module has a default export (needed for React.lazy)
      if (!mod.default) {
        missingDefaultExport.push(target.key);
      }
      passed++;
    } catch (err: any) {
      failed++;
      failureDetails.push({
        key: target.key,
        file: target.file,
        error: err?.message || String(err)
      });
    }
  }

  console.log(`\n================================`);
  console.log(`DYNAMIC IMPORT RESULTS:`);
  console.log(`Passed: ${passed}/${targets.length}`);
  console.log(`Failed: ${failed}/${targets.length}`);
  console.log(`Missing default export: ${missingDefaultExport.length}`);
  console.log(`================================`);

  if (failureDetails.length > 0) {
    console.error('\n❌ FAILED COMPONENTS:');
    failureDetails.forEach(f => console.error(`  - [${f.key}] (${f.file}): ${f.error}`));
  }

  if (missingDefaultExport.length > 0) {
    console.error('\n⚠️ COMPONENTS MISSING DEFAULT EXPORT (React.lazy will fail on these!):');
    missingDefaultExport.forEach(k => console.error(`  - ${k}`));
  }

  if (failed > 0 || missingDefaultExport.length > 0) {
    process.exit(1);
  }
}

run();
