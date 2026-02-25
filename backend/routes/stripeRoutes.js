const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/authMiddleware');
const { Order } = require('../models/index');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/stripe/create-payment-intent
// @desc    Create a Stripe payment intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get order from database
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        orderId: order.id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalPrice: order.totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/stripe/confirm-payment/:orderId
// @desc    Confirm payment and update order
// @access  Private
router.put('/confirm-payment/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    await order.update({
      isPaid: true,
      paidAt: new Date(),
      paymentMethod: 'Stripe',
    });

    res.json({ message: '✅ Payment confirmed!', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;