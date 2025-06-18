import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
const navigate = useNavigate();
const { medicine_list, getTotalCartAmount, token, cartItems, url } = useContext(StoreContext);

const totalAmount = getTotalCartAmount();
const deliveryFee = totalAmount === 0 ? 0 : 2;

console.log("🔑 Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);


const [data, setData] = useState({
firstName: "",
lastName: "",
email: "",
street: "",
city: "",
state: "",
zipcode: "",
country: "",
phone: ""
});

const onChangeHandler = (event) => {
const { name, value } = event.target;
setData(prev => ({ ...prev, [name]: value }));
};

const placeOrder = async (event) => {
event.preventDefault();


const orderItems = medicine_list
.filter(item => cartItems[item._id] > 0)
.map(item => ({
_id: item._id,
name: item.name,
price: item.price,
quantity: cartItems[item._id],
}));

if (orderItems.length === 0) {
alert("Your cart is empty.");
return;
}

if (!data) {
alert("Address is missing.");
return;
}

const userId = localStorage.getItem("userId");

const orderData = {
address: data,
items: orderItems,
amount: totalAmount + deliveryFee
};

console.log("📦 Sending Order Data:", orderData);


try {
const res = await axios.post(`${url}/api/order/place`, orderData, {
headers: { token }
});

const order = res.data;
console.log("✅ Order response:", order);

if (!order.success || !order.razorpayOrderId) {
alert("Order failed to initialize.");
return;
}

const options = {
key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Use correct env variable
amount: order.amount,
currency: order.currency,
name: "GetMeds",
description: "Medicine Order",
order_id: order.razorpayOrderId,
handler: function (response) {
alert("✅ Payment successful!");
window.location.href = order.frontendRedirectSuccess;
},
prefill: {
name: `${data.firstName} ${data.lastName}`,
email: data.email,
contact: data.phone
},
notes: {
address: `${data.street}, ${data.city}, ${data.state} - ${data.zipcode}`
},
theme: {
color: "#3399cc"
}
};

const rzp = new window.Razorpay(options);
rzp.on("payment.failed", function () {
window.location.href = order.frontendRedirectFailure;
});

rzp.open();
} catch (err) {
console.error("❌ Order placement error:", err?.response?.data || err.message);
alert("Something went wrong. Check console for details.");
}
};

useEffect(() => {
if (!token) {
alert("Please log in to continue");
return;
} else if (getTotalCartAmount() === 0) {
navigate('/cart');
}
}, [token, navigate]);


return (
<form onSubmit={placeOrder} className='place-order'>
<div className="place-order-left">
<p className="title">Delivery Information</p>
<div className="multi-fields">
<input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder=' First Name' required />
<input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder=' Last Name' required />
</div>
<input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder=' Email Id' required />
<input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder=' Street' required />
<div className="multi-fields">
<input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder=' City' required />
<input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder=' State' required />
</div>
<div className="multi-fields">
<input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder=' Pincode' required />
<input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder=' Country' required />
</div>
<input name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder=' Phone Number' required />
</div>

<div className="place-order-right">
<div className="cart-total">
<h2>Cart Totals</h2>
<div className="cart-total-details">
<p>Sub Total</p>
<p>₹{getTotalCartAmount()}</p>
</div>
<hr />
<div className="cart-total-details">
<p>Delivery Fee</p>
<p>₹{deliveryFee}</p>
</div>
<hr />
<div className="cart-total-details">
<b>Total</b>
<b>₹{totalAmount + deliveryFee}</b>
</div>
<button type='submit'>PROCEED TO PAYMENT</button>
</div>
</div>
</form>
);
};

export default PlaceOrder;