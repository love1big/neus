import fs from 'fs';

let archCode = fs.readFileSync('src/components/ArchitectureDevOpsEditor.tsx', 'utf8');
archCode = archCode.replace('Networking, Cpu', 'Network, Cpu');
fs.writeFileSync('src/components/ArchitectureDevOpsEditor.tsx', archCode);

let worldCode = fs.readFileSync('src/components/WorldBuilderEditor.tsx', 'utf8');
worldCode = worldCode.replace('{ timeProgression: number }', 'any');
if (!worldCode.includes('Rewind')) {
    worldCode = worldCode.replace('import {', 'import { Rewind,');
}
fs.writeFileSync('src/components/WorldBuilderEditor.tsx', worldCode);
console.log('Fixed imports and TS types');
