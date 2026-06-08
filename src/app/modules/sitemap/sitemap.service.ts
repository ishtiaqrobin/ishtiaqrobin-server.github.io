import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

/**
 * Sitemap entry shape (matches sitemaps.org 0.9 spec)
 */
export interface SitemapUrl {
  loc: string;
  lastmod?: string; // ISO 8601 date
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number; // 0.0 - 1.0
}

// Escape special XML characters in URLs (just in case slugs contain them)
const escapeXml = (unsafe: string): string =>
  unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/**
 * Static, hand-curated routes that should always live in the sitemap.
 * These mirror the public frontend pages.
 */
const getStaticRoutes = (baseUrl: string): SitemapUrl[] => {
  const now = new Date().toISOString();
  return [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: 1.0, lastmod: now },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: 0.8 },
    { loc: `${baseUrl}/projects`, changefreq: "weekly", priority: 0.9 },
    { loc: `${baseUrl}/blogs`, changefreq: "daily", priority: 0.9 },
    { loc: `${baseUrl}/services`, changefreq: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/certificates`, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/gallery`, changefreq: "monthly", priority: 0.5 },
    { loc: `${baseUrl}/contact`, changefreq: "yearly", priority: 0.5 },
    { loc: `${baseUrl}/store`, changefreq: "weekly", priority: 0.8 },
  ];
};

/**
 * Dynamic routes — pulled live from the database so any newly created
 * blog/project/service/certificate/product appears automatically.
 */
const getDynamicRoutes = async (baseUrl: string): Promise<SitemapUrl[]> => {
  const [blogs, projects, services, certificates, products] = await Promise.all(
    [
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.service.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.certificate.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ],
  );

  const blogUrls: SitemapUrl[] = blogs.map((b) => ({
    loc: `${baseUrl}/blogs/${b.slug}`,
    lastmod: (b.updatedAt ?? b.publishedAt ?? new Date()).toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  const projectUrls: SitemapUrl[] = projects.map((p) => ({
    loc: `${baseUrl}/projects/${p.id}`,
    lastmod: p.updatedAt.toISOString(),
    changefreq: "monthly",
    priority: 0.7,
  }));

  const serviceUrls: SitemapUrl[] = services.map((s) => ({
    loc: `${baseUrl}/services/${s.id}`,
    lastmod: s.updatedAt.toISOString(),
    changefreq: "monthly",
    priority: 0.6,
  }));

  const certificateUrls: SitemapUrl[] = certificates.map((c) => ({
    loc: `${baseUrl}/certificates/${c.id}`,
    lastmod: c.updatedAt.toISOString(),
    changefreq: "yearly",
    priority: 0.4,
  }));

  const productUrls: SitemapUrl[] = products.map((p) => ({
    loc: `${baseUrl}/store/${p.slug}`,
    lastmod: p.updatedAt.toISOString(),
    changefreq: "weekly",
    priority: 0.7,
  }));

  return [
    ...blogUrls,
    ...projectUrls,
    ...serviceUrls,
    ...certificateUrls,
    ...productUrls,
  ];
};

/**
 * Build the full sitemap.xml string.
 */
const buildSitemapXml = async (): Promise<string> => {
  const baseUrl = trimTrailingSlash(env.FRONTEND_URL);

  const staticRoutes = getStaticRoutes(baseUrl);
  const dynamicRoutes = await getDynamicRoutes(baseUrl);

  const urls: SitemapUrl[] = [...staticRoutes, ...dynamicRoutes];

  const urlEntries = urls
    .map((u) => {
      const parts: string[] = [];
      parts.push(`    <loc>${escapeXml(u.loc)}</loc>`);
      if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq)
        parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (typeof u.priority === "number")
        parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

/**
 * Build a JSON representation — useful for debugging or for the frontend
 * to consume the sitemap data without parsing XML.
 */
const buildSitemapJson = async () => {
  const baseUrl = trimTrailingSlash(env.FRONTEND_URL);
  const staticRoutes = getStaticRoutes(baseUrl);
  const dynamicRoutes = await getDynamicRoutes(baseUrl);
  return {
    baseUrl,
    total: staticRoutes.length + dynamicRoutes.length,
    static: staticRoutes,
    dynamic: dynamicRoutes,
  };
};

/**
 * Build robots.txt content pointing to the sitemap.
 */
const buildRobotsTxt = (): string => {
  const baseUrl = trimTrailingSlash(env.FRONTEND_URL);
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml
`;
};

export const SitemapService = {
  buildSitemapXml,
  buildSitemapJson,
  buildRobotsTxt,
};
