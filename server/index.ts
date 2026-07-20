import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleNewsletterSubscribe } from "./routes/newsletter";
import { changePassword, getAccount, updateAccount } from "./routes/account";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/newsletter/subscribe", handleNewsletterSubscribe);
  app.get("/api/account", getAccount);
  app.put("/api/account", updateAccount);
  app.put("/api/account/password", changePassword);

  return app;
}
