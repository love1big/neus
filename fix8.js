import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

// Replace the problematic line with simple concatenation
data = data.replace(
  /actor\.system\.log\(.*?evolved trait.*?rarity.*?\);/s,
  "actor.system.log('Entity ' + actor.id + ' evolved trait: ' + traitId + ' (' + rarity + ')');"
);

// Fix the duplicated broadcast comment string
data = data.replace(
  /\/\/ Notify Swarm UI\r?\n\s*\/\/ Notify Swarm UI\\n\s*NexusUI\.broadcast\('EvolutionEvent', \{ actor: actor\.id, trait: traitId \}\);/s,
  "// Notify Swarm UI\n      NexusUI.broadcast('EvolutionEvent', { actor: actor.id, trait: traitId });"
);

fs.writeFileSync(path, data);
console.log('Done script replacement.');
