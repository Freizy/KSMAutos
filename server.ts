import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "KSM Autos API is active" });
  });

  
  app.post("/api/notify-inquiry", async (req, res) => {
    const { vehicleName, userName, userEmail, message, contactEmail } = req.body;
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set. Skipping email notification.");
      return res.json({ success: true, message: "Email skipped (no API key)" });
    }

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: 'KSM Autos <notifications@ksmautos.systems>',
        to: contactEmail || 'ksmautos.freizy@gmail.com',
        subject: `New Inquiry: ${vehicleName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #030303;">
            <h1 style="background: #E2FF00; padding: 20px; text-transform: uppercase; letter-spacing: -2px;">New Lead Acquired</h1>
            <div style="padding: 20px; border: 1px solid #eee;">
              <p><strong>Vehicle:</strong> ${vehicleName}</p>
              <p><strong>Lead Name:</strong> ${userName}</p>
              <p><strong>Lead Email:</strong> ${userEmail}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #E2FF00; font-style: italic;">"${message || 'No message provided.'}"</p>
            </div>
          </div>
        `
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send notification" });
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
    console.log(`KSM Autos server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
