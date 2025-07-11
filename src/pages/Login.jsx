import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Initialize users in localStorage from users.json if not present
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      fetch('/src/data/users.json')
        .then(res => res.json())
        .then(data => localStorage.setItem('users', JSON.stringify(data)));
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('Invalid email or password.');
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <p className="switch-text">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
