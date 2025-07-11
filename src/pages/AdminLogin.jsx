import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { setupAdminUser } from '../utils/adminSetup';
import toast from 'react-hot-toast';
import '../CSS/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure admin user exists
    setupAdminUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user && (user.role === 'admin' || user.isAdmin === true)) {
        // Store admin session
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Set session expiry
        const currentSessionExpiry = new Date();
        currentSessionExpiry.setHours(currentSessionExpiry.getHours() + 24);
        localStorage.setItem('currentSessionExpiry', currentSessionExpiry.toISOString());
        
        toast.success('Admin login successful!');
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        toast.error('Invalid admin credentials.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupAdmin = () => {
    const success = setupAdminUser();
    if (success) {
      toast.success('Admin user created! Use admin@eriksha.com / admin123');
    } else {
      toast.error('Failed to create admin user');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="admin-logo">
            <FaTachometerAlt />
            <h1>Admin Panel</h1>
          </div>
          <p>Sign in to access the admin dashboard</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eriksha.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock />
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button" 
            className="setup-admin-btn"
            onClick={handleSetupAdmin}
          >
            🔧 Setup Admin User
          </button>
          
          <button 
            type="button" 
            className="back-to-site-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Main Site
          </button>
        </div>

        <div className="admin-credentials">
          <h4>Default Admin Credentials:</h4>
          <div className="credential-item">
            <span>Email:</span>
            <code>admin@eriksha.com</code>
          </div>
          <div className="credential-item">
            <span>Password:</span>
            <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 