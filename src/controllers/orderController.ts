import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createOrder, getAllOrders, getOrderById, getUserOrders, updateOrderStatus } from '../services/orderService';
import { AuthRequest } from '../types/express';
import { ApiResponse } from '../utils/apiResponse';

export const createUserOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await createOrder(req.user!.id);

    return res
      .status(201)
      .json(new ApiResponse(201, order, 'Order created successfully'));
  }
);

// Get all orders for a user
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await getUserOrders(req.user!.id);

    return res
      .status(200)
      .json(new ApiResponse(200, orders, 'Orders fetched successfully'));
  }
);

// Get order by ID
export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await getOrderById(
      req.user!.id,
      Number(req.params.id)
    );

    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order fetched'));
  }
);

// Admin get all orders
export const getOrdersAdmin = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const orders = await getAllOrders();

    return res
      .status(200)
      .json(new ApiResponse(200, orders, 'All orders fetched'));
  }
);

// Admin update order status
export const updateStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    const order = await updateOrderStatus(
      Number(req.params.id),
      status
    );

    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order status updated'));
  }
);