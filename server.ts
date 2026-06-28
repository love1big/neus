import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Mock database in memory
let tasks = [
  { id: "1", title: "Design World Map", status: "To-Do", type: "feature" },
  { id: "2", title: "Implement Pathfinding", status: "In-Progress", type: "feature" },
  { id: "3", title: "Fix Collision Mesh", status: "QA", type: "bug" },
  { id: "4", title: "Setup Project Structure", status: "Done", type: "setup" },
  { id: "5", title: "Add StoryGraph Editor", status: "QA", type: "feature" },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.json({ success: true, task: newTask });
  });

  app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    tasks = tasks.map(t => t.id === id ? { ...t, status } : t);
    res.json({ success: true, tasks });
  });

  app.post("/api/generate-asset", async (req, res) => {
    try {
      const { prompt } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY environment variable." });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      let imageUrl = null;
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("No image data found in the response.");
      }

      res.json({ success: true, imageUrl });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Unknown error generating image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
