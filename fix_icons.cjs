const fs = require('fs');

let cmd = ['AICommandCenter', 'AudioEditor', 'BatchAIImporter', 'LocalAIStudio', 'PCGEditor', 'VoiceMusicStudio'];
for (let c of cmd) {
    let f = `src/components/${c}.tsx`;
    if(fs.existsSync(f)) {
        let code = fs.readFileSync(f, 'utf8');
        code = code.replace(/\{iconText\}/g, '<Activity size={64} />');
        fs.writeFileSync(f, code);
    }
}
console.log("Fixed icons!");
