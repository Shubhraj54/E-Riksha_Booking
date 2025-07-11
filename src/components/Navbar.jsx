import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import React, { useState, useEffect } from 'react';

function Navbar() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('authUser'));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Listen for login/logout changes in localStorage
  useEffect(() => {
    const syncAuth = () => {
      setAuthUser(JSON.parse(localStorage.getItem('authUser')));
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Close menu on route change or window resize
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Logo</div>
        <div className="nav-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      </div>
      <div className="auth-buttons">
        {!authUser ? (
          <>
            <Link to="/login" className="btn login-btn desktop-only">Login</Link>
            <Link to="/signup" className="btn signup-btn desktop-only">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn profile-btn desktop-only">Profile</Link>
            <button className="btn logout-btn desktop-only" onClick={handleLogout}>Logout</button>
          </>
        )}
        <button
          className="theme-toggle-btn desktop-only"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDark(d => !d)}
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(m => !m)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      {/* Mobile menu for nav links and auth */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {!authUser ? (
            <>
              <Link to="/login" className="btn login-btn mobile-only" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn signup-btn mobile-only" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn profile-btn mobile-only" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="btn logout-btn mobile-only" onClick={handleLogout}>Logout</button>
            </>
          )}
          <button
            className="theme-toggle-btn mobile-only"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDark(d => !d)}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
