import Stripe from 'stripe';
import { createOrder } from '../services/orderService';
import Order from '../models/order.models';
import { PaymentStatus } from '../enums/paymentStatus.enum';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ PAYMENT SUCCESS
  if (event.type === 'checkout.session.completed') {
    const session: any = event.data.object;

    const userId = Number(session.metadata.userId);

    // 🔥 Prevent duplicate orders
    const existingOrder = await Order.findOne({
      where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
      return res.json({ received: true });
    }

    // Create Order
    await createOrder(
      userId,
      session.id,
      session.payment_intent
    );

    // Update payment status
    await Order.update(
      {
        paymentStatus: PaymentStatus.PAID,
      },
      {
        where: { stripeSessionId: session.id },
      }
    );
  }

  // ❌ PAYMENT FAILED
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent: any = event.data.object;

    await Order.update(
      {
        paymentStatus: PaymentStatus.FAILED,
      },
      {
        where: { paymentIntentId: paymentIntent.id },
      }
    );
  }

  return res.json({ received: true });
};