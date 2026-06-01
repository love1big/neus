import fs from 'fs';
const lines = fs.readFileSync('src/components/AIChat.tsx', 'utf8').split('\n');

let cutPoint = -1;
for (let i = 20; i < lines.length; i++) {
  if (lines[i].includes("`d, X, Mic")) {
    cutPoint = i;
    break;
  }
}

console.log("cutPoint:", cutPoint);
let trueTailStart = -1;
for (let i = cutPoint; i < lines.length; i++) {
  if (lines[i].includes("public activateSystem") && lines[i+1] && lines[i+1].includes("console.log")) {
     trueTailStart = i + 4; 
     break;
  }
}

console.log("trueTailStart:", trueTailStart);
console.log("TOP ENDS WITH:\n" + lines.slice(cutPoint-5, cutPoint).join('\n'));
console.log("\nBOTTOM STARTS WITH:\n" + lines.slice(trueTailStart-2, trueTailStart+5).join('\n'));

if (cutPoint !== -1 && trueTailStart !== -1) {
    let topPart = lines.slice(0, cutPoint);
    let bottomPart = lines.slice(trueTailStart);
    
    // Check if bottomPart actually contains what we expect
    if (bottomPart[0].startsWith("`d, X") || bottomPart[0] === "        });") {
        console.log("wait, bottomPart[0] is: ", bottomPart[0]);
    }
}
