/**
 * ============================================================================
 * LanguageCompletionProvider.ts (ระบบจัดเตรียมโค้ดเติมเต็มอัตโนมัติตามภาษา)
 * ============================================================================
 * 
 * [TH] วัตถุประสงค์และหน้าที่:
 * โมดูลนี้ทำหน้าที่สร้างและลงทะเบียน Code Completion (IntelliSense), Snippets, Keywords,
 * และ API Suggestions ประจำแต่ละภาษาโปรแกรม (20+ ภาษา) ให้กับ Monaco Editor และระบบ IDE:
 * 1. Language-Specific Keywords & Primitive Types
 * 2. Structural Code Snippets (Functions, Classes, Structs, Loops, Conditionals, Shaders)
 * 3. Standard Library & Game Engine API Autocomplete (Vector3, Raytracing, Math, Collections)
 * 4. Monaco CompletionItemProvider Registration & Dynamic Lifecycle Management
 * 5. Offline Autocomplete Fallback & Quick Suggestion Search
 * 
 * [EN] Purpose & Responsibilities:
 * Comprehensive, multi-language code completion and snippet provider for the IDE.
 * Dynamically delivers context-aware autocomplete items, function templates, type hints,
 * and engine APIs to Monaco Editor based on the automatically detected programming language.
 * 
 * Inputs:
 * - languageId: string (e.g. 'typescript', 'python', 'rust', 'cpp', 'glsl', 'sql', 'lua')
 * - monacoInstance: Monaco API reference for registering CompletionItemProviders
 * 
 * Outputs:
 * - Disposable provider handles and array of LanguageCompletionItem with insertText, documentation,
 *   detail, kind, and snippet parameters.
 * 
 * ============================================================================
 */

export interface LanguageCompletionItem {
  label: string;
  kind: 'Function' | 'Snippet' | 'Keyword' | 'Variable' | 'Class' | 'Interface' | 'Property' | 'Enum' | 'Struct' | 'Module';
  detail: string;
  documentation: string;
  insertText: string;
  insertTextRules?: number; // 4 = InsertAsSnippet in Monaco
  sortText?: string;
}

/**
 * Rich database of language-specific completions, snippets, and standard APIs
 */
export const LANGUAGE_COMPLETIONS: Record<string, LanguageCompletionItem[]> = {
  typescript: [
    {
      label: 'interface',
      kind: 'Snippet',
      detail: 'TypeScript Interface Definition',
      documentation: 'Declare a new structured TypeScript object type/interface.',
      insertText: 'interface ${1:InterfaceName} {\n\t${2:id}: ${3:string};\n\t${0}\n}'
    },
    {
      label: 'type',
      kind: 'Snippet',
      detail: 'TypeScript Type Alias',
      documentation: 'Create a custom type alias or union type.',
      insertText: 'type ${1:TypeName} = ${2:string | number};\n${0}'
    },
    {
      label: 'class_component',
      kind: 'Snippet',
      detail: 'Engine Component Class',
      documentation: 'Create a game engine lifecycle component with update and init methods.',
      insertText: 'export class ${1:PlayerController} extends Component {\n\tprivate ${2:speed}: number = ${3:10.0};\n\n\tpublic override onInit(): void {\n\t\t${0}\n\t}\n\n\tpublic override onUpdate(deltaTime: number): void {\n\t\t\n\t}\n}'
    },
    {
      label: 'async_function',
      kind: 'Snippet',
      detail: 'Async/Await Function',
      documentation: 'Create an asynchronous function returning a typed Promise.',
      insertText: 'export async function ${1:fetchGameAsset}(${2:assetId}: string): Promise<${3:GameAsset}> {\n\t${0}\n}'
    },
    {
      label: 'Vector3',
      kind: 'Class',
      detail: 'NexusEngine.Math.Vector3',
      documentation: '3D spatial coordinate representation (x, y, z).',
      insertText: 'new Vector3(${1:0}, ${2:0}, ${3:0})'
    },
    {
      label: 'EventDispatcher',
      kind: 'Module',
      detail: 'NexusEngine.Events.EventDispatcher',
      documentation: 'Publish/subscribe event bus for engine sub-systems.',
      insertText: 'EventDispatcher.dispatch("${1:PLAYER_ACTION}", { ${2:data} });'
    },
    {
      label: 'enum',
      kind: 'Keyword',
      detail: 'TypeScript Enum Declaration',
      documentation: 'Define named constant enumerations.',
      insertText: 'enum ${1:GameState} {\n\t${2:IDLE} = 0,\n\t${3:RUNNING} = 1,\n\t${4:PAUSED} = 2,\n\t${0}\n}'
    }
  ],
  javascript: [
    {
      label: 'function',
      kind: 'Snippet',
      detail: 'JavaScript Function Declaration',
      documentation: 'Standard function declaration.',
      insertText: 'function ${1:calculateMetric}(${2:params}) {\n\t${0}\n\treturn ${3:result};\n}'
    },
    {
      label: 'arrow_function',
      kind: 'Snippet',
      detail: 'Arrow Function Expression',
      documentation: 'Modern ES6+ arrow function syntax.',
      insertText: 'const ${1:processData} = (${2:input}) => {\n\t${0}\n};'
    },
    {
      label: 'try_catch',
      kind: 'Snippet',
      detail: 'Exception Handling Block',
      documentation: 'Wrap statements in a try-catch-finally block.',
      insertText: 'try {\n\t${1:// dangerous operation}\n} catch (error) {\n\tconsole.error("${2:Execution failed:}", error);\n\t${0}\n}'
    },
    {
      label: 'console.log',
      kind: 'Function',
      detail: 'Console Logging Output',
      documentation: 'Print output to developer tools console.',
      insertText: 'console.log("${1:Label:}", ${2:value});'
    },
    {
      label: 'fetch',
      kind: 'Function',
      detail: 'Browser Fetch API',
      documentation: 'Execute HTTP network request.',
      insertText: 'const response = await fetch("${1:https://api.example.com/data}");\nconst data = await response.json();\n${0}'
    }
  ],
  python: [
    {
      label: 'def',
      kind: 'Snippet',
      detail: 'Python Function Definition',
      documentation: 'Define a typed Python function with docstring.',
      insertText: 'def ${1:compute_path}(${2:start}: Tuple[int, int], ${3:goal}: Tuple[int, int]) -> ${4:List[Tuple[int, int]]}:\n\t"""${5:Calculate shortest path across grid.}"""\n\t${0}\n\treturn []'
    },
    {
      label: 'class',
      kind: 'Snippet',
      detail: 'Python Class Definition',
      documentation: 'Define a Python class with __init__ constructor.',
      insertText: 'class ${1:NeuralAgent}:\n\tdef __init__(self, ${2:state_dim}: int = 128):\n\t\tself.${2:state_dim} = ${2:state_dim}\n\t\t${0}\n\n\tdef forward(self, x):\n\t\tpass'
    },
    {
      label: 'if_main',
      kind: 'Snippet',
      detail: 'Main Entry Point Guard',
      documentation: 'Standard Python script entry point block.',
      insertText: 'if __name__ == "__main__":\n\t${1:print("Script running...")}\n\t${0}'
    },
    {
      label: 'with_open',
      kind: 'Snippet',
      detail: 'Context Managed File I/O',
      documentation: 'Safely open and read/write file streams.',
      insertText: 'with open("${1:data.json}", "${2:r}", encoding="utf-8") as f:\n\t${3:content = f.read()}\n\t${0}'
    },
    {
      label: 'list_comprehension',
      kind: 'Snippet',
      detail: 'Python List Comprehension',
      documentation: 'Concise inline list generation and filtering.',
      insertText: '[${1:x * 2} for ${2:x} in ${3:items} if ${4:x > 0}]'
    },
    {
      label: 'import_numpy_torch',
      kind: 'Snippet',
      detail: 'Data Science & ML Imports',
      documentation: 'Standard imports for scientific computation.',
      insertText: 'import numpy as np\nimport torch\nimport torch.nn as nn\n${0}'
    }
  ],
  rust: [
    {
      label: 'fn',
      kind: 'Snippet',
      detail: 'Rust Function Definition',
      documentation: 'Declare a typed Rust function.',
      insertText: 'pub fn ${1:query_spatial_index}(&self, ${2:point}: Vector3) -> ${3:Option<&Entity>} {\n\t${0}\n\tNone\n}'
    },
    {
      label: 'struct_impl',
      kind: 'Snippet',
      detail: 'Rust Struct & Implementation Block',
      documentation: 'Declare a struct along with its method implementation.',
      insertText: '#[derive(Debug, Clone)]\npub struct ${1:OctreeNode}<T> {\n\tpub ${2:bounds}: AABB,\n\tpub ${3:elements}: Vec<T>,\n}\n\nimpl<T> ${1:OctreeNode}<T> {\n\tpub fn new(${2:bounds}: AABB) -> Self {\n\t\tSelf {\n\t\t\t${2:bounds},\n\t\t\t${3:elements}: Vec::new(),\n\t\t}\n\t}\n\t${0}\n}'
    },
    {
      label: 'match',
      kind: 'Snippet',
      detail: 'Pattern Matching Expression',
      documentation: 'Exhaustive Rust pattern match over Enums/Results/Options.',
      insertText: 'match ${1:result} {\n\tOk(${2:val}) => {\n\t\t${3:println!("Success: {:?}", val);}\n\t}\n\tErr(${4:err}) => {\n\t\teprintln!("Error: {}", err);\n\t}\n}'
    },
    {
      label: 'println!',
      kind: 'Function',
      detail: 'Rust Println Macro',
      documentation: 'Standard formatting print macro to stdout.',
      insertText: 'println!("${1:Status: {\\:#?}}", ${2:data});'
    },
    {
      label: 'trait_definition',
      kind: 'Snippet',
      detail: 'Rust Trait Declaration',
      documentation: 'Define a shared behavior trait.',
      insertText: 'pub trait ${1:SpatialQueryable} {\n\tfn get_bounding_box(&self) -> AABB;\n\tfn is_intersecting(&self, ray: &Ray) -> bool;\n}'
    }
  ],
  cpp: [
    {
      label: 'class',
      kind: 'Snippet',
      detail: 'C++ Class Definition',
      documentation: 'Declare a C++ class with constructor and destructor.',
      insertText: 'class ${1:RenderPipeline} {\nprivate:\n\t${2:int m_width;}\n\t${3:int m_height;}\n\npublic:\n\t${1:RenderPipeline}(int w, int h) : m_width(w), m_height(h) {}\n\tvirtual ~${1:RenderPipeline}() = default;\n\n\tvoid execute() {\n\t\t${0}\n\t}\n};'
    },
    {
      label: 'template_function',
      kind: 'Snippet',
      detail: 'C++ Template Function',
      documentation: 'Generic templated algorithm definition.',
      insertText: 'template <typename T>\nT ${1:clamp}(const T& val, const T& minVal, const T& maxVal) {\n\treturn (val < minVal) ? minVal : ((val > maxVal) ? maxVal : val);\n}'
    },
    {
      label: '#include',
      kind: 'Keyword',
      detail: 'Preprocessor Include Directive',
      documentation: 'Include standard or external header library.',
      insertText: '#include <${1:iostream}>\n#include <${2:vector}>\n#include <${3:memory}>\n${0}'
    },
    {
      label: 'std::cout',
      kind: 'Function',
      detail: 'Standard Stream Output',
      documentation: 'Print message to standard console stream.',
      insertText: 'std::cout << "[${1:ENGINE}] " << ${2:"Log output"} << std::endl;'
    },
    {
      label: 'shared_ptr',
      kind: 'Snippet',
      detail: 'std::make_shared Smart Pointer',
      documentation: 'Allocate heap memory managed via shared reference count.',
      insertText: 'auto ${1:instance} = std::make_shared<${2:SceneNode}>(${3:args});'
    }
  ],
  csharp: [
    {
      label: 'monobehaviour',
      kind: 'Snippet',
      detail: 'Unity MonoBehaviour Script',
      documentation: 'Standard Unity component class with Awake, Start, Update.',
      insertText: 'using UnityEngine;\n\npublic class ${1:PlayerMovement} : MonoBehaviour {\n\t[SerializeField] private float speed = 5.0f;\n\n\tprivate void Start() {\n\t\t${0}\n\t}\n\n\tprivate void Update() {\n\t\tfloat h = Input.GetAxis("Horizontal");\n\t\tfloat v = Input.GetAxis("Vertical");\n\t\ttransform.Translate(new Vector3(h, 0, v) * (speed * Time.deltaTime));\n\t}\n}'
    },
    {
      label: 'async_task',
      kind: 'Snippet',
      detail: 'C# Async Task Method',
      documentation: 'Asynchronous method utilizing Task and cancellation tokens.',
      insertText: 'public async Task<${1:SaveData}> ${2:LoadGameSaveAsync}(string ${3:saveSlot}) {\n\t${0}\n\tawait Task.Delay(100);\n\treturn new ${1:SaveData}();\n}'
    },
    {
      label: 'property',
      kind: 'Snippet',
      detail: 'Auto-Implemented Property',
      documentation: 'Declare getter and setter encapsulation.',
      insertText: 'public ${1:int} ${2:Health} { get; set; } = ${3:100};'
    }
  ],
  glsl: [
    {
      label: 'shader_header',
      kind: 'Snippet',
      detail: 'GLSL Vertex/Fragment Header',
      documentation: 'Standard GLSL 330/450 core shader header.',
      insertText: '#version 330 core\nprecision highp float;\n\nin vec2 ${1:vUV};\nout vec4 ${2:FragColor};\n\nuniform sampler2D ${3:uMainTexture};\nuniform vec3 ${4:uLightDirection};\n\nvoid main() {\n\tvec4 texColor = texture(${3:uMainTexture}, ${1:vUV});\n\t${2:FragColor} = texColor;\n\t${0}\n}'
    },
    {
      label: 'raymarch_loop',
      kind: 'Snippet',
      detail: 'Volumetric Raymarching Loop',
      documentation: 'Fixed-step 3D volumetric density sampling loop.',
      insertText: 'float density = 0.0;\nvec3 rayPos = ${1:rayOrigin};\nfor (int i = 0; i < ${2:32}; ++i) {\n\tdensity += ${3:sampleNoise(rayPos)} * 0.03125;\n\trayPos += ${4:rayDir} * ${5:stepSize};\n}\n${0}'
    },
    {
      label: 'uniform_mat4',
      kind: 'Keyword',
      detail: 'Uniform Transformation Matrix',
      documentation: 'Matrix uniform passed from host renderer.',
      insertText: 'uniform mat4 ${1:uModelViewProjection};'
    }
  ],
  sql: [
    {
      label: 'create_table',
      kind: 'Snippet',
      detail: 'SQL CREATE TABLE Statement',
      documentation: 'Define relational table schema with primary key and timestamps.',
      insertText: 'CREATE TABLE IF NOT EXISTS ${1:player_profiles} (\n\t${2:id} UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n\t${3:username} VARCHAR(64) NOT NULL UNIQUE,\n\t${4:level} INTEGER NOT NULL DEFAULT 1,\n\t${5:created_at} TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_${1:player_profiles}_${3:username} ON ${1:player_profiles}(${3:username});'
    },
    {
      label: 'select_join',
      kind: 'Snippet',
      detail: 'SQL SELECT with INNER JOIN',
      documentation: 'Query multiple tables joined on foreign keys.',
      insertText: 'SELECT ${1:p.username}, ${2:i.item_name}, ${3:i.quantity}\nFROM ${4:player_profiles} p\nINNER JOIN ${5:player_inventory} i ON p.id = i.player_id\nWHERE p.${6:level} >= ${7:10}\nORDER BY p.${8:level} DESC\nLIMIT ${9:50};'
    },
    {
      label: 'insert_into',
      kind: 'Snippet',
      detail: 'SQL INSERT INTO Statement',
      documentation: 'Insert records into target table.',
      insertText: 'INSERT INTO ${1:game_save_states} (${2:player_id, scene_name, save_payload})\nVALUES (${3:\'player_001\', \'Forest_Zone\', \'{}\'});'
    }
  ],
  lua: [
    {
      label: 'function',
      kind: 'Snippet',
      detail: 'Lua Function Block',
      documentation: 'Standard Lua function declaration.',
      insertText: 'local function ${1:calculateDamage}(${2:attacker, target})\n\tlocal ${3:baseDamage} = ${4:25}\n\t${0}\n\treturn ${3:baseDamage}\nend'
    },
    {
      label: 'module_class',
      kind: 'Snippet',
      detail: 'Lua OOP Module Table',
      documentation: 'Create a Metatable-based class module in Lua.',
      insertText: 'local ${1:ItemManager} = {}\n${1:ItemManager}.__index = ${1:ItemManager}\n\nfunction ${1:ItemManager}.new()\n\tlocal self = setmetatable({}, ${1:ItemManager})\n\tself.items = {}\n\treturn self\nend\n\nfunction ${1:ItemManager}:addItem(item)\n\ttable.insert(self.items, item)\nend\n\nreturn ${1:ItemManager}'
    }
  ],
  dockerfile: [
    {
      label: 'multi_stage_build',
      kind: 'Snippet',
      detail: 'Multi-Stage Dockerfile',
      documentation: 'Optimized production multi-stage container build.',
      insertText: 'FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 3000\nCMD ["nginx", "-g", "daemon off;"]'
    }
  ],
  json: [
    {
      label: 'package_json',
      kind: 'Snippet',
      detail: 'Package.json Template',
      documentation: 'Node.js project manifest template.',
      insertText: '{\n\t"name": "${1:game-project}",\n\t"version": "${2:1.0.0}",\n\t"scripts": {\n\t\t"dev": "vite",\n\t\t"build": "vite build"\n\t}\n}'
    }
  ],
  html: [
    {
      label: 'html5_template',
      kind: 'Snippet',
      detail: 'HTML5 Starter Boilerplate',
      documentation: 'Standard HTML5 layout structure.',
      insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Game Canvas}</title>\n</head>\n<body>\n\t<div id="root">\n\t\t${0}\n\t</div>\n</body>\n</html>'
    }
  ],
  css: [
    {
      label: 'flex_center',
      kind: 'Snippet',
      detail: 'Flexbox Center Utilities',
      documentation: 'Center child elements both horizontally and vertically.',
      insertText: 'display: flex;\nalign-items: center;\njustify-content: center;'
    },
    {
      label: 'grid_responsive',
      kind: 'Snippet',
      detail: 'CSS Responsive Grid',
      documentation: 'Auto-fill CSS grid layout.',
      insertText: 'display: grid;\ngrid-template-columns: repeat(auto-fill, minmax(${1:280px}, 1fr));\ngap: ${2:16px};'
    }
  ]
};

// Track registered Monaco completion providers to prevent duplicate leak
const registeredProviders = new Map<string, any>();

export class LanguageCompletionProvider {
  /**
   * Get completion items for a specific language
   */
  public static getCompletions(languageId: string): LanguageCompletionItem[] {
    const list = LANGUAGE_COMPLETIONS[languageId.toLowerCase()] || [];
    // If not found, check if it's an alias (e.g. tsx -> typescript, jsx -> javascript)
    if (list.length === 0) {
      if (['tsx', 'mts', 'cts'].includes(languageId)) return LANGUAGE_COMPLETIONS.typescript || [];
      if (['jsx', 'mjs', 'cjs'].includes(languageId)) return LANGUAGE_COMPLETIONS.javascript || [];
      if (['cxx', 'cc', 'hpp'].includes(languageId)) return LANGUAGE_COMPLETIONS.cpp || [];
      if (['frag', 'vert', 'hlsl'].includes(languageId)) return LANGUAGE_COMPLETIONS.glsl || [];
      if (['psql', 'mysql'].includes(languageId)) return LANGUAGE_COMPLETIONS.sql || [];
    }
    return list;
  }

  /**
   * Register Monaco Completion Item Provider for dynamic autocompletion.
   * If monacoLanguageId is omitted or 'all', registers providers for all supported languages.
   */
  public static registerWithMonaco(monaco: any, monacoLanguageId?: string, customItems: LanguageCompletionItem[] = []): void {
    if (!monaco || !monaco.languages || !monaco.languages.registerCompletionItemProvider) {
      return;
    }

    if (!monacoLanguageId || monacoLanguageId === 'all') {
      // Register all languages in database
      Object.keys(LANGUAGE_COMPLETIONS).forEach(langKey => {
        this.registerWithMonaco(monaco, langKey);
      });
      return;
    }

    const providerKey = `provider_${monacoLanguageId}`;
    // Dispose previous provider for this language to allow hot-reloading
    if (registeredProviders.has(providerKey)) {
      try {
        registeredProviders.get(providerKey).dispose();
      } catch (e) {
        // ignore
      }
    }

    const standardItems = this.getCompletions(monacoLanguageId);
    const allItems = [...standardItems, ...customItems];

    if (allItems.length === 0) return;

    const disposable = monaco.languages.registerCompletionItemProvider(monacoLanguageId, {
      triggerCharacters: ['.', ':', '<', '"', '/', '#', '$', '@', ' '],
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = allItems.map(item => {
          let kind = monaco.languages.CompletionItemKind.Snippet;
          if (item.kind === 'Function') kind = monaco.languages.CompletionItemKind.Function;
          else if (item.kind === 'Keyword') kind = monaco.languages.CompletionItemKind.Keyword;
          else if (item.kind === 'Class') kind = monaco.languages.CompletionItemKind.Class;
          else if (item.kind === 'Interface') kind = monaco.languages.CompletionItemKind.Interface;
          else if (item.kind === 'Variable') kind = monaco.languages.CompletionItemKind.Variable;
          else if (item.kind === 'Module') kind = monaco.languages.CompletionItemKind.Module;

          return {
            label: item.label,
            kind,
            documentation: {
              value: `**${item.detail}**\n\n${item.documentation}`
            },
            detail: item.detail,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          };
        });

        return { suggestions };
      }
    });

    registeredProviders.set(providerKey, disposable);
  }
}
