/**
 * Test to verify that EVERY subtool defined in `tools` has a dedicated component that can be loaded.
 */

import fs from 'fs';
import path from 'path';

// Let's read App.tsx
const appTsx = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');

// Extract ID_MAP
const idMapMatch = appTsx.match(/const ID_MAP: Record<string, string> = \{([\s\S]*?)\};/);
const idMap: Record<string, string> = {};
if (idMapMatch) {
  const lines = idMapMatch[1].split('\n');
  for (const line of lines) {
    const m = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (m) idMap[m[1]] = m[2];
  }
}

// Extract componentImports
const componentImportsMatch = appTsx.match(/export const componentImports: Record<string, \(\) => Promise<any>> = \{([\s\S]*?)\};/);
const registeredComponents: Record<string, string> = {};
if (componentImportsMatch) {
  const lines = componentImportsMatch[1].split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_]+):\s*\(\)\s*=>\s*import\(["']\.\/components\/([A-Za-z0-9_]+)["']\)/);
    if (m) registeredComponents[m[1]] = m[2];
  }
}

// Extract tools and their subtools
const toolBlocks = appTsx.match(/subTools:\s*\[([\s\S]*?)\]/g) || [];
const allSubTools: string[] = [];

for (const block of toolBlocks) {
  const ids = Array.from(block.matchAll(/id:\s*"([^"]+)"/g)).map(m => m[1]);
  allSubTools.push(...ids);
}

console.log(`Total subTools across all categories: ${allSubTools.length}`);

const missingSubtools: { id: string; mappedId: string; fileExists: boolean; filePath?: string }[] = [];
const workingSubtools: string[] = [];

for (const id of allSubTools) {
  const mappedId = idMap[id] || id;
  if (registeredComponents[mappedId]) {
    workingSubtools.push(id);
  } else {
    // Check if file exists in src/components/
    const candidateFile = path.join(process.cwd(), 'src', 'components', `${id}.tsx`);
    const mappedFile = path.join(process.cwd(), 'src', 'components', `${mappedId}.tsx`);
    const fileExists = fs.existsSync(candidateFile) || fs.existsSync(mappedFile);
    missingSubtools.push({
      id,
      mappedId,
      fileExists,
      filePath: fs.existsSync(candidateFile) ? `${id}.tsx` : fs.existsSync(mappedFile) ? `${mappedId}.tsx` : undefined
    });
  }
}

console.log(`Working subtools with direct component: ${workingSubtools.length}`);
console.log(`Subtools without registered component in componentImports: ${missingSubtools.length}`);

if (missingSubtools.length > 0) {
  console.log('\nDetails of missing subtools:');
  for (const item of missingSubtools) {
    console.log(` - ID: "${item.id}" (Mapped: "${item.mappedId}") -> File exists: ${item.fileExists} (${item.filePath || 'NO FILE'})`);
  }
}
