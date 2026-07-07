const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importsToAdd = `
const TerrainImportUtility = React.lazy(() => import("./components/TerrainImportUtility"));
`;
code = code.replace('const TerrainGenerator = React.lazy(() => import("./components/TerrainGenerator"));', importsToAdd + 'const TerrainGenerator = React.lazy(() => import("./components/TerrainGenerator"));');

// Add to tools
const toolsToAdd = `
    { id: "TerrainImportUtility", title: "Terrain Importer", icon: <Map size={16} /> },
`;
code = code.replace(/const tools = \[/, `const tools = [\n${toolsToAdd}`);

// Add to switch case
const switchCasesToAdd = `
      case "TerrainImportUtility":
        content = <TerrainImportUtility />;
        break;
`;
code = code.replace(/case "TerrainGenerator":/, switchCasesToAdd + '      case "TerrainGenerator":');

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx modified successfully.');
