const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/<GamePreview \/>/g, '<GamePreview files={[]} />');
appCode = appCode.replace(/<LogViewer \/>/g, '<LogViewer logs={[]} />');
fs.writeFileSync('src/App.tsx', appCode);

let bm = fs.readFileSync('src/components/BuildMonitor.tsx', 'utf8');
bm = bm.replace(/Activity, Activity,/g, 'Activity,');
fs.writeFileSync('src/components/BuildMonitor.tsx', bm);

let st = fs.readFileSync('src/components/SystemTap.tsx', 'utf8');
st = st.replace(/Activity, Activity,/g, 'Activity,');
fs.writeFileSync('src/components/SystemTap.tsx', st);

let cmd = ['AICommandCenter', 'AudioEditor', 'BatchAIImporter', 'LocalAIStudio', 'PCGEditor', 'VoiceMusicStudio'];
for (let c of cmd) {
    let f = `src/components/${c}.tsx`;
    if(fs.existsSync(f)) {
        let code = fs.readFileSync(f, 'utf8');
        code = code.replace(/<iconText/g, '<div');
        code = code.replace(/<\/iconText>/g, '</div>');
        fs.writeFileSync(f, code);
    }
}

let dl = 'src/components/AIOfflineDownloader.tsx';
if(fs.existsSync(dl)) {
    let code = fs.readFileSync(dl, 'utf8');
    if(!code.includes('import { Wifi')) {
        code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { Wifi, $1} from 'lucide-react';");
        fs.writeFileSync(dl, code);
    }
}
console.log("Fixed!");
