import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpaySecret: process.env.RAZORPAY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  premiumPlanPrice: process.env.PREMIUM_PLAN_PRICE,
}));
