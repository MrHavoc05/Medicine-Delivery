
import userModel from "../models/userModel.js";
import medicineModel from "../models/medicineModel.js";
import orderModel from "../models/orderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔐 Admin Signup
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = await userModel.create({ name, email, password: hashed, role: "admin" });

    res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔐 Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await userModel.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// 🛒 Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file.filename;

    const newMedicine = new medicineModel({
      name,
      price,
      description,
      category,
      image,
    });

    await newMedicine.save();
    res.status(201).json({ message: "Medicine added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Add product failed", error: error.message });
  }
};

// 📦 List Products
export const listProducts = async (req, res) => {
  try {
    const products = await medicineModel.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "List products failed", error: error.message });
  }
};

// 📋 Get Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Get orders failed", error: error.message });
  }
};
