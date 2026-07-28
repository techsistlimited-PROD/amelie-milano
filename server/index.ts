import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleNewsletterSubscribe } from "./routes/newsletter";
import { changePassword, getAccount, updateAccount } from "./routes/account";
import { createOrder, listOrders, requestReturn } from "./routes/orders";
import { handleContactSubmission, handleStyleConciergeSubmission } from "./routes/submissions";
import { getPayment, handlePaymentCancel, handlePaymentFailure, handlePaymentIpn, handlePaymentSuccess, initiatePayment } from "./routes/payments";

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
  app.post("/api/contact/submit", handleContactSubmission);
  app.post("/api/style-concierge/submit", handleStyleConciergeSubmission);
  app.get("/api/account", getAccount);
  app.put("/api/account", updateAccount);
  app.put("/api/account/password", changePassword);
  app.get("/api/orders", listOrders);
  app.post("/api/orders", createOrder);
  app.patch("/api/orders/:number/return", requestReturn);
  app.post("/api/payments/initiate", initiatePayment);
  app.get("/api/payments/:transactionId", getPayment);
  app.post("/api/payments/sslcommerz/success", handlePaymentSuccess);
  app.post("/api/payments/sslcommerz/fail", handlePaymentFailure);
  app.post("/api/payments/sslcommerz/cancel", handlePaymentCancel);
  app.post("/api/payments/sslcommerz/ipn", handlePaymentIpn);

  return app;
}
