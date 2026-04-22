export interface IDEFile {
  id: string;
  name: string;
  language: string;
  content: string;
  folder?: string; // Support for nested folders
}

export const TEMPLATES = {
  RPG: [
    { name: 'GameMode.blueprint', language: 'json', folder: 'Blueprints', content: '{\n  "class": "ARPGGameMode",\n  "logic": "Visual Scripting Graph..."\n}' },
    { name: 'MyMathLibrary.js', language: 'javascript', folder: 'Blueprints/FunctionLibrary', content: '// Custom Math Utility Functions\n\nexport function calculateDamage(base, multiplier) {\n  return base * multiplier;\n}\n\nexport function normalizeVector(x, y, z) {\n  const len = Math.sqrt(x*x + y*y + z*z);\n  return [x/len, y/len, z/len];\n}' },
    { name: 'main.js', language: 'javascript', folder: 'Scripts/Core', content: '// RPG Main Entry point\n// Warning: Chaos Physics and Lumen must be active.\nconsole.log("Game Engine Initialized");' },
    { name: 'World.map', language: 'json', folder: 'Maps', content: '{\n  "worldPartition": true,\n  "gridSize": 1024,\n  "name": "Open World Map",\n  "landscape": true\n}' },
    { name: 'Forest.pcg', language: 'json', folder: 'Scripts', content: '{\n  "type": "ProceduralContentGeneration",\n  "nodes": []\n}' },
    { name: 'Fireball.niagara', language: 'json', folder: 'FX/Niagara', content: '{\n  "type": "ParticleSystem",\n  "emitters": 4\n}' },
    { name: 'Water.material', language: 'json', folder: 'Assets/Materials', content: '{\n  "type": "Material",\n  "shading": "Surface",\n  "nodes": []\n}' },
    { name: 'OpeningScene.sequence', language: 'json', folder: 'Cinematics', content: '{\n  "duration": 120,\n  "tracks": []\n}' },
    { name: 'README.md', language: 'markdown', folder: '', content: '# RPG Project\nFully supports Nanite, Lumen, PCG, and Chaos Physics.' }
  ],
  FPS: [
    { name: 'PlayerController.cpp', language: 'cpp', folder: 'Scripts', content: '#include "PlayerController.h"\n\nvoid APlayerController::Shoot() {}' },
    { name: 'Weapon.blueprint', language: 'json', folder: 'Blueprints', content: '// Weapon Logic' },
    { name: 'level1.map', language: 'json', folder: 'Maps', content: '{}' },
    { name: 'Hero_01.metahuman', language: 'json', folder: 'Assets/MetaHumans', content: '{}' },
    { name: 'Hero_Rig.controlrig', language: 'json', folder: 'Assets/MetaHumans', content: '{\n  "bones": 128,\n  "ik": true\n}' }
  ],
  Blank: [
    { name: 'main.js', language: 'javascript', folder: '', content: '// Empty Project\n' }
  ]
};

export const DEFAULT_FOLDERS = [
  'Assets/Models', 'Assets/Textures', 'Assets/Materials', 'Assets/MetaHumans', 
  'Assets/Audio', 'FX/Niagara', 'Scripts', 
  'Blueprints', 'Blueprints/FunctionLibrary', 'Maps', 'Cinematics', 'Build', 'Data'
];
