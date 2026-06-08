import { prisma } from "../../lib/prisma";
import { Settings } from "./setting.interface";

const SINGLETON_ID = "singleton";

// Get settings
const getSettings = async () => {
  const settings = await prisma.settings.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return settings;
};

// Update or create settings
const updateSettings = async (payload: Partial<Settings>) => {
  const result = await prisma.settings.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  return result;
};

export const SettingService = {
  getSettings,
  updateSettings,
};
