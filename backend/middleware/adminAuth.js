import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden. Admins only." });
    }

    req.user = user; // Optional: attach user to request
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};

export default adminAuth;
