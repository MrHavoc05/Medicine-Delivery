import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css'; 
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/admin-auth/login`, {
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/add');
      } else {
        alert(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login error');
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
