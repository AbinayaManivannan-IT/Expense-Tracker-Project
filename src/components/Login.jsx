// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // if you want separate styling
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/users/login', {
        email,
        password,
      });
      const udata = await fetch(`http://localhost:8000/users?email=${email}`);
      const udataj = await udata.json(); 
      //console.log(udataj);
      const ubudget = await axios.get(`http://localhost:8000/budget?email=${email}`);
      const ubudgetj = ubudget.data;
      console.log(ubudgetj);
      localStorage.setItem("email", email);
      localStorage.setItem("name", udataj[0].name);
      localStorage.setItem("dailyLt",ubudgetj.dailyLt);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="form-style login-form-style" >
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
