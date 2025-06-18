import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const placeOrder = async (req, res) => {

  const frontend_url = "http://localhost:5174";
  
  try {
   console.log("📦 Incoming order request:", {
  userId: req.user?.id,
  ...req.body,
});


    const deliveryCharge = 2 * 100; 
    let itemsTotal = 0;

    req.body.items.forEach((item) => {
      itemsTotal += item.price * item.quantity * 100;
    });

    const totalAmount = itemsTotal + deliveryCharge;
    

   const newOrder = new orderModel({
  userId: req.user.id,  
  items: req.body.items,
  amount: totalAmount / 100,
  address: req.body.address
});


    await newOrder.save();
   await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });


    const options = {
      amount: totalAmount, 
      currency: "INR",
      receipt: `order_rcptid_${newOrder._id}`
    };

    console.log("💳 Razorpay order options:", options);
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: order.id,
      amount: options.amount,
      currency: options.currency,
      orderId: newOrder._id,
      frontendRedirectSuccess: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      frontendRedirectFailure: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    });

  } catch (error) {
  console.error("Razorpay order creation failed:", error);
  res.status(500).json({ success: false, message: "Payment session creation failed", error: error.message });
}
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (!orderId) {
            return res.status(400).json({ success: false, message: "OrderId missing" });
        }

        if (success) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Order marked as paid." });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order not paid, removed." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



// user orders for frontend 
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }

    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Listing orders for Admin 
const listOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
  }
}

// Api for Updating order status
const updateStatus = async (req,res) => {
 try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
 } catch (error) {
  console.log(error)
  res.json({success:false,message:"error"})
 }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
