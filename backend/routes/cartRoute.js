import express from "express";
import { addToCart, removeFromCart, getCart, addToGuestCart, mergeFromGuest } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.get("/get", authMiddleware, getCart);
cartRouter.post("/guest-cart/add", addToGuestCart);
cartRouter.post("/merge-from-guest", authMiddleware, mergeFromGuest);

export default cartRouter;
