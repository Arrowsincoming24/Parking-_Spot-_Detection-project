import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin({ setAuth }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Simple client-side validation
    if (username === 'admin' && password === 'admin123') {
      setAuth(true);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use username: admin, password: admin123');
    }
  };

  return (
    <div className="admin-login-page">
      <button className="btn-back-login" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Home
      </button>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <Shield size={64} />
          </div>
          
          <h1>Admin Login</h1>
          <p className="login-subtitle">Secure access to parking management</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-login">
              Login to Dashboard
            </button>
          </form>

          <div className="login-hint">
            <p>🔐 Demo Credentials:</p>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
