import Order from '../models/order.models';
import OrderItem from '../models/OrderItem.models';
import Cart from '../models/Cart.models';
import CartItem from '../models/CartItem.models';
import Book from '../models/Book.models';
import ApiError from '../utils/apiError';
import sequelize from '../config/db';
import { PaymentStatus } from '../enums/paymentStatus.enum';

export const createOrder = async (
  userId: number,
  stripeSessionId?: string,
  paymentIntentId?: string
) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Get Cart
    const cart = await Cart.findOne({
      where: { userId },
      transaction,
    });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    // 2️⃣ Get Cart Items
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [Book],
      transaction,
    });

    if (!items.length) {
      throw new ApiError(400, 'Cart is empty');
    }

    // 3️⃣ Calculate Total
    let totalAmount = 0;

    for (const item of items) {
      const book = (item as any).Book;

      if (!book) {
        throw new ApiError(404, 'Book not found');
      }

      totalAmount += book.price * item.quantity;
    }

    // 4️⃣ CREATE ORDER (PENDING by default)
    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: 'pending',

        // 🔥 IMPORTANT: default state BEFORE webhook confirmation
        paymentStatus: PaymentStatus.PENDING,

        stripeSessionId: stripeSessionId || null,
        paymentIntentId: paymentIntentId || null,
      },
      { transaction }
    );

    // 5️⃣ CREATE ORDER ITEMS
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

    // 6️⃣ CLEAR CART
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