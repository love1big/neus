/**
 * Comprehensive Audit Script for OmniEngine IDE Tools & Components
 */

import fs from 'fs';
import path from 'path';

// Read App.tsx
const appTsx = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');

// 1. Extract componentImports
const componentImportsMatch = appTsx.match(/export const componentImports: Record<string, \(\) => Promise<any>> = \{([\s\S]*?)\};/);
if (!componentImportsMatch) {
  console.error('Could not find componentImports in App.tsx');
  process.exit(1);
}

const componentImportsBlock = componentImportsMatch[1];
const importLines = componentImportsBlock.split('\n');
const registeredComponents: Record<string, string> = {};

for (const line of importLines) {
  const m = line.match(/^\s*([A-Za-z0-9_]+):\s*\(\)\s*=>\s*import\(["']\.\/components\/([A-Za-z0-9_]+)["']\)/);
  if (m) {
    registeredComponents[m[1]] = m[2];
  }
}

console.log(`Found ${Object.keys(registeredComponents).length} registered components in componentImports.`);

// 2. Check if all target files exist in src/components/
const missingFiles: string[] = [];
for (const [key, compName] of Object.entries(registeredComponents)) {
  const targetPath = path.join(process.cwd(), 'src', 'components', `${compName}.tsx`);
  if (!fs.existsSync(targetPath)) {
    missingFiles.push(`${key} -> ${compName}.tsx`);
  }
}

if (missingFiles.length > 0) {
  console.error('❌ MISSING COMPONENT FILES REFERENCED IN componentImports:');
  missingFiles.forEach(f => console.error('  - ' + f));
} else {
  console.log('✓ All componentImports point to existing files on disk.');
}

// 3. Extract ID_MAP
const idMapMatch = appTsx.match(/const ID_MAP: Record<string, string> = \{([\s\S]*?)\};/);
const idMap: Record<string, string> = {};
if (idMapMatch) {
  const mapLines = idMapMatch[1].split('\n');
  for (const line of mapLines) {
    const m = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (m) {
      idMap[m[1]] = m[2];
    }
  }
}

// 4. Extract all subTool IDs from `tools` array
const subToolIdMatches = Array.from(appTsx.matchAll(/\{\s*id:\s*"([^"]+)"/g)).map(m => m[1]);
console.log(`Found ${subToolIdMatches.length} tool IDs in App.tsx.`);

const unmappedToolIds: string[] = [];
const mappedToMissing: string[] = [];

for (const toolId of subToolIdMatches) {
  const mappedId = idMap[toolId] || toolId;
  if (!registeredComponents[mappedId]) {
    // Check if there is a file named `${toolId}.tsx` in src/components/
    const directFile = path.join(process.cwd(), 'src', 'components', `${toolId}.tsx`);
    const mappedFile = path.join(process.cwd(), 'src', 'components', `${mappedId}.tsx`);
    if (fs.existsSync(directFile) || fs.existsSync(mappedFile)) {
      unmappedToolIds.push(toolId);
    } else {
      mappedToMissing.push(toolId);
    }
  }
}

console.log('\n--- AUDIT RESULTS ---');
console.log(`Tools with existing components that are NOT registered in componentImports or ID_MAP: ${unmappedToolIds.length}`);
if (unmappedToolIds.length > 0) {
  console.log('Unmapped IDs where component exists on disk:');
  unmappedToolIds.forEach(id => console.log('  ⚠️ ' + id));
}

console.log(`Tools with NO component file found: ${mappedToMissing.length}`);
if (mappedToMissing.length > 0) {
  console.log('Tools that fall back to VisualScriptEditor:');
  mappedToMissing.forEach(id => console.log('  ℹ️ ' + id));
}

// 5. Check for any broken files in src/components/
const allCompFiles = fs.readdirSync(path.join(process.cwd(), 'src', 'components')).filter(f => f.endsWith('.tsx'));
console.log(`\nTotal .tsx files in src/components/: ${allCompFiles.length}`);
