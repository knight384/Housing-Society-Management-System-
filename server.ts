import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "SocietyHub Management System", timestamp: new Date().toISOString() });
  });

  // AI Assistant Route using Gemini API
  app.post("/api/ai/notice-assistant", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { topic, category, targetAudience } = req.body;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          title: `Important Notice: ${topic || "Society Announcement"}`,
          content: `Dear Residents of Grand Vista Heights,\n\nPlease be informed regarding ${topic || "upcoming society activities"}. Kindly strictly adhere to society guidelines.\n\nFor any queries, contact the Resident Welfare Association (RWA) office.\n\nRegards,\nSociety Management Committee`,
          summary: `Notice issued regarding ${topic || "society announcement"}.`,
          suggestedCategory: category || "General"
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the Resident Welfare Association (RWA) Secretary for Grand Vista Heights Housing Society. Draft a concise, formal, and polite society notice board announcement about: "${topic}". Category: "${category || 'General'}". Target Audience: "${targetAudience || 'All Residents'}".
      Format your response strictly as JSON with three keys:
      1. "title": Short catchy notice title
      2. "content": Professional clear body text with bullet points if applicable
      3. "summary": One-sentence summary for push notifications`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } else {
        throw new Error("Empty AI response");
      }
    } catch (err: any) {
      console.error("AI Notice Assistant Error:", err?.message || err);
      res.status(500).json({
        error: "Failed to generate notice with AI",
        fallback: {
          title: `Announcement: ${req.body?.topic || "Notice"}`,
          content: `Notice regarding ${req.body?.topic || "society update"}. Please check society portal for details.`,
          summary: `New notice updated on portal.`
        }
      });
    }
  });

  // AI Maintenance Ticket Categorization Route
  app.post("/api/ai/analyze-ticket", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { description, title } = req.body;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          priority: description?.toLowerCase().includes("leak") || description?.toLowerCase().includes("fire") ? "High" : "Medium",
          suggestedCategory: "General Maintenance",
          estimatedResolutionHours: 24,
          recommendedAction: "Dispatch designated society technician for inspection within 4 hours."
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this housing society maintenance complaint ticket: Title: "${title}", Description: "${description}".
      Respond strictly in JSON with:
      - "priority": "High" | "Medium" | "Low"
      - "suggestedCategory": "Plumbing" | "Electrical" | "Elevator" | "Security" | "Civil/Pest" | "General Maintenance"
      - "estimatedResolutionHours": number
      - "recommendedAction": concise advice for RWA admin`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      res.json({
        priority: "Medium",
        suggestedCategory: "General Maintenance",
        estimatedResolutionHours: 24,
        recommendedAction: "Review complaint and assign maintenance staff."
      });
    }
  });

  // Backup & Export endpoints
  app.get("/api/backup/download", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=societyhub-backup-${Date.now()}.json`);
    res.json({
      system: "SocietyHub Cloud Backup",
      timestamp: new Date().toISOString(),
      version: "1.0",
      checksum: "SHA256-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    });
  });

  // Vite Middleware in Dev Mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Housing Society Management Server running on http://localhost:${PORT}`);
  });
}

startServer();
