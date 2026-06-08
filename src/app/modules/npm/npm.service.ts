import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateNpmPackageInput, UpdateNpmPackageInput } from "./npm.interface";

const NPM_API_BASE = "https://api.npmjs.org";

// ─── Sync ──────────────────────────────────────────────────────

// Sync a single package's stats from the npm API (admin)
const syncNpmPackage = async (name: string) => {
  const pkg = await getNpmPackageByName(name); // ensure it exists

  // Fetch weekly downloads (last week)
  const weeklyRes = await fetch(
    `${NPM_API_BASE}/downloads/point/last-week/${encodeURIComponent(name)}`,
  );

  if (!weeklyRes.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `Failed to fetch npm download stats for "${name}"`,
    );
  }

  const weeklyData = await weeklyRes.json();

  // Fetch total downloads (since the package was published)
  const totalRes = await fetch(
    `${NPM_API_BASE}/downloads/point/1000-01-01:${new Date().toISOString().split("T")[0]}/${encodeURIComponent(name)}`,
  );

  const totalData = totalRes.ok ? await totalRes.json() : null;

  // Fetch latest version from the npm registry
  const registryRes = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`,
  );

  const registryData = registryRes.ok ? await registryRes.json() : null;

  const result = await prisma.npmPackage.update({
    where: { id: pkg.id },
    data: {
      weeklyDownloads: weeklyData.downloads ?? pkg.weeklyDownloads,
      totalDownloads: totalData?.downloads ?? pkg.totalDownloads,
      version: registryData?.version ?? pkg.version,
      lastSyncedAt: new Date(),
    },
  });

  return result;
};

// ─── CRUD ──────────────────────────────────────────────────────

// Create a package (admin)
const createNpmPackage = async (payload: CreateNpmPackageInput) => {
  const result = await prisma.npmPackage.create({
    data: payload,
  });

  return result;
};

// Get all published packages (public)
const getAllNpmPackages = async () => {
  const result = await prisma.npmPackage.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return result;
};

// Get all packages including unpublished (admin)
const getAllNpmPackagesAdmin = async () => {
  const result = await prisma.npmPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return result;
};

// Get a single package by ID (admin)
const getNpmPackageById = async (id: string) => {
  const result = await prisma.npmPackage.findUnique({
    where: { id },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "npm package not found");
  }

  return result;
};

// Get a single package by name (internal helper)
const getNpmPackageByName = async (name: string) => {
  const result = await prisma.npmPackage.findUnique({
    where: { name },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `npm package "${name}" not found`);
  }

  return result;
};

// Update a package (admin)
const updateNpmPackage = async (id: string, payload: UpdateNpmPackageInput) => {
  await getNpmPackageById(id); // ensure it exists

  const result = await prisma.npmPackage.update({
    where: { id },
    data: payload,
  });

  return result;
};

// Delete a package (admin)
const deleteNpmPackage = async (id: string) => {
  await getNpmPackageById(id); // ensure it exists

  await prisma.npmPackage.delete({ where: { id } });
};

export const NpmService = {
  syncNpmPackage,
  createNpmPackage,
  getAllNpmPackages,
  getAllNpmPackagesAdmin,
  getNpmPackageById,
  updateNpmPackage,
  deleteNpmPackage,
};
