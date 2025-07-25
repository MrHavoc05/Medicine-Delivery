import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
const { url, token } = useContext(StoreContext);
const [data, setData] = useState([]);

const fetchOrders = async () => {
try {
if (!url || typeof url !== 'string') {
console.error("Invalid or missing URL from context:", url);
return;
}

const fullUrl = url.endsWith('/') ? `${url}api/order/userorders` : `${url}/api/order/userorders`;

const response = await axios.post(fullUrl, {}, {
headers: { token }
});

setData(response.data.data);
} catch (err) {
console.error("Error fetching orders:", err);
}
};

useEffect(() => {
if (token) {
fetchOrders();
}
}, [token]);

return (
<div className='my-orders'>
<h2>My Orders</h2>
<div className="container">
{data.map((order,index)=>{
return (
<div key={index} className="my-orders-order">
<img src={assets.parcel_icon} alt="" />
<p> {order.items.map((item,index)=>{
if (index === order.items.length-1){
return item.name + " × " + item.quantity

}
else{
return item.name + " × " + item.quantity+", "
}
})}</p>
<p>₹{order.amount}.00 </p>
<p>Items: {order.items.length}</p>
<p><span>&#x25cf;</span><b>{order.status}</b></p>
<button onClick={fetchOrders}>Track Order</button>
</div>
)
})}
</div>
</div>
);
};

export default MyOrders; 
