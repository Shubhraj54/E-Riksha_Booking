import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../CSS/Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: '#ccc'
  });
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, feedback: '', color: '#ccc' });
      return;
    }

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Determine color and feedback
    let color = '#ccc';
    let strengthText = '';

    if (score <= 1) {
      color = '#ff4444';
      strengthText = 'Very Weak';
    } else if (score <= 2) {
      color = '#ff8800';
      strengthText = 'Weak';
    } else if (score <= 3) {
      color = '#ffbb33';
      strengthText = 'Fair';
    } else if (score <= 4) {
      color = '#00C851';
      strengthText = 'Good';
    } else {
      color = '#007E33';
      strengthText = 'Strong';
    }

    setPasswordStrength({
      score,
      feedback: feedback.join(', '),
      color,
      strengthText
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordStrength.score < 3) {
      toast.error('Please choose a stronger password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find(u => u.email === email)) {
        toast.error('Email already registered.');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        joiningDate: new Date().toISOString().split('T')[0]
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <div className="password-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                ></div>
              </div>
              <div className="strength-text" style={{ color: passwordStrength.color }}>
                {passwordStrength.strengthText}
              </div>
              {passwordStrength.feedback && (
                <div className="strength-feedback">
                  {passwordStrength.feedback}
                </div>
              )}
            </div>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Signup'}
        </button>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
