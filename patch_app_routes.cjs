const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<GenericToolPanel toolId='InputMapping' tools={tools} \/>/g, '<InputMapping />');
code = code.replace(/<GenericToolPanel toolId='MonsterEdit' tools={tools} \/>/g, '<MonsterEditor />');
code = code.replace(/<GenericToolPanel toolId='ASTNodeWeaver' tools={tools} \/>/g, '<ASTNodeWeaver />');
code = code.replace(/<GenericToolPanel toolId='VideoEncoder' tools={tools} \/>/g, '<VideoEncoderStudio />');
code = code.replace(/<GenericToolPanel toolId='HexEditor' tools={tools} \/>/g, '<HexEditorPanel />');
code = code.replace(/<GenericToolPanel toolId='RegexTester' tools={tools} \/>/g, '<RegexTesterPanel />');
code = code.replace(/<GenericToolPanel toolId='HexInjector' tools={tools} \/>/g, '<HexEditorPanel />');
code = code.replace(/<GenericToolPanel toolId='FontEditor' tools={tools} \/>/g, '<FontEditor />');
code = code.replace(/<GenericToolPanel toolId='EyeTrackingHeatmap' tools={tools} \/>/g, '<EyeTrackingHeatmap />');
code = code.replace(/<GenericToolPanel toolId='AccessibilityTester' tools={tools} \/>/g, '<AccessibilityTester />');

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx route cases.');
