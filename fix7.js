import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(
  'actor.system.log(\\`Entity ${actor.id} evolved trait: ${traitId} (${rarity})\\`);',
  'actor.system.log(\\`Entity \\\\${actor.id} evolved trait: \\\\${traitId} (\\\\${rarity})\\`);'
);

data = data.replace(
  "NexusUI.broadcast('EvolutionEvent', { actor: actor.id, trait: traitId });",
  "// Notify Swarm UI\\n      NexusUI.broadcast('EvolutionEvent', { actor: actor.id, trait: traitId });"
)

fs.writeFileSync(path, data);
console.log('Fixed typescript errors!');
