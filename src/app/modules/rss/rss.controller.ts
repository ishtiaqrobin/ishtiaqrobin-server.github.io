import { NextFunction, Request, Response } from "express";
import { RssService } from "./rss.service";

// ─── RSS Config ───

// Get config
const getConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RssService.getConfig();

    res.status(200).json({
      success: true,
      message: "RSS config retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update config
const updateConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await RssService.updateConfig(req.body);

    res.status(200).json({
      success: true,
      message: "RSS config updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── RSS Subscribers ───

// Subscribe
const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RssService.subscribe(req.body);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully. Please verify your email.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Verify subscriber via token
const verifySubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    const result = await RssService.verifySubscriber(token as string);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Unsubscribe via token
const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const result = await RssService.unsubscribe(token as string);

    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all subscribers
const getSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await RssService.getSubscribers();

    res.status(200).json({
      success: true,
      message: "Retrieved all subscribers successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete subscriber
const deleteSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subscriberId } = req.params;
    const result = await RssService.deleteSubscriber(subscriberId as string);

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const RssController = {
  getConfig,
  updateConfig,
  subscribe,
  verifySubscriber,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
};
