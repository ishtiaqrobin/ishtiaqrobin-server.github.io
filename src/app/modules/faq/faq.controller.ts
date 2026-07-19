import { NextFunction, Request, Response } from "express";
import { FaqService } from "./faq.service";

const createFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await FaqService.createFaq(req.body);
    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getFaqs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isPublished } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const result = await FaqService.getFaqs(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all FAQs successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await FaqService.updateFaq(
      id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await FaqService.deleteFaq(id as string);
    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const FaqController = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};
