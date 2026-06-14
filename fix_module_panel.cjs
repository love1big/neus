const fs = require('fs');

let code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');

// 1. Remove obsolete imports matching what we deleted
const obsoleteImports = [
  'LandscapeEditor', 'MapEditor', 'LevelDesignEditor', 'AdvancedTerrainEditor',
  'AdvancedMapBuilder', 'MegaWorldArchitect', 'UltimateMapGameBuilder',
  'WorldBuilderEditor', 'PCGEditor', 'BSPBrushArchitect', 'TerrainErosionSim',
  'LevelStreamingManager', 'AudioDAW', 'AudioEditor', 'AudioMusicDSPStudio', 
  'MidiPianoRoll', 'VoiceMusicStudio', 'VstMixerRack', 'NiagaraEditor', 
  'VFXHitboxStudio', 'OfflineAIVFXStudio', 'VFXGraphEditor', 'NukeStyleCompositor', 
  'PhysicsChaosDestruction', 'MetaSound'
];

obsoleteImports.forEach(imp => {
  const regex = new RegExp(`import ${imp} from '\\./${imp}';\\n*`, 'g');
  code = code.replace(regex, '');
});

// Since those tools are no longer provided, we should gracefully remove their switch blocks
// e.g. "case 'AudioEditor': return <AudioEditor />;"
// Since we don't know the exact case formatting, we'll strip them out.
// Wait, we can just replace `<AudioEditor />` with `null` so it doesn't break.
obsoleteImports.forEach(imp => {
  const regex1 = new RegExp(`<${imp}\\s*/>`, 'g');
  const regex2 = new RegExp(`<${imp}\\s*setActiveTool=\\{[^}]*\\}\\s*/>`, 'g');
  const regex3 = new RegExp(`<${imp}\\s*onNavigateToMapEdit=\\{[^}]*\\}\\s*onNavigateToMonsterEdit=\\{[^}]*\\}\\s*/>`, 'g');
  
  code = code.replace(regex1, `null /* Removed ${imp} */`);
  code = code.replace(regex2, `null /* Removed ${imp} */`);
  code = code.replace(regex3, `null /* Removed ${imp} */`);
});

fs.writeFileSync('src/components/ModulePanel.tsx', code, 'utf8');
console.log('ModulePanel.tsx patched');
