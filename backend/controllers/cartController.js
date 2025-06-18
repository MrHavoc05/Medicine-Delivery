import userModel from "../models/userModel.js";
import guestCartModel from "../models/guestCartModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID missing" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = user.cartData || {};
    cartData[itemId] = (cartData[itemId] || 0) + quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart", cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item removed from cart", cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to remove from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, cartData: user.cartData || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch cart data" });
  }
};


const mergeFromGuest = async (req, res) => {
  const userId = req.user.id;
  const { guestId } = req.body;

  const guestCart = await guestCartModel.findOne({ sessionId: guestId });
  const user = await userModel.findById(userId);

  if (!guestCart || !user) {
    return res.status(400).json({ success: false, message: "Invalid merge" });
  }

   if (!user.cartData) user.cartData = {};

  for (const [itemId, qty] of Object.entries(guestCart.cartData)) {
    user.cartData[itemId] = (user.cartData[itemId] || 0) + qty;
  }

  await user.save();
  await guestCartModel.deleteOne({ sessionId: guestId });

  res.json({ success: true, message: "Merged guest cart into user cart" });
};

// Simulate guest cart using session ID or a temporary object

const addToGuestCart = async (req, res) => {
  try {
    const { sessionId, itemId, quantity = 1 } = req.body;

    if (!sessionId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing sessionId or itemId" });
    }

    
    let guestCart = await guestCartModel.findOne({ sessionId });

    if (!guestCart) {
      guestCart = new guestCartModel({ sessionId, cartData: {} });
    }

    guestCart.cartData[itemId] = (guestCart.cartData[itemId] || 0) + quantity;

    await guestCart.save();

    res.status(200).json({ success: true, message: "Item added to guest cart", cartData: guestCart.cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add to guest cart" });
  }
};





export { addToCart, removeFromCart, getCart, mergeFromGuest, addToGuestCart };
