// routes/payments.js
//
// SANDBOX / DEMO ONLY. Uses Razorpay TEST MODE keys (they start with
// "rzp_test_"). No real money ever moves — this cannot be pointed at a
// live key by accident unless someone deliberately swaps the env vars,
// and even then it's a payment gateway sandbox, never a direct bank
// transfer of any kind.
//
// Flow:
//   1. POST /orders/:id/pay     -> creates a Razorpay test order, returns
//                                   what the frontend needs to open Razorpay
//                                   Checkout (a JS widget, not a URL).
//   2. Frontend opens Checkout with that data; user "pays" with Razorpay's
//      published test card numbers.
//   3. On success, Razorpay's JS callback gives the frontend
//      {razorpay_order_id, razorpay_payment_id, razorpay_signature}.
//   4. Frontend POSTs those to /orders/:id/verify. We recompute the HMAC
//      signature server-side; only if it matches do we mark the order paid.
//
// Env vars required (put these in .env, get free test keys from
// dashboard.razorpay.com after toggling "Test Mode"):
//   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
//   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
//   RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxx   (optional, only for the webhook route)

const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay'); // npm install razorpay
const pool = require('../db');

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_')) {
  console.warn(
    '[payments] RAZORPAY_KEY_ID does not look like a TEST MODE key (should start with rzp_test_). ' +
    'Double-check you are not using live keys in this demo.'
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /orders/:id/pay
// Creates a Razorpay test-mode order for the given internal order and
// returns the payload the frontend passes straight into Razorpay Checkout.
router.post('/:id/pay', async (req, res) => {
  const { id } = req.params;

  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    const order = orderResult.rows[0];
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.payment_status === 'completed') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Razorpay amounts are in the smallest currency unit (paise for INR).
    let amountPaise = Math.round(Number(order.total_cost) * 100);
    if (!amountPaise || amountPaise <= 0) {
      amountPaise = 500000; // 5,000 INR
    }

    // In Razorpay TEST MODE, cap to 1,00,000 INR (10,000,000 paise) to prevent "Amount exceeds maximum amount allowed."
    if (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && amountPaise > 10000000) {
      console.log(`[payments] Capped test amount from ${amountPaise} to 10000000 paise for Razorpay Test Sandbox`);
      amountPaise = 10000000;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `order_${order.id}`,
      notes: { internal_order_id: String(order.id), company_id: String(order.company_id) },
    });

    await pool.query('UPDATE orders SET razorpay_order_id = $1 WHERE id = $2', [
      razorpayOrder.id,
      order.id,
    ]);

    return res.json({
      // Everything below is handed directly to Razorpay's Checkout.js on the frontend.
      key_id: process.env.RAZORPAY_KEY_ID,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      internal_order_id: order.id,
      mode: 'TEST', // reminder for the frontend to label the checkout as a demo
    });
  } catch (err) {
    console.error('POST /orders/:id/pay failed:', err.message);
    return res.status(500).json({ error: 'Could not start payment' });
  }
});

// POST /orders/:id/verify
// Called by the frontend right after Razorpay Checkout's success callback.
// Confirms the payment is genuine by recomputing the HMAC signature —
// this is the standard Razorpay client-side verification step.
router.post('/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing razorpay_order_id, razorpay_payment_id or razorpay_signature' });
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await pool.query('UPDATE orders SET payment_status = $1 WHERE id = $2', ['failed', id]);
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    const result = await pool.query(
      `UPDATE orders
       SET payment_status = 'completed', razorpay_payment_id = $1, paid_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [razorpay_payment_id, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    return res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('POST /orders/:id/verify failed:', err.message);
    return res.status(500).json({ error: 'Could not verify payment' });
  }
});

// POST /webhooks/razorpay  (optional, mount separately with express.raw() —
// see README). Server-to-server confirmation as a backup to /verify, in
// case the user closes the tab before the frontend callback fires.
// Still TEST MODE only: this webhook is configured against the same
// rzp_test_ account in the Razorpay dashboard.
router.post('/webhooks/razorpay', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('[payments] RAZORPAY_WEBHOOK_SECRET not set — ignoring webhook call.');
    return res.status(200).json({ received: false });
  }

  try {
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(req.body.toString());
    if (payload.event === 'payment.captured') {
      const razorpayOrderId = payload.payload.payment.entity.order_id;
      const razorpayPaymentId = payload.payload.payment.entity.id;
      await pool.query(
        `UPDATE orders
         SET payment_status = 'completed', razorpay_payment_id = $1, paid_at = NOW()
         WHERE razorpay_order_id = $2`,
        [razorpayPaymentId, razorpayOrderId]
      );
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Razorpay webhook handling failed:', err.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
