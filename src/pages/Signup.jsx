import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Auth.css';

function Signup() {
  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form className="auth-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Signup</button>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
