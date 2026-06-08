import { NextFunction, Request, Response } from "express";
import { SkillService } from "./skill.service";

// Create skill
const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SkillService.createSkill(req.body);
    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all skills
const getSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.query;
    const result = await SkillService.getSkills(categoryId as string);
    res.status(200).json({
      success: true,
      message: "Retrieved all skills successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update skill
const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await SkillService.updateSkill(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete skill
const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await SkillService.deleteSkill(id as string);
    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const SkillController = {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
};
