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
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('🔍 Available users:', users.map(u => ({ email: u.email, role: u.role })));
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        console.log('🔐 Login successful for user:', user);
        console.log('🔐 User role:', user.role);
        console.log('🔐 User isAdmin:', user.isAdmin);
        
        // Handle "Remember Me" functionality
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ email: user.email }));
          // Set a longer session duration (30 days)
          const sessionExpiry = new Date();
          sessionExpiry.setDate(sessionExpiry.getDate() + 30);
          localStorage.setItem('sessionExpiry', sessionExpiry.toISOString());
        } else {
          // Clear remembered user if not checked
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('sessionExpiry');
        }

        // Store current user session
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Set session expiry for current login
        const currentSessionExpiry = new Date();
        currentSessionExpiry.setHours(currentSessionExpiry.getHours() + 24); // 24 hours
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
        console.log('❌ Login failed - invalid credentials');
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="switch-text">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
        
        {/* Temporary admin setup button for testing */}
        <button 
          type="button" 
          onClick={handleSetupAdmin}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔧 Setup Admin User
        </button>
        
        {/* Debug button to show current users */}
        <button 
          type="button" 
          onClick={() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('🔍 Current users in localStorage:', users);
            alert(`Current users: ${users.length}\n${users.map(u => `${u.email} (${u.role})`).join('\n')}`);
          }}
          style={{
            marginTop: '5px',
            padding: '8px 16px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔍 Debug Users
        </button>
      </form>
    </div>
  );
}

export default Login;
