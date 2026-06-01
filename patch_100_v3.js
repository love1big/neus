const fs = require('fs');

const categories = [
  {
    name: "1. Core & Architecture (สถาปัตยกรรมหลัก)",
    items: [
      "Quantum Code Compiler: คอมไพล์โค้ดในเสี้ยววินาทีด้วยอัลกอริทึมคู่ขนานระดับควอนตัม",
      "Time-Travel Debugger: ระบบบันทึกและย้อนเวลาดูสถานะของ Memory และตัวแปรทุกตัวในอดีตได้",
      "Polyglot Scripting: เขียนหลายภาษา (C++, Rust, TS, Python) ในไฟล์เดียวกันและคุยกันได้ไร้รอยต่อ",
      "Dynamic Memory Predictor: AI คาดเดาและจอง Memory ล่วงหน้า ป้องกันคอขวด 100%",
      "Cloud-Native Distributed Engine: ประมวลผลเกมข้ามเซิร์ฟเวอร์แบบไร้เซิร์ฟเวอร์หลัก",
      "Zero-Crash Fallback: เมื่อระบบล่ม AI จะ Bypass ไปใช้ Cache ล่าสุดชั่วคราว ไม่ทำให้เกมดับ",
      "Hyper-Threading Node Editor: ระบบ Node แบบ Multi-thread ทำงานคู่ขนานกันจริงในระดับ CPU",
      "Microservice Game Modules: ตัวเกมถูกแบ่งเป็นส่วนย่อย อัพเดทระบบย่อยได้โดยไม่ต้องปิดเกม",
      "Data-Oriented Blueprint: ระบบ Blueprint แบบใหม่ที่คอมไพล์ลง ECS (Entity Component System) อัตโนมัติ",
      "Holographic Engine Supervisor: โหมดดูสถานะของ Engine ทั้งหมดในรูปแบบ 3D Map"
    ]
  },
  {
    name: "2. Artificial Intelligence (ระบบปัญญาประดิษฐ์)",
    items: [
      "LLM-Driven NPC Brain: NPC ที่มีสมองและความจำเสมือนมนุษย์ ตัดสินใจเองตามอารมณ์และเป้าหมาย",
      "Generative 3D Asset Bot: พิมพ์บรรยาย หรือสเก็ตช์ภาพ AI จะสร้างโมเดล 3D พร้อม Rigging ทันทึ",
      "Auto-Code Fixer/Optimizer: AI ที่คอยแนะนำและแก้โค้ดของคุณให้เร็วและประหยัดทรัพยากรที่สุด",
      "Dynamic Quest Generation: AI เขียนเควสต์ใหม่ไม่ซ้ำกันตามการกระทำของผู้เล่นในอดีต",
      "Voice-to-Game Command: สั่งสร้างฉาก สร้างตัวละครด้วยเสียงพูดขณะอยู่ในโหมด VR",
      "Self-Trained Enemy AI: บอสที่เรียนรู้วิธีการต่อสู้ของผู้เล่น และพัฒนากลยุทธ์เพื่อชนะเราตลอดเวลา",
      "Procedural Lore Master: AI ที่แต่งประวัติศาสตร์ โลก และแผนผังความสัมพันธ์ตัวละครให้ทั้งเกม",
      "Real-time Animation Synthesizer: ไม่ต้องพึ่ง Animation File แค่สั่งว่าวิ่งเจ็บขา AI จะคำนวณท่าทันที",
      "Code Telepathy: AI ศึกษาแพทเทิร์นการเขียนโค้ดของคุณและเขียนฟังก์ชันล่วงหน้าก่อนคุณจะพิมพ์เสร็จ",
      "QA Agent Bot: บอททดสอบเกม 10,000 ตัวที่จะวิ่งหญ้า ตีทุกกำแพง เพื่อหาบัคและ Memory Leak"
    ]
  },
  {
    name: "3. Rendering & Graphics (กราฟิกและการเรนเดอร์)",
    items: [
      "Path-Tracing 2.0 (Real-time): สะท้อนแสงและเงาแบบความละเอียดทะลุขีดจำกัด ไม่ต้อง Bake",
      "Quantum Subsurface Scattering: แสงทะลุผ่านผิวหนังและชั้นเนื้อได้อย่างสมจริงระดับภาพยนตร์",
      "Navier-Stokes Volumetric Fluids: เมฆ ควัน พายุ และไฟ ที่คำนวณตามหลักมวลอากาศจริง",
      "Nanite-Equivalent Infinite Micro-Poly: ไม่ว่าจะนำเข้าโมเดลพันล้าน Polygon ก็รันได้ที่ 120FPS",
      "Real-time Erosion & Weathering: พื้นผิวที่มีการเปลี่ยนแปลง ผุกร่อน ตามเวลาและภูมิอากาศจริง",
      "Holographic Display Support: รองรับหน้าจอแบบ 3D Hologram โดยไม่ต้องใส่แว่น",
      "Dynamic Global Illumination (DGI) - Zero Leak: แสงสะท้อนที่ไม่ทะลุกำแพงแบบสมบูรณ์",
      "Bio-luminescence Engine: ระบบจัดการแสงเรืองรองทางชีวภาพ (พืช, สัตว์) ที่กระเพื่อมตามชีพจร",
      "Fluid Dynamics Water Rendering: คลื่นทะเล มหาสมุทร และน้ำตก ที่มีมวลสารรับแรงสะท้อน",
      "Vector-based Texture Streaming: เทกซ์เจอร์คมชัดเสมอแม้ซูมระดับไมโครเมตร"
    ]
  },
  {
    name: "4. Physics & Simulation (ระบบฟิสิกส์และการจำลอง)",
    items: [
      "Bio-Mechanical Muscle IK: การยืดหดของก้อนกล้ามเนื้อและการสั่นกระเพื่อมของไขมัน",
      "Molecular Fracture System: ระบบวัตถุแตกหักที่รอยแตกเกิดตามโครงสร้างโลหะหรือเนื้อไม้จริง",
      "Thermodynamic Engine: จำลองการกระจายความร้อน ความเย็น และการละลาย/แข็งตัวของสสาร",
      "Soft-Body & Cloth Physics 3.0: เนื้อผ้าและเนื้อเยื่อที่ย่น ขาด ยืดหยุ่น อิงตามแรงโน้มถ่วงและแรงลม",
      "Celestial Gravity Simulation: คำนวณแรงดึงดูดของดวงดาวและวงโคจร รวมถึงผลกระทบต่อน้ำขึ้นน้ำลง",
      "Granular Physics Engine: ทราย หิมะ ดินหลวม ที่ไถลกลิ้ง ถล่ม ตามน้ำหนักที่มากดทับลงไป",
      "Aerodynamics & Wind Vector: แรงเสียดทานอากาศสำหรับการบิน เหาะ หรือใช้ร่มชูชีพที่แม่นยำสูง",
      "Fluid-Rigid Coupling: วัตถุแข็งลอยน้ำ หรือถูกคลื่นซัดได้ตามปริมาตรน้ำและการแทนที่",
      "Magnetism & Electricity: สนามแม่เหล็ก การเหนี่ยวนำ และการเดินไฟฟ้าผ่านวัตถุต่างๆ นำไฟฟ้า",
      "Sound Wave Physics: คลื่นเสียงที่สะท้อนกำแพง ถูดดูดซับตามวัสดุ จนกลายเป็นเสียง Echo จริงๆ"
    ]
  },
  {
    name: "5. Multi-Player & Network (ระบบเครือข่ายและผู้เล่นหลายคน)",
    items: [
      "Zero-Ping Predictive Netcode: AI เดาอินพุตล่วงหน้า หากปิงสูง ผู้เล่นจะไม่รู้สึกถึงความเหลื่อม",
      "Edge-Server Mesh: เซิร์ฟเวอร์ที่อยู่ใกล้ผู้เล่นที่สุดจะคำนวณ แล้วซิงค์กันเองระหว่างภูมิภาค",
      "Infinite Single-Shard Universe: รองรับผู้เล่น 1 ล้านคนในแผนที่เดียวแบบไม่แบ่งโซนหรือโหลดฉาก",
      "Cross-Platform Deterministic Engine: มือถือ พีซี และคอนโซล คำนวณฟิสิกส์ได้ผลลัพธ์ตรงกัน 100%",
      "Seamless Server Handover: เปลี่ยนเครื่องเซิร์ฟเวอร์ขณะเดินข้ามโซนโดยไม่หน่วง",
      "Web3 / Blockchain Native Integration: ฝังระบบ Economy, NFT, Smart Contract แบบไม่ต้องพึ่งปลั๊กอิน",
      "Anti-Cheat Quantum AI: ตรวจจับ Aimbot และ Wallhack ด้วยการวิเคราะห์พฤติกรรมการขยับเมาส์ระดับมิลลิวินาที",
      "In-game VoIP with Spatial & Occlusion: เสียงพูดผู้เล่นสะท้อนตามกำแพงและโดนบังเสียงได้",
      "Dynamic Instance Scaling: เสกดันเจี้ยนหรือแผนที่ใหม่ทันทีที่คนเยอะเกิน และลดเมื่อคนน้อย",
      "Real-time Database Streaming: บันทึกของตก แผงลอย บ้านผู้เล่นแบบ Persistent ทันทีไม่ต้องเซพ"
    ]
  },
  {
    name: "6. World Building & Level Design (การสร้างโลกและฉาก)",
    items: [
      "Prompt-to-World Generation: พิมพ์คำว่า 'เมืองไซเบอร์พังก์ตอนฝนตก' โปรแกรมจะเสกฉากให้เสร็จ",
      "Real-Time Geo-Simulation: ลากเมาส์ดันภูเขา สร้างแม่น้ำ แล้วเกมจะสร้างระบบนิเวศครอบอัตโนมัติ",
      "Procedural Biome Painter: แปรงปัดต้นไม้ ดอกไม้ หิน ที่จัดวางสเกลตามหลักชีววิทยาของพื้นที่",
      "City Traffic & Zoning Simulator: ลากผังเมือง แล้ว AI จะเสกถนน ไฟเลี้ยว รถวิ่ง ให้เหมือนเมืองจริง",
      "Semantic Scene Understanding: เกมรู้ว่านี่คือ 'ห้องครัว' มันเลยเอาของมีด ตู้เย็น มาใส่ให้อัตโนมัติ",
      "Dynamic Day/Night & Seasons: ฤดูกาลเปลี่ยนแปลง ส่งผลต่อหิมะ ต้นไม้ผลัดใบ แบบ 1440 องศา",
      "Voxel-based Underground Terrain: ขุดและทำลายดินแบบอิสระ ทำถ้ำ ทรงโค้งได้อย่างสมจริง",
      "Level Design AI Assistant: AI ช่วยเตือนภัยว่า 'มุมนี้ผู้เล่นอาจหลงทาง' หรือ 'จุดซุ่มยิงนี้โกงเกินไป'",
      "Infinite Universe Generator: สร้างดาวเคราะห์แบบ Procedural ขนาด 1:1 แบบไร้ที่สิ้นสุด",
      "Architectural Blueprint Importer: ดึงไฟล์ CAD/BIM สร้างฉากพร้อม Collison และ Material แบบสมบูรณ์"
    ]
  },
  {
    name: "7. Scripting & Programming (การเขียนโปรแกรม)",
    items: [
      "Visual-to-Code Realtime Sync: ลาก Node ปุ๊บ โค้ดโผล่ พิมพ์โค้ดปุ๊บ ขยับ Node กลับไปกลับมาได้",
      "Natural Language Coding: พิมพ์ 'ทำให้กระโดดซ้อนได้ 2 ครั้ง' แล้วมันแปลงเป็นโค้ดบรรทัดให้เลย",
      "Visual Math Debugger: เห็นตัวเลข Vector, Matrix ขยับเปลี่ยนค่าแบบสดๆ ในหน้าต่างเกมเลย",
      "Universal API Connector: ดึง API จากเว็บข้างนอก (เช่น สภาพอากาศหุ้น) เข้าเกมแค่คลิกขวา",
      "Code Ecosystem Map: ดูภาพรวมพึ่งพาของโค้ด (Dependencies) ว่าตัวไหนเรียกใช้ตัวไหน เป็นกราฟ 3D",
      "Auto-Refactoring Engine: กดปุ่มเดียว มันเปลี่ยนโค้ดพันกันยุ่งๆ ให้คลีนและเร็วกว่าเดิม 10 เท่า",
      "Live Inject Scripting: พิมพ์โค้ดเพิ่มขณะเกมทำงานโดยไม่ต้องรีสตาร์ท และเอฟเฟครันต่อทันที",
      "Memory Leak Heatmap: กราฟิกแจ้งเตือนว่าบรรทัดไหนกิน RAM ทะลุหลอด ด้วยสีแดงส้ม",
      "AI Code Guardian: ไม่ยอมให้คอมไพล์ถ้าพบว่ามีพฤติกรรมโค้ดที่จะทำให้เกิดการเจาะระบบ (Exploit)",
      "Multi-monitor Code Space: กระจายหน้าต่าง Editor ตามอุปกรณ์รอบตัว เช่น รันเกมด้วย iPad เขียนโค้ดด้วย Mac"
    ]
  },
  {
    name: "8. Audio, SFX & Music (ระบบเสียงและเพลง)",
    items: [
      "Ray-Traced Audio: คำนวณเสียงที่สะท้อนทะลุกำแพงตามความหนาของวัสดุ",
      "AI Voice Actor: สร้างเสียงพากย์ 1,000 ตัวละครที่สำเนียงและอารมณ์ไม่ซ้ำกันจากข้อความ (Offline)",
      "Dynamic Music Synthesizer: เพลงประกอบแปรผันตามอารมณ์ ชีพจรบอส และจังหวะที่ผู้เล่นกำลังทำสำเร็จ",
      "Foley Generation AI: แค่วางโมเดลขวดตกพื้น AI สร้างเสียงเพล้ง ให้ตรงกับความแข็งพื้นและแก้วเป๊ะๆ",
      "Dolby Atmos / Spatial Engine: ระบบจัดตำแหน่งเสียง 3D ขั้นสูงสุด รองรับหูฟังทั่วไปด้วย HRTF",
      "Microphone Gameplay Integration: ผู้เล่นเป่าไมค์หรือพูดให้ NPC ได้ยิน แล้วตัวเกม Process เข้า Logic",
      "Audio-Driven Animation: ปากของตัวละครขยับ (Lip-sync) ตามรูปสระของไฟล์เสียงได้ 100% ทุกภาษา",
      "Adaptive Ambience: เสียงจิ้งหรีด ลมพัด เปลี่ยนแปลงถ้าฝนใกล้ตก หรือมีภัยร้ายเดินใกล้เข้ามา",
      "Vintage Audio Filter: ทำเสียงแบบ 8-bit, วิทยุเก่า, หรือ VHS Tape ได้ทันทีแบบไม่ต้องใช้ปลั๊กอิน",
      "Auto Mix & Mastering: AI ลดเสียงปืนลง 3dB ชั่วคราวเวลาตัวละครคุยกัน เพื่อไม่ให้หูดับ (Ducking)"
    ]
  },
  {
    name: "9. UI/UX & Developer Workflow (ส่วนติดต่อและกระบวนการทำงาน)",
    items: [
      "Mind-Mapping Editor UI: กระดานปักหมุดโค้ด รูปภาพ เนื้อเรื่อง โยงเส้นได้คล้าย Miro แต่รันเกมได้",
      "VR Workspace Studio: ใส่แว่น VR ยืนปั้นโมเดล และลากประกอบฉากด้วยมือเปล่า (Hand-tracking)",
      "Neural Brain-Computer Interface (BCI): รองรับในอนาคต สั่งคอมไพล์หรือขยับกล้องด้วยคลื่นสมอง!",
      "Eye-Tracking UI Focus: เมนูโผล่ขึ้นมาตามจุดที่เรามอง และเบลอจุดอื่นที่ไม่สนใจออก",
      "Customizable Editor Themes 3.0: ปรับฟอนต์ สี แอนิเมชัน หน้าเวิร์กสเปซของเครื่องมือได้ละเอียดทุกพิกเซล",
      "Co-op Live Editing: เพื่อนอีกคนปั้นฉากอยู่ เราพิมโค้ดอยู่อีกฝั่ง เห็นกันแบบ Realtime (Google Docs-like)",
      "Cross-Device Streaming: รันเอนจิ้นมหาโหดบน CloudPC แต่มาเขียนเกมผ่าน Browser เครื่องเก่าๆ ได้ลื่น",
      "AI Workflow Personalization: เอนจิ้นรู้ว่าคุณเป็นโปรแกรมเมอร์ จะซ่อนหน้ากราฟิกรกรุงรังให้ตอนเขียนโค้ด",
      "Asset Auto-Tagging & Smart Search: โยนไฟล์รูปลงมา AI ตั้งชื่อว่า 'ดาบเหล็กสีดำ' แล้วค้นหาได้เลย",
      "One-Click Asset Optimization: กดปุ่มเดียว มันลด Polygon ทำ LOD ทำ Texture Compression ทันที"
    ]
  },
  {
    name: "10. Publishing, DevOps & Marketing (การจัดจำหน่ายระดับเทพ)",
    items: [
      "One-Click Multi-Platform Publish: ส่งออกเกมทีเดียวได้ทั้ง PC, Android, iOS, PS5, Xbox และ Switch",
      "Auto Game Trailer Director: AI กล้องบินถ่ายช็อตเท่ๆ ในมุมต่างๆ แล้วตัดต่อวิดีโอตัวอย่างเกมพร้อมเพลงให้",
      "Predictive Market Analyzer: AI แนะนำว่า 'ช่วงนี้ผู้เล่นชอบแนว Survival โค้ดที่คุณทำโอเค แต่อัพกราฟิกอีกนิด'",
      "A/B Testing Simulator: ทดสอบส่งเกม 2 เวอร์ชันให้บอททดสอบ ดูว่าหน้า UI ไหนผู้เล่น/บอท คลิกเร็วกว่า",
      "Real-time Crash Observer: โหมดเฝ้าดู 3D ว่าผู้เล่นจากฝั่งยุโรปเกมหลุดตรงไหน ระเบิดพังบรรทัดไหน สดๆ",
      "Auto-Localization (Full): แปลซับไตเติล เปลี่ยนเสียงพากย์ เปลี่ยนป้ายบนตึก เป็น 50 ภาษา อัตโนมัติ",
      "Dynamic Size Bundling: คนโหลดเกมในมือถือจะโหลดแค่ฉากแรก 100MB เล่นไปโหลดฉากถัดไปเบื้องหลัง",
      "Auto App Store Submissions: จัดการสกรีนช็อต กรอก SEO ส่งอัพเดทขึ้น Steam/AppStore แทนเราทั้งหมด",
      "Social Media Live Hooks: เชื่อมกับ Twitch/YouTube ให้คนดูยิงระเบิดใส่สตรีมเมอร์ได้จากการส่งของขวัญ",
      "Blockchain/Web3 E-Commerce: ฝังหน้าต่างร้านค้า ซื้อขายไอเทมระหว่างผู้เล่น ผ่านระบบ Wallet ตรงจาก IDE"
    ]
  }
];

let itemsText = "";
categories.forEach(cat => {
  itemsText += '\\n  // ' + cat.name + '\\n';
  cat.items.forEach(item => {
    itemsText += '  "' + item.replace(/"/g, '\\"') + '",\\n';
  });
});

const fileContent = "// [The 100 Ultimate Systems Blueprint]\\n" +
"// An exhaustive architecture defining the most complete, perfect Game & Development IDE in existance.\\n\\n" +
"export const Ultimate100Systems = [" + itemsText + "];\\n\\n" +
"export class UltimateIDEFeatures {\\n" +
"  public getAllSystems() { return Ultimate100Systems; }\\n  \\n" +
"  public activateSystem(systemName: string) {\\n" +
"    console.log('[Hyper-Engine] Activating Next-Gen System: ' + systemName);\\n" +
"  }\\n" +
"}\\n";

let replacementText = fs.readFileSync('100_replace.txt', 'utf8');

const safeFileContentStr = "`" + fileContent.replace(/\\/g, "\\\\").replace(/\`/g, "\\\\`").replace(/\$/g, "\\\\$") + "`";

replacementText = replacementText.replace('fileContentX', safeFileContentStr);

let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const regex = /      \} else if \(\(lowerInput\.includes\('ai offline'\)/;

code = code.replace(regex, replacementText);
fs.writeFileSync('src/components/AIChat.tsx', code);
