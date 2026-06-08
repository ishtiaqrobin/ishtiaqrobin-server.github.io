import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
// import { handler as ipinfo } from "express-ipinfo";

import { env } from "./app/config/env";
import { IndexRoutes } from "./app/routes";
import { SitemapRouter } from "./app/modules/sitemap/sitemap.route";
import { notFound } from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { globalLimiter, authLimiter } from "./app/middlewares/rateLimiter";

// ── Loggers
import { successLogger } from "./app/middlewares/logger/success.logger";
import { errorLogger } from "./app/middlewares/logger/error.logger";
import { pageviewLogger } from "./app/middlewares/logger/pageview.logger";
import { prisma } from "./app/lib/prisma";
import { HealthRoutes } from "./app/modules/health/health.route";

const app: Application = express();

// ── View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

// ── Core Middlewares
app.use(
  cors({
    origin: [
      env.FRONTEND_URL,
      env.BETTER_AUTH_URL,
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── IP Geolocation (pageview ও resume-download logger-এ country/city পাওয়ার জন্য)
// .env-তে IPINFO_TOKEN সেট করতে হবে — https://ipinfo.io/signup
// app.use(ipinfo({ token: env.IPINFO_TOKEN }));

// ── Global Loggers
// app.use(successLogger);
// app.use(errorLogger);
// app.use(pageviewLogger);

// ── Auth Routes (Better Auth — logger-এর পরে রাখতে হবে)
// Stricter limiter to mitigate brute-force / credential stuffing.
app.all("/api/auth/*splat", authLimiter, toNodeHandler(auth));

// ── App Routes (Global rate limit: 100 req / 15 min / IP)
app.use("/api/v1", globalLimiter, IndexRoutes);

// ── SEO Routes (sitemap.xml, sitemap.json, robots.txt)
// Mounted at root so canonical URLs are e.g. https://api.example.com/sitemap.xml
app.use("/", SitemapRouter);

// ── Root Route
app.get("/", (_req: Request, res: Response) => {
  res.send("Ishtiaq Robin Portfolio Backend is running");
});

// ── Health Check Route
app.use("/health", HealthRoutes);

// ── Error Handler (সবার শেষে)
app.use(globalErrorHandler);
app.use(notFound);

export default app;
