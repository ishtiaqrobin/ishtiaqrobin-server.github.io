import { prisma } from "../../lib/prisma";
import { CreateSkillInput, UpdateSkillInput } from "./skill.interface";

// Create skill
const createSkill = async (payload: CreateSkillInput) => {
  const result = await prisma.skill.create({
    data: payload as any,
  });
  return result;
};

// Get all skills
const getSkills = async (categoryId?: string) => {
  const where = categoryId ? { categoryId } : {};
  const result = await prisma.skill.findMany({
    where,
    include: {
      category: true,
    },
  });
  return result;
};

// Update skill
const updateSkill = async (id: string, payload: UpdateSkillInput) => {
  const result = await prisma.skill.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete skill
const deleteSkill = async (id: string) => {
  const result = await prisma.skill.delete({
    where: { id },
  });
  return result;
};

export const SkillService = {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
};
