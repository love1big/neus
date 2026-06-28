const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const componentsToMap = [
  'KernelDebugger',
  'MemoryProfiler',
  'SystemTap',
  'AppProfiler',
  'VCSConflict',
  'HardwareConfig',
  'TerminalSvr',
  'DockerManager',
  'BuildMonitor',
  'CompilerTool',
  'CloudBuildPipeline',
  'VectorHybrid',
  'SpriteSheetGen',
  'InteractionPrototyper'
];

let importStatements = '';
for (const comp of componentsToMap) {
   importStatements += `import ${comp} from './components/${comp}';\n`;
}

// add imports after GenericToolPanel import
code = code.replace(/import GenericToolPanel from '\.\/components\/GenericToolPanel';/, 
  `import GenericToolPanel from './components/GenericToolPanel';\n${importStatements}`
);

// Map switch cases. Some of these don't have switch cases, they fallback to default right now.
// Let's insert explicit case statements for all of them right above the default case!

let switchCases = '';
const mappings = [
    {id: 'OptimizationOverview', comp: 'OptimizationOverview'},
    {id: 'KernelDebugger', comp: 'KernelDebugger'},
    {id: 'MemoryProfiler', comp: 'MemoryProfiler'},
    {id: 'SystemTap', comp: 'SystemTap'},
    {id: 'AppProfiler', comp: 'AppProfiler'},
    {id: 'LogViewer', comp: 'LogViewer'},
    {id: 'AudioDSP', comp: 'OmniAudioDSPStudio'},
    {id: 'ThaiPhonetics', comp: 'ThaiPhoneticsEngine'},
    {id: 'VCSConflict', comp: 'VCSConflict'},
    {id: 'HardwareConfig', comp: 'HardwareConfig'},
    {id: 'TerminalSvr', comp: 'TerminalSvr'},
    {id: 'DockerManager', comp: 'DockerManager'},
    {id: 'BuildMonitor', comp: 'BuildMonitor'},
    {id: 'CompilerTool', comp: 'CompilerTool'},
    {id: 'CloudBuildPipeline', comp: 'CloudBuildPipeline'},
    {id: 'SculptMaster', comp: 'ZBrushStyleSculptingStudio'},
    {id: 'UVRetopology', comp: 'TopologyUVPro'},
    {id: 'TextureBaker', comp: 'SubstanceStyleTexturePainter'},
    {id: 'VectorHybrid', comp: 'VectorHybrid'},
    {id: 'SpriteSheetGen', comp: 'SpriteSheetGen'},
    {id: 'FigmaClone', comp: 'FigmaStyleCanvas'},
    {id: 'InteractionPrototyper', comp: 'InteractionPrototyper'},
    {id: 'RenderPipeline', comp: 'GraphicsRenderEditor'},
    {id: 'GamePreview', comp: 'GamePreview'},
    {id: 'AssetStore', comp: 'AssetStore'},
    {id: 'ProjectSettings', comp: 'ProjectSettingsEditor'},
    {id: 'NetcodeEditor', comp: 'NetcodeEditor'},
    {id: 'NetworkSim', comp: 'NetworkSim'},
    {id: 'NetworkReplicationSim', comp: 'NetworkReplicationSim'},
    {id: 'LiveOpsDashboard', comp: 'LiveOpsDashboard'},
    {id: 'LiveOpsScheduler', comp: 'LiveOpsEventScheduler'},
    {id: 'TerrainGenerator', comp: 'TerrainGenerator'},
    {id: 'GameEconomyBalancer', comp: 'GameEconomyBalancer'},
    {id: 'CutsceneEditor', comp: 'CutsceneEditor'},
    {id: 'TaskPanel', comp: 'TaskPanel'}
];

for(const m of mappings) {
   switchCases += `      case '${m.id}': return <${m.comp} />;\n`;
}

// Remove previously duplicated cases from existing switch so we don't end up with duplicate cases
for(const m of mappings) {
    const rx = new RegExp(`case '${m.id}': return <\\w+ \\/>;\\n?`, 'g');
    code = code.replace(rx, '');
    const rx2 = new RegExp(`case '${m.id}': return <\\w+ toolId=.* \\/>;\\n?`, 'g');
    code = code.replace(rx2, '');
}

code = code.replace(/default: return <GenericToolPanel/, 
  `${switchCases}      default: return <GenericToolPanel`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched with remaining cases.');
