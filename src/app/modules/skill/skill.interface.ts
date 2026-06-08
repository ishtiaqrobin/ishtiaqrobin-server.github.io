import { SkillLevel } from "../../../generated/prisma";

export type CreateSkillInput = {
  name: string;
  level: SkillLevel;
  icon?: {
    name: string;
    library: string;
    color: string;
  };
  categoryId: string;
  sortOrder?: number;
};

export type UpdateSkillInput = Partial<CreateSkillInput>;
