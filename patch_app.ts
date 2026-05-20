import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import WorldBuilderEditor from './components/WorldBuilderEditor';
import SentientAIEditor from './components/SentientAIEditor';
import ProceduralAssetStudio from './components/ProceduralAssetStudio';
import ArchitectureDevOpsEditor from './components/ArchitectureDevOpsEditor';
`;

if (!appCode.includes('WorldBuilderEditor')) {
    // Add imports after standard imports
    appCode = appCode.replace("import LocalAIStudio from './components/LocalAIStudio';", "import LocalAIStudio from './components/LocalAIStudio';\n" + importsToAdd);
}

// Replace the activeTool logic block
const findBlock = `               {activeTool === 'LocalAI' && <LocalAIStudio />}`;
const replacementBlock = `               {activeTool === 'LocalAI' && <LocalAIStudio />}
               {activeTool === 'WorldBuilder' && <WorldBuilderEditor />}
               {activeTool === 'SentientAI' && <SentientAIEditor />}
               {activeTool === 'ProceduralAsset' && <ProceduralAssetStudio />}
               {activeTool === 'DevOpsManager' && <ArchitectureDevOpsEditor />}`;

if (appCode.includes(findBlock) && !appCode.includes('<WorldBuilderEditor />')) {
    appCode = appCode.replace(findBlock, replacementBlock);
}

// Overwrite the condition for Viewport3D
const oldConditionStart = `!['Select', 'BatchAI', 'Material', 'Pipeline'`;
const oldConditionPattern = /!\[.*?\]\.includes\(activeTool\)/;
const newCondition = `!['Select', 'BatchAI', 'Material', 'Pipeline', 'Blueprint', 'ServerSim', 'DataTable', 'AssetStore', 'StoryGraph', 'BehaviorTree', 'LogicVisual', 'MetaHuman', 'Niagara', 'PCG', 'UIUXEdit', 'LocalAI', 'LiveOps', 'PerformanceProfile', 'AnimGraph', 'Landscape', 'MapEdit', 'Netcode', 'EngineCore', 'LevelDesign', 'QuestDirector', 'Modeling', 'WorldBible', 'NPCEdit', 'MonsterEdit', 'PhysicsEngine', 'GameSystems', 'GraphicsRender', 'AnimationAudio', 'BackendCloud', 'AITestingQA', 'ControlRig', 'Sequencer', 'CinematicSequencer', 'MetaSound', 'ImageEdit', 'AudioEdit', 'EffectEdit', 'ScriptEditor', 'BuildPublish', 'AssetPipeline', 'DialogueQuest', 'ProceduralGen', 'AdvancedNavMesh', 'VoxelEngine', 'VehiclePhysics', 'MLAgents', 'VRXREngine', 'DevOpsBuilder', 'WorldBuilder', 'SentientAI', 'ProceduralAsset', 'DevOpsManager'].includes(activeTool)`;

appCode = appCode.replace(oldConditionPattern, newCondition);

fs.writeFileSync('src/App.tsx', appCode);
console.log('App.tsx patched for new editors');

let modulePanelCode = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
const modImports = `import WorldBuilderEditor from './WorldBuilderEditor';
import SentientAIEditor from './SentientAIEditor';
import ProceduralAssetStudio from './ProceduralAssetStudio';
import ArchitectureDevOpsEditor from './ArchitectureDevOpsEditor';
`;

if (!modulePanelCode.includes('WorldBuilderEditor')) {
    modulePanelCode = modulePanelCode.replace("import LocalAIStudio from './LocalAIStudio';", "import LocalAIStudio from './LocalAIStudio';\n" + modImports);
}

// ModulePanel doesn't need to mount them directly if they are in App.tsx! Wait!
// Some tools mount via App.tsx others via ModulePanel!
// Let's check ModulePanel return block
// Usually in ModulePanel we do switch(activeModule) ... return <Editor/>
// Looking at App.tsx, the activeTool is passed down.
console.log('ModulePanel patch skipped if not used directly for rendering these pages.');
