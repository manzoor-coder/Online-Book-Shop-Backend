import Order from '../models/order.models';
import OrderItem from '../models/OrderItem.models';
import Cart from '../models/Cart.models';
import CartItem from '../models/CartItem.models';
import Book from '../models/Book.models';
import ApiError from '../utils/apiError';
import sequelize from '../config/db';


export const createOrder = async (userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({ where: { userId }, transaction });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [Book],
      transaction,
    });

    if (items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    let totalAmount = 0;

    for (const item of items) {
      const book = (item as any).Book;

      totalAmount += book.price * item.quantity;
    }

    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: 'pending',
      },
      { transaction }
    );

    for (const item of items) {
      const book = (item as any).Book;

      await OrderItem.create(
        {
          orderId: order.id,
          bookId: book.id,
          quantity: item.quantity,
          price: book.price,
        },
        { transaction }
      );
    }

    // Clear cart
    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction,
    });

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get all orders for a user
export const getUserOrders = async (userId: number) => {
  return await Order.findAll({
    where: { userId },
    include: [OrderItem],
    order: [['createdAt', 'DESC']],
  });
};

// Get order by ID
export const getOrderById = async (userId: number, orderId: number) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [OrderItem],
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return order;
};

// Admin get all orders
export const getAllOrders = async () => {
  return await Order.findAll({
    include: [OrderItem],
    order: [['createdAt', 'DESC']],
  });
};

// update order status (admin)
export const updateOrderStatus = async (
  orderId: number,
  status: string
) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;
  await order.save();

  return order;
};