import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const { getTotalCartAmount, token, handleLogout } = useContext(StoreContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();     
    navigate('/');      
  };

  const toggleProfileDropdown = () => {
    setProfileOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="logo" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href='#product-menu' onClick={() => setMenu("Products")} className={menu === "Products" ? "active" : ""}>Products</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
      </ul>

      <div className="navbar-rights">
        <img src={assets.search_icon} alt="search" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
            <div className="navbar-login-options">
              <button onClick={() => setShowLogin(true)}>Sign in</button>
              <button onClick={() => navigate("/admin-login")} className="admin-btn">Admin</button>
            </div>
          ) : (
          <div className='navbar-profile' ref={profileRef}>
            <img
              src={assets.profile_icon}
              alt="profile"
              onClick={toggleProfileDropdown}
              style={{ cursor: 'pointer' }}
            />
            {profileOpen && (
              <ul className="nav-profile-dropdown">
                <li onClick={()=> navigate('/myorders')}> <img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
