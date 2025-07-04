GetMeds is a full-stack medicine delivery web application designed to streamline access to medical products. Built with scalability and real-time user experience in mind, it supports both customers and admins. Think of it as the Zomato of medical stores – connecting users to nearby pharmacies for fast, reliable medicine delivery.

🚀 Features
👤 Customer Features:
User Authentication (Signup/Login)

Search & Browse Medical Products

Add to Cart (Guest & Logged-in Support)

Smart Cart Merge after Login

Place Orders & Track Status

🛒 Guest Cart Logic:
Guest users can build a cart without logging in

On login, guest cart items merge with user cart seamlessly

Cart persistence through context & backend sync

🧑‍💼 Admin Panel:
Admin Authentication

Add / Edit / Delete Products

View All Orders

Role-based Access Control (role: 'user' | 'admin' in userModel)

🏪 Vendor Logic:
Medical stores act as vendors (Zomato-style)

Easily scalable vendor-product relationship

🧱 Tech Stack
Layer	Technology
Frontend:	React, Tailwind CSS
State Mgmt:	Context API
Backend:	Node.js, Express
Database:	MongoDB (Mongoose)
Auth:	JWT
