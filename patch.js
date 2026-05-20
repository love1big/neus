const fs = require('fs');
let code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
let startIdx = code.indexOf("case 'Modeling':");
let endIdx = code.indexOf("case 'ImageEdit':");
if (startIdx !== -1 && endIdx !== -1) {
  let newData = code.substring(0, startIdx) + "case 'Modeling':\n         return <ModelingEditor />;\n      " + code.substring(endIdx);
  fs.writeFileSync('src/components/ModulePanel.tsx', newData);
  console.log("Success");
} else {
  console.log("Target not found", startIdx, endIdx);
}
