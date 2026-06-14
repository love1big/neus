const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const toRemove = [
  "import { Message as ChatMessage } from './components/AIChat';",
  "import AIChat from './components/AIChat';",
  "import NetworkSim from './components/NetworkSim';",
  "import AudioEditor from './components/AudioEditor';",
  "import PCGEditor from './components/PCGEditor';",
  "import LocalAIStudio from './components/LocalAIStudio';",
  "import BatchAIImporter from './components/BatchAIImporter';",
  "import VoiceMusicStudio from './components/VoiceMusicStudio';",
  "import AICommandCenter from './components/AICommandCenter';",
];

toRemove.forEach(str => {
  code = code.replace(new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
});

// Remove unused state and renders
code = code.replace(/<AIChat.*\/>/g, '');
code = code.replace(/<NetworkSim.*\/>/g, '');
code = code.replace(/<AudioEditor.*\/>/g, '');
code = code.replace(/activeTool === 'PCG' && <PCGEditor \/>/g, '');
code = code.replace(/activeTool === 'LocalAI' && <LocalAIStudio \/>/g, '');
code = code.replace(/activeTool === 'BatchAI' && <BatchAIImporter \/>/g, '');
code = code.replace(/activeTool === 'VoiceMusic' && <VoiceMusicStudio \/>/g, '');
code = code.replace(/activeTool === 'AICenter' && <AICommandCenter \/>/g, '');
code = code.replace(/\{activeTool === '.*? && <PCGEditor \/>\}/g, '');
code = code.replace(/\{.*?<PCGEditor \/>.*?\}/g, '');
code = code.replace(/\{.*?<LocalAIStudio \/>.*?\}/g, '');
code = code.replace(/\{.*?<BatchAIImporter \/>.*?\}/g, '');
code = code.replace(/\{.*?<VoiceMusicStudio \/>.*?\}/g, '');
code = code.replace(/\{.*?<AICommandCenter \/>.*?\}/g, '');
code = code.replace(/\{.*?<NetworkSim \/>.*?\}/g, '');
code = code.replace(/\{.*?<AudioEditor \/>.*?\}/g, '');
code = code.replace(/\{.*?<AIChat \/>.*?\}/g, '');
code = code.replace(/\{mobileView === 'chat' && [\s\S]*?\}?/g, '');
code = code.replace(/\{mobileView === 'chat'[\s\S]*?<ChatMessages[\s\S]*?<\/div>[\s\S]*?\)?\}/g, '');

code = code.replace(/const \[chatMessages, setChatMessages\].*?\]\);/s, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Cleaned up App.tsx imports');
