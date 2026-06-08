import { NextFunction, Request, Response } from "express";
import { SitemapService } from "./sitemap.service";

// GET /sitemap.xml — auto-generated XML sitemap for SEO
const getSitemapXml = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const xml = await SitemapService.buildSitemapXml();

    res.header("Content-Type", "application/xml");
    // Cache for 1 hour at CDN / browser to reduce DB load
    res.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml);
  } catch (err) {
    next(err);
  }
};

// GET /sitemap.json — JSON representation (debug / frontend consumption)
const getSitemapJson = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await SitemapService.buildSitemapJson();

    res.status(200).json({
      success: true,
      message: "Sitemap generated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /robots.txt — robots file referencing the sitemap
const getRobotsTxt = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const txt = SitemapService.buildRobotsTxt();

    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "public, max-age=86400");
    res.status(200).send(txt);
  } catch (err) {
    next(err);
  }
};

export const SitemapController = {
  getSitemapXml,
  getSitemapJson,
  getRobotsTxt,
};
