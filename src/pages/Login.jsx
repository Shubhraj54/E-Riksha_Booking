import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setupAdminUser } from '../utils/adminSetup';
import '../CSS/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for remembered user on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        setEmail(userData.email);
        setRememberMe(true);
        toast.success('Welcome back! Your email has been filled in.');
      } catch (error) {
        console.error('Error parsing remembered user:', error);
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  // Initialize users in localStorage from users.json if not present
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      fetch('/src/data/users.json')
        .then(res => res.json())
        .then(data => {
          // Add admin user to the existing data
          const adminUser = {
            id: 999,
            name: 'Admin User',
            email: 'admin@eriksha.com',
            password: 'admin123',
            role: 'admin',
            isAdmin: true,
            status: 'active',
            joiningDate: '2024-01-01',
            birthdate: '1990-01-01',
            address: 'Admin Address',
            phone: '9876543210',
            gender: 'Male',
            createdAt: new Date('2024-01-01').toISOString()
          };
          
          const allUsers = [...data, adminUser];
          localStorage.setItem('users', JSON.stringify(allUsers));
          console.log('✅ Users initialized with admin user');
        })
        .catch(error => {
          console.error('Error loading users:', error);
          // Fallback: create admin user if file loading fails
          const adminUser = {
            id: 999,
            name: 'Admin User',
            email: 'admin@eriksha.com',
            password: 'admin123',
            role: 'admin',
            isAdmin: true,
            status: 'active',
            joiningDate: '2024-01-01',
            birthdate: '1990-01-01',
            address: 'Admin Address',
            phone: '9876543210',
            gender: 'Male',
            createdAt: new Date('2024-01-01').toISOString()
          };
          localStorage.setItem('users', JSON.stringify([adminUser]));
          console.log('✅ Admin user created as fallback');
        });
    } else {
      console.log('✅ Users already exist in localStorage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use localStorage (only)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Handle "Remember Me" functionality
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ email: user.email }));
          const sessionExpiry = new Date();
          sessionExpiry.setDate(sessionExpiry.getDate() + 30);
          localStorage.setItem('sessionExpiry', sessionExpiry.toISOString());
        } else {
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('sessionExpiry');
        }

        // Store current user session
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Set session expiry for current login
        const currentSessionExpiry = new Date();
        currentSessionExpiry.setHours(currentSessionExpiry.getHours() + 24);
        localStorage.setItem('currentSessionExpiry', currentSessionExpiry.toISOString());
        
        toast.success('Login successful! Welcome back!');
        
        // Check if user is admin and redirect accordingly
        const isAdminUser = user.role === 'admin' || user.isAdmin === true || user.email?.toLowerCase().includes('admin');
        console.log('🔐 Is admin user:', isAdminUser);
        
        if (isAdminUser) {
          console.log('🔐 Redirecting to admin dashboard...');
          setTimeout(() => navigate('/admin'), 1200);
        } else {
          console.log('🔐 Redirecting to home...');
          setTimeout(() => navigate('/'), 1200);
        }
      } else {
        console.log('❌ LocalStorage login failed - invalid credentials');
        toast.error('Invalid email or password.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Password reset functionality will be implemented soon!', {
      icon: '🔧',
      duration: 4000,
    });
  };

  const handleSetupAdmin = () => {
    const success = setupAdminUser();
    if (success) {
      toast.success('Admin user created! You can now login with admin@eriksha.com / admin123');
    } else {
      toast.error('Failed to create admin user');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <div className="auth-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <span>Remember me</span>
          </label>
          <button 
            type="button" 
            className="forgot-password"
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        
        {/* Development Tools */}
        <div className="dev-tools">
          <button 
            type="button" 
            className="dev-button"
            onClick={handleSetupAdmin}
            disabled={isLoading}
          >
            Setup Admin User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
