import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route for subscription and email
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
      }
      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from: "Nia Monroe <onboarding@resend.dev>",
        to: [email],
        subject: "You Ain't The Only One: The Truth is Out...",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #05070A; color: #F8FAFC; padding: 40px; border-radius: 8px;">
            <h1 style="color: #3B82F6; font-size: 24px; margin-bottom: 20px;">The secret is out, and it's louder than you think.</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">
              Janice thought she was the only one. Melissa thought she was the only one.
              But those two lines don't lie.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">
              Thank you for signing up for updates on <strong>'You Ain't The Only One'</strong>.
              You're now on the list for exclusive sneak peeks, character reveals, and the first word on the sequel's release.
            </p>
            <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #EF4444; background-color: rgba(239, 68, 68, 0.1);">
              <p style="font-style: italic; margin: 0;">
                "In seven months, there could be two of them. I close my eyes. And wait."
              </p>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">Stay tuned. The drama is just getting started.</p>
            <p style="margin-top: 40px; font-size: 14px; color: #64748B;">— Nia Monroe</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: "Failed to send email" });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: "Internal server error" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();