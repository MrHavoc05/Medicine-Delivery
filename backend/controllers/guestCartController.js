import guestCartModel from '../models/guestCartModel.js';

export const addToCart = async (req, res) => {
  try {
    const { sessionId, itemId, quantity = 1 } = req.body;
    if (!sessionId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing sessionId or itemId" });
    }

   
    let cart = await guestCartModel.findOne({ sessionId });

    if (!cart) {
      cart = new guestCartModel({
        sessionId,
        cartData: { [itemId]: quantity },
      });
    } else {
     
      cart.cartData = {
        ...cart.cartData,
        [itemId]: (cart.cartData[itemId] || 0) + quantity,
      };
    }

    await cart.save();

    res.json({ success: true, cartData: cart.cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add to guest cart" });
  }
};


export const getCart = async (req, res) => {
  try {
    const { guestId } = req.query;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "Missing guestId" });
    }

    const cart = await guestCartModel.findOne({ sessionId: guestId });

    if (!cart) {
      return res.status(200).json({ success: true, cartData: {} });
    }

    res.status(200).json({ success: true, cartData: cart.cartData });
  } catch (err) {
    console.error("❌ Error getting guest cart:", err);
    res.status(500).json({ success: false, message: "Failed to get guest cart" });
  }
};

