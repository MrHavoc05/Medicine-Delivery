import express from 'express';
import GuestCart from '../models/guestCartModel.js';

const router = express.Router();

// ✅ GET: Fetch guest cart
router.get('/get', async (req, res) => {
  const sessionId = req.query.guestId;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Missing guestId' });
  }

  try {
    const cart = await GuestCart.findOne({ sessionId });

    if (!cart) {
      return res.status(200).json({ success: true, cartData: {} });
    }

    return res.status(200).json({ success: true, cartData: cart.cartData });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ✅ POST: Remove item from guest cart
router.post('/remove', async (req, res) => {
  const { sessionId, productId } = req.body;

  if (!sessionId || !productId) {
    return res.status(400).json({ success: false, message: 'Missing sessionId or productId' });
  }

  try {
    const cart = await GuestCart.findOne({ sessionId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Guest cart not found' });
    }

    delete cart.cartData[productId];

    await cart.save();

    return res.status(200).json({ success: true, cartData: cart.cartData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
