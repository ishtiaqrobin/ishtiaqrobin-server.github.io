import { prisma } from "../../lib/prisma";
import { PublicStatsInterface } from "./stats.interface";

const SINGLETON_ID = "singleton";

// Get public stats
const getPublicStats = async () => {
  const stats = await prisma.stats.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return stats;
};

// Update public stats
const updatePublicStats = async (payload: Partial<PublicStatsInterface>) => {
  const result = await prisma.stats.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  return result;
};

export const StatsService = {
  getPublicStats,
  updatePublicStats,
};
