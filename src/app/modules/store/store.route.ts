import express, { Router } from "express";
import { StoreController } from "./store.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { StoreValidation } from "./store.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── Product routes ───

// Get all products (public)
router.get("/products", StoreController.getProducts);

// Get single product (public)
router.get("/products/:productId", StoreController.getProduct);

// Create product
router.post(
  "/products",
  auth(UserRole.ADMIN),
  validateRequest(StoreValidation.createProductZodSchema),
  StoreController.createProduct,
);

// Update product
router.put(
  "/products/:productId",
  auth(UserRole.ADMIN),
  validateRequest(StoreValidation.updateProductZodSchema),
  StoreController.updateProduct,
);

// Delete product
router.delete(
  "/products/:productId",
  auth(UserRole.ADMIN),
  StoreController.deleteProduct,
);

// ─── Product Image routes ───

// Add image to product
router.post(
  "/products/:productId/images",
  auth(UserRole.ADMIN),
  validateRequest(StoreValidation.addProductImageZodSchema),
  StoreController.addProductImage,
);

// Delete product image
router.delete(
  "/images/:imageId",
  auth(UserRole.ADMIN),
  StoreController.deleteProductImage,
);

// ─── Order routes ───

// Create order (public — buyer places order)
router.post(
  "/orders",
  validateRequest(StoreValidation.createOrderZodSchema),
  StoreController.createOrder,
);

// Get all orders
router.get("/orders", auth(UserRole.ADMIN), StoreController.getOrders);

// Get single order
router.get("/orders/:orderId", auth(UserRole.ADMIN), StoreController.getOrder);

// Update order (payment confirmation, download token, etc.)
router.patch(
  "/orders/:orderId",
  auth(UserRole.ADMIN),
  validateRequest(StoreValidation.updateOrderZodSchema),
  StoreController.updateOrder,
);

export const StoreRouter: Router = router;
