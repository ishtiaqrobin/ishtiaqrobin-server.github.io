import express, { Router } from "express";
import { SitemapController } from "./sitemap.controller";

const router = express.Router();

// Public — XML sitemap (consumed by Google / Bing)
router.get("/sitemap.xml", SitemapController.getSitemapXml);

// Public — JSON representation (debug / frontend)
router.get("/sitemap.json", SitemapController.getSitemapJson);

// Public — robots.txt
router.get("/robots.txt", SitemapController.getRobotsTxt);

export const SitemapRouter: Router = router;
