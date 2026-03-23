import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  console.log("Starting server function...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  // Global request logger
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Redirect any subpath (like /yatoo) to root
  // This ensures that links from the ebook don't 404
  app.get("*", (req, res, next) => {
    const url = req.path;
    const isRoot = url === "/";
    const isApi = url.startsWith("/api");
    const hasExtension = url.includes(".");
    const isViteInternal = url.startsWith("/@") || url.startsWith("/node_modules") || url.startsWith("/src");

    if (!isRoot && !isApi && !hasExtension && !isViteInternal) {
      console.log(`Redirecting subpath ${url} to root`);
      return res.redirect("/");
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    console.log("Health check requested");
    res.json({ status: "ok" });
  });

  // API Route for subscription (Simplified - no email for now)
  app.post("/api/subscribe", async (req, res) => {
    res.json({ success: true, message: "Subscription received (email disabled)" });
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