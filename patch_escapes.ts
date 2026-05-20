import fs from 'fs';

['src/components/ArchitectureDevOpsEditor.tsx', 'src/components/ScriptEditor.tsx', 'src/components/WorldBuilderEditor.tsx'].forEach(file => {
   let code = fs.readFileSync(file, 'utf8');
   code = code.replace(/\\\$/g, '$');
   code = code.replace(/\\`/g, '`');
   fs.writeFileSync(file, code);
});
console.log('Fixed syntax escapes');
