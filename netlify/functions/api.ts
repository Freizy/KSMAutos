// /netlify/functions/api.ts
import express, { Router } from "express";
import serverless from "serverless-http";
import { Resend } from "resend";

const app = express();
const router = Router();

app.use(express.json());

// Duplicate your inquiry route here for the serverless environment
router.post("/notify-inquiry", async (req, res) => {
  const { vehicleName, userName, userEmail, message, contactEmail } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: 'KSM Autos <notifications@ksmautos.systems>',
      to: contactEmail || 'sales@ksmautos.systems',
      subject: `New Inquiry: ${vehicleName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #030303;">
          <h1 style="background: #E2FF00; padding: 20px; text-transform: uppercase;">New Lead Acquired</h1>
          <p><strong>Vehicle:</strong> ${vehicleName}</p>
          <p><strong>Lead Name:</strong> ${userName}</p>
          <p><strong>Lead Email:</strong> ${userEmail}</p>
          <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
        </div>
      `
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Mount the router under /.netlify/functions/api
app.use("/.netlify/functions/api", router);

export const handler = serverless(app);