import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./LoginPopup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onLogin = async () => {
    try {
      const res = await axios.post(`${url}/api/user/login`, formData);
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);

        toast.success("Login successful");

        if (res.data.user.role === "admin") {
          navigate("/admin/add"); 
        } else {
          setShowLogin(false); 
        }

      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login error");
    }
  };

  const onRegister = async () => {
    try {
      const res = await axios.post(`${url}/api/user/register`, formData);
      if (res.data.success) {
        toast.success("Registration successful");
        setCurrState("Login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration error");
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src="/close-icon.png" alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Register" && (
            <input name="name" onChange={onChangeHandler} value={formData.name} type="text" placeholder="Your name" />
          )}
          <input name="email" onChange={onChangeHandler} value={formData.email} type="email" placeholder="Your email" />
          <input name="password" onChange={onChangeHandler} value={formData.password} type="password" placeholder="Password" />
        </div>
        <button onClick={currState === "Login" ? onLogin : onRegister}>
          {currState === "Login" ? "Login" : "Create Account"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <p>
          {currState === "Login" ? "Create a new account" : "Already have an account?"}
          <span onClick={() => setCurrState(currState === "Login" ? "Register" : "Login")}>
            {currState === "Login" ? "Click here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
