import { NextFunction, Request, Response } from "express";
import { StoreService } from "./store.service";

// ─── Product ────────────────────────────────────────────────

// Create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StoreService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all products
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StoreService.getProducts();

    res.status(200).json({
      success: true,
      message: "Retrieved all products successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single product
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const result = await StoreService.getProduct(productId as string);

    res.status(200).json({
      success: true,
      message: "Retrieved product successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update product
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await StoreService.updateProduct(
      productId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete product
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await StoreService.deleteProduct(productId as string);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Product Image ───────────────────────────────────────────

// Add image to product
const addProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await StoreService.addProductImage({
      ...req.body,
      productId,
    });

    res.status(201).json({
      success: true,
      message: "Product image added successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete product image
const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imageId } = req.params;
    const result = await StoreService.deleteProductImage(imageId as string);

    res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Order ───────────────────────────────────────────────────

// Create order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StoreService.createOrder(req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all orders
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StoreService.getOrders();

    res.status(200).json({
      success: true,
      message: "Retrieved all orders successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single order
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const result = await StoreService.getOrder(orderId as string);

    res.status(200).json({
      success: true,
      message: "Retrieved order successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update order
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const result = await StoreService.updateOrder(orderId as string, req.body);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StoreController = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
};
