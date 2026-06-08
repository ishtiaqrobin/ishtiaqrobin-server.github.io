import { prisma } from "../../lib/prisma";
import {
  CreateProductInput,
  UpdateProductInput,
  CreateProductImageInput,
  CreateOrderInput,
  UpdateOrderInput,
} from "./store.interface";

// ─── Product ────────────────────────────────────────────────

// Create product
const createProduct = async (payload: CreateProductInput) => {
  const result = await prisma.product.create({
    data: payload,
    include: { images: true },
  });

  return result;
};

// Get all products
const getProducts = async () => {
  const result = await prisma.product.findMany({
    include: { images: true },
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

// Get single product by id or slug
const getProduct = async (productId: string) => {
  const result = await prisma.product.findFirst({
    where: {
      OR: [{ id: productId }, { slug: productId }],
    },
    include: { images: true },
  });

  return result;
};

// Update product
const updateProduct = async (
  productId: string,
  payload: UpdateProductInput,
) => {
  const result = await prisma.product.update({
    where: { id: productId },
    data: payload,
    include: { images: true },
  });

  return result;
};

// Delete product
const deleteProduct = async (productId: string) => {
  const result = await prisma.product.delete({
    where: { id: productId },
  });

  return result;
};

// ─── Product Image ───────────────────────────────────────────

// Add image to product
const addProductImage = async (payload: CreateProductImageInput) => {
  const result = await prisma.productImage.create({
    data: payload,
  });

  return result;
};

// Delete product image
const deleteProductImage = async (imageId: string) => {
  const result = await prisma.productImage.delete({
    where: { id: imageId },
  });

  return result;
};

// ─── Order ───────────────────────────────────────────────────

// Create order
const createOrder = async (payload: CreateOrderInput) => {
  const result = await prisma.order.create({
    data: payload,
    include: { product: true },
  });

  return result;
};

// Get all orders
const getOrders = async () => {
  const result = await prisma.order.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Get single order
const getOrder = async (orderId: string) => {
  const result = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  return result;
};

// Update order
const updateOrder = async (orderId: string, payload: UpdateOrderInput) => {
  const result = await prisma.order.update({
    where: { id: orderId },
    data: payload,
    include: { product: true },
  });

  return result;
};

export const StoreService = {
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
