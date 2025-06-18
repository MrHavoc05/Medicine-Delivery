import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:3000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [guestId, setGuestId] = useState(localStorage.getItem("guestId") || "");
  const [cartItems, setCartItems] = useState({});
  const [medicine_list, setMedicineList] = useState([]);

  // Initialize guest ID if not already present
  useEffect(() => {
    if (!guestId && !token) {
      const newGuestId = uuidv4();
      localStorage.setItem("guestId", newGuestId);
      setGuestId(newGuestId);
    }
  }, [guestId, token]);

  // Fetch medicine list
  const fetchMedicineList = async () => {
    try {
      const res = await axios.get(`${url}/api/medicine/list`);
      setMedicineList(res.data.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch medicines", error);
    }
  };

  // Load cart (either user or guest)
  const loadCartData = async (activeToken = token, activeGuestId = guestId) => {
    try {
      if (activeToken) {
        const res = await axios.get(`${url}/api/cart/get`, {
          headers: { token: activeToken },
        });
        setCartItems(res.data.cartData || {});
      } else if (activeGuestId) {
        const res = await axios.get(`${url}/api/guest-cart/get`, {
          params: { guestId: activeGuestId },
        });
        setCartItems(res.data.cartData || {});
      } else {
        setCartItems({});
      }
    } catch (err) {
      console.error("❌ Failed to load cart data", err);
      setCartItems({});
    }
  };

  // On login
  const handleLoginToken = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const storedGuestId = localStorage.getItem("guestId");
    if (storedGuestId) {
      try {
        await axios.post(`${url}/api/cart/merge-from-guest`, {
          guestId: storedGuestId,
        }, {
          headers: { token: newToken },
        });

        localStorage.removeItem("guestId");
        setGuestId("");
      } catch (err) {
        console.error("❌ Failed to merge guest cart", err);
      }
    }

    setCartItems({});
    await loadCartData(newToken, null);
    window.location.reload();
  };

  // On logout
 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("cartItems"); 
  localStorage.removeItem("guestId");

  setToken("");
  setCartItems({});

  const newGuestId = uuidv4();
  localStorage.setItem("guestId", newGuestId);
  setGuestId(newGuestId);

  window.location.reload(); 
};


  // Add to cart
  const addToCart = async (itemId, quantity = 1) => {
    try {
      if (token) {
        const res = await axios.post(`${url}/api/cart/add`, { itemId, quantity }, {
          headers: { token },
        });
        setCartItems(res.data.cartData || {});
      } else {
        let activeGuestId = guestId || localStorage.getItem("guestId");
        if (!activeGuestId) {
          activeGuestId = uuidv4();
          localStorage.setItem("guestId", activeGuestId);
          setGuestId(activeGuestId);
        }

        const res = await axios.post(`${url}/api/guest-cart/add`, {
          sessionId: activeGuestId,
          itemId,
          quantity,
        });

        setCartItems(res.data.cartData || {});
      }
    } catch (err) {
      console.error("❌ Failed to add to cart", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    try {
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { token },
        });
      } else if (guestId) {
        await axios.post(`${url}/api/guest-cart/remove`, {
          sessionId: guestId,
          productId: itemId,
        });
      }
    } catch (err) {
      console.error("❌ Failed to remove from cart", err);
    }
  };

  const getTotalCartAmount = () => {
    if (!medicine_list) return 0;
    return Object.entries(cartItems).reduce((sum, [itemId, qty]) => {
      const product = medicine_list.find(p => p._id === itemId);
      return product ? sum + qty * product.price : sum;
    }, 0);
  };

  useEffect(() => {
    fetchMedicineList();

    const storedToken = localStorage.getItem("token");
    const storedGuestId = localStorage.getItem("guestId");

    if (storedToken) {
      loadCartData(storedToken, null);
    } else if (storedGuestId) {
      loadCartData(null, storedGuestId);
    } else {
      setCartItems({});
    }
  }, []);

  const contextValue = {
    medicine_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    handleLoginToken,
    handleLogout,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
