import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import medicineRouter from './routes/medicineRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from "dotenv";
dotenv.config();
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import guestCartRoutes from './routes/guestCartRoutes.js';
import * as guestCartController from './controllers/guestCartController.js';
import adminAuthRoute from "./routes/adminAuthRoute.js";
import adminRouter from "./routes/adminRoute.js";

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;



// app config
const app = express()
const PORT = process.env.port || 3000

// middleware
app.use(cors())
app.use(express.json())

// db connection
connectDB();

// api endpoint 
app.use("/api/medicine", medicineRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/guest-cart', guestCartRoutes);
app.post('/api/guest-cart/add', guestCartController.addToCart);
app.use("/api/admin", adminAuthRoute);
app.use("/api/admin", adminRouter);    


app.get("/",(req, res) => {
    res.send("Welcome to the backend server!")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
