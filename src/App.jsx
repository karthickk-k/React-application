import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'Admin' && password === '1234') {
      alert('Login Successful');
    } else {
      alert('Invalid Username or Password');
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="title">Login</div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>User Name</label>
            <input
              type="text"
              placeholder="Enter the name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter the password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;