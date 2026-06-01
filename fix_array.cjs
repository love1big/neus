const fs = require('fs');
let code = fs.readFileSync('src/lib/Ultimate100Systems.ts', 'utf8');

// The items are formatted like:
//   "**Name**
// description
// ",
// We just need to replace double quotes that enclose these strings with backticks.
// But some descriptions might contain backticks? Let's check.

// An easy way is to replace `  "` with `  \`` and `\n",` with `\n\`,`.
code = code.replace(/^  "/gm, '  `');
code = code.replace(/\n",/g, '\n`,');

fs.writeFileSync('src/lib/Ultimate100Systems.ts', code);
console.log("Fixed array formatting.");
