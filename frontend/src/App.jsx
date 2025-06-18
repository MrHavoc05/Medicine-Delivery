import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import {StoreContextProvider} from './context/StoreContext.jsx'; // ✅ Import the context provider
import Footer from './components/Footer/Footer.jsx';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import { useState } from 'react';
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders.jsx';

const App = () => {

const [showLogin,setShowLogin] = useState(false);

return (
<>
{showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
<StoreContextProvider> {/* ✅ Wrap the entire app */}
<div className='App'>
<Navbar setShowLogin={setShowLogin}/>
<Routes>
<Route path='/' element={<Home />} />
<Route path='/cart' element={<Cart />} />
<Route path='/placeorder' element={<PlaceOrder />} />
<Route path='/verify' element={<Verify />} />
<Route path='/myorders' element={<MyOrders />} />

</Routes>
</div>
</StoreContextProvider>
<Footer />
</>
);
};

export default App;