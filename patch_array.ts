import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const replacementArrayText = `
      { id: 'LocalAI', title: 'Local AI Compute Studio', icon: <BrainCircuit size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'WorldBuilder', title: '🌍 Nano-to-Macro World Builder', icon: <Globe size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'SentientAI', title: '🧠 Sentient AI & NPCDirector', icon: <Brain size={20} />, activeColor: 'text-[#f85149]' },
      { id: 'ProceduralAsset', title: '🎬 Procedural Asset Studio', icon: <FlaskConical size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'DevOpsManager', title: '🛡️ System Architecture & DevOps Manager', icon: <Server size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'LevelDesign', title: 'Level Assembly (Blockout & ProBuilder)', icon: <Mountain size={20} />, activeColor: 'text-[#e3b341]' },`;

appCode = appCode.replace(
      /\{\s*id:\s*'LocalAI',\s*title:\s*'Local AI Compute Studio'.*?\n\s*\{\s*id:\s*'LevelDesign',\s*title:\s*'Level Assembly.*?\},/,
      replacementArrayText
);

fs.writeFileSync('src/App.tsx', appCode);
console.log('App.tsx Array patched');
