import mongoose from 'mongoose';

const guestCartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  cartData: { type: Object, default: {} },
}, { minimize: false });

const guestCartModel = mongoose.model("guestCart", guestCartSchema);
export default guestCartModel;
