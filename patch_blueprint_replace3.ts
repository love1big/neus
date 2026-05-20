import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const targetStr = `        generatedFiles.push({
           filename: 'BPNode_ApplyForce.ts',
           language: 'typescript',
           content: \\\`// [Auto-Generated Blueprint Node]\\\\n// Node: Apply External Force\\\\n// Category: Physics -> Forces\\\\n\\\\nexport class BPNode_ApplyForce {\\\\n  public ExecIn() {\\\\n    // Input execution pin\\\\n  }\\\\n\\\\n  public execute(targetActor: any, directionVector: {x: number, y: number, z: number}, magnitude: number) {\\\\n    if (!targetActor || !targetActor.physicsLayer) {\\\\n      console.warn('ApplyForce: Target actor is invalid or lacks a physics layer.');\\\\n      return;\\\\n    }\\\\n\\\\n    // Normalize the direction vector to ensure uniform scaling by magnitude\\\\n    const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);\\\\n    let normDir = { x: 0, y: 0, z: 0 };\\\\n    \\\\n    if (length > 0) {\\\\n        normDir = {\\\\n            x: directionVector.x / length,\\\\n            y: directionVector.y / length,\\\\n            z: directionVector.z / length\\\\n        };\\\\n    }\\\\n\\\\n    // Calculate the final force vector\\\\n    const force = {\\\\n        x: normDir.x * magnitude,\\\\n        y: normDir.y * magnitude,\\\\n        z: normDir.z * magnitude\\\\n    };\\\\n\\\\n    // Apply to the actor's rigid body\\\\n    targetActor.physicsLayer.addForce(force);\\\\n    \\\\n    console.log(\\\\\\\`Applied force of \\\\\\\${magnitude} to actor in direction [\\\\\\\${normDir.x.toFixed(2)}, \\\\\\\${normDir.y.toFixed(2)}, \\\\\\\${normDir.z.toFixed(2)}]\\\\\\\`);\\\\n    \\\\n    this.ExecOut();\\\\n  }\\\\n\\\\n  public ExecOut() {\\\\n    // Output execution pin\\\\n  }\\\\n}\\\\n\\\`
        });`;

const replacement = "        generatedFiles.push({\n" +
"           filename: 'BPNode_ApplyForce.ts',\n" +
"           language: 'typescript',\n" +
"           content: `// [Auto-Generated Blueprint Node]\\n" +
"// Node: Apply External Force\\n" +
"// Category: Physics -> Forces\\n\\n" +
"export class BPNode_ApplyForce {\\n" +
"  public ExecIn() {\\n" +
"    // Input execution pin\\n" +
"  }\\n\\n" +
"  public execute(targetActor: any, directionVector: {x: number, y: number, z: number}, magnitude: number) {\\n" +
"    if (!targetActor || !targetActor.physicsLayer) {\\n" +
"      console.warn('ApplyForce: Target actor is invalid or lacks a physics layer.');\\n" +
"      return;\\n" +
"    }\\n\\n" +
"    // Normalize the direction vector to ensure uniform scaling by magnitude\\n" +
"    const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);\\n" +
"    let normDir = { x: 0, y: 0, z: 0 };\\n    \\n" +
"    if (length > 0) {\\n" +
"        normDir = {\\n" +
"            x: directionVector.x / length,\\n" +
"            y: directionVector.y / length,\\n" +
"            z: directionVector.z / length\\n" +
"        };\\n" +
"    }\\n\\n" +
"    // Calculate the final force vector\\n" +
"    const force = {\\n" +
"        x: normDir.x * magnitude,\\n" +
"        y: normDir.y * magnitude,\\n" +
"        z: normDir.z * magnitude\\n" +
"    };\\n\\n" +
"    // Apply to the actor's rigid body\\n" +
"    targetActor.physicsLayer.addForce(force);\\n    \\n" +
"    console.log(\\\\\\`Applied force of ${magnitude} to actor in direction [${normDir.x.toFixed(2)}, ${normDir.y.toFixed(2)}, ${normDir.z.toFixed(2)}]\\\\\\`);\\n    \\n" +
"    this.ExecOut();\\n" +
"  }\\n\\n" +
"  public ExecOut() {\\n" +
"    // Output execution pin\\n" +
"  }\\n" +
"}\\n`\n" +
"        });";

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/AIChat.tsx', code);
