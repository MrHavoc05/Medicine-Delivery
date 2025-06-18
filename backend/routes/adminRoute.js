import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { addProduct, listProducts, getOrders } from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-product", adminAuth, addProduct);
router.get("/products", adminAuth, listProducts);
router.get("/orders", adminAuth, getOrders);

export default router;
