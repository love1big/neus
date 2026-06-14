const fs = require('fs');

// ==== APP.TSX ====
let code = fs.readFileSync('src/App.tsx', 'utf8');

const appImports = [
  'NodeGraphEditor', 'LogicVisualEditor', 'BehaviorTreeEditor', 
  'ActionGraphEditor', 'WorkflowDAGEditor', 'GameStateFlagTree', 
  'BlueprintExecutionVisualizer'
];

appImports.forEach(imp => {
  const regex = new RegExp(`import ${imp} from '\\./components/${imp}';\\n*`, 'g');
  code = code.replace(regex, '');
});

code = code.replace("import EngineCoreEditor from './components/EngineCoreEditor';", "import EngineCoreEditor from './components/EngineCoreEditor';\nimport OmniVisualScriptingEngine from './components/OmniVisualScriptingEngine';");

const dupTools = [
  'NodeGraphEditor', 'LogicVisual', 'BehaviorTree', 'ActionGraph', 
  'WorkflowDAG', 'GameStateFlagTree', 'BlueprintExecution'
];

dupTools.forEach(t => {
  const regex = new RegExp(`\\{\\s*id:\\s*'${t}'.*?\\n`, 'g');
  code = code.replace(regex, '');
});

const omniTool = `      { id: 'OmniVisualScripting', title: 'Omni Visual Node Engine', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },\n`;
code = code.replace("{ id: 'EngineCore'", omniTool + "      { id: 'EngineCore'");

const appRender = [
  "activeTool === 'NodeGraphEditor' && <NodeGraphEditor />",
  "activeTool === 'BlueprintExecution' && <BlueprintExecutionVisualizer />",
  "activeTool === 'BehaviorTree' && <BehaviorTreeEditor />",
  "activeTool === 'LogicVisual' && <LogicVisualEditor />",
  "activeTool === 'ActionGraph' && <ActionGraphEditor />",
  "activeTool === 'WorkflowDAG' && <WorkflowDAGEditor />",
  "activeTool === 'GameStateFlagTree' && <GameStateFlagTree />",
];

appRender.forEach(r => {
  const regex = new RegExp(`\\{${r.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&')}\\}\\n*`, 'g');
  code = code.replace(regex, '');
});

code = code.replace("{activeTool === 'EngineCore' && <EngineCoreEditor />}", "{activeTool === 'EngineCore' && <EngineCoreEditor />}\n      {activeTool === 'OmniVisualScripting' && <OmniVisualScriptingEngine />}");

dupTools.forEach(t => {
  code = code.replace(`'${t}', `, '');
});
code = code.replace(`'EngineCore',`, `'EngineCore', 'OmniVisualScripting',`);

fs.writeFileSync('src/App.tsx', code, 'utf8');

// ==== MODULEPANEL.TSX ====
let modCode = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');

appImports.forEach(imp => {
  const regex = new RegExp(`import ${imp} from '\\./${imp}';\\n*`, 'g');
  modCode = modCode.replace(regex, '');
  
  const r1 = new RegExp(`<${imp}\\s*/>`, 'g');
  modCode = modCode.replace(r1, `null /* Removed ${imp} */`);
});

fs.writeFileSync('src/components/ModulePanel.tsx', modCode, 'utf8');

console.log('Visual scripting files patched');
