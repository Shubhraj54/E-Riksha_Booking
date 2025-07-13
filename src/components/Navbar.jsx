import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import React, { useState, useEffect, useMemo } from 'react';
import { getCurrentUser, clearSession, setupSessionMonitoring } from '../utils/sessionManager';
import NotificationBell from './NotificationBell';
import ProfileAvatar from './ProfileAvatar';
import toast from 'react-hot-toast';

function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  // Apply theme on load/change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Session and auth initialization
  useEffect(() => {
    const user = getCurrentUser();
    setAuthUser(user);

    const cleanup = setupSessionMonitoring(() => {
      setAuthUser(null);
      toast.error('Your session has expired. Please login again.');
      navigate('/login');
    });

    return cleanup;
  }, [navigate]);

  // Sync login/logout between tabs
  useEffect(() => {
    const syncAuth = () => setAuthUser(getCurrentUser());
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  // Determine admin access
  const isAdmin = useMemo(() => {
    return authUser && (
      authUser.email?.toLowerCase().includes('admin') ||
      authUser.role === 'admin' ||
      authUser.isAdmin === true
    );
  }, [authUser]);

  // Debug (dev only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Navbar - Auth user:', authUser);
    console.log('🔍 Navbar - Is admin:', isAdmin);
  }

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
    setMenuOpen(false);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
      {/* <Link to="/vehicle-management" onClick={() => setMenuOpen(false)}>Fleet Management</Link> */}
      {isAdmin && <Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
      <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
      <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
    </>
  );

  const AuthButtons = ({ isMobile = false }) => {
    const classSuffix = isMobile ? 'mobile-only' : 'desktop-only';
    return !authUser ? (
      <>
        <Link to="/ride" className={`btn  ${classSuffix}`} onClick={() => setMenuOpen(false)}>Book Ride</Link>
        <Link to="/login" className={`btn  ${classSuffix}`} onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/signup" className={`btn signup-btn ${classSuffix}`} onClick={() => setMenuOpen(false)}>Signup</Link>
      </>
    ) : (
      <>
        {isMobile && (
          <div className="mobile-notification-bell"><NotificationBell /></div>
        )}
        {!isMobile && <NotificationBell />}
        <ProfileAvatar 
          user={authUser} 
          onClick={() => setMenuOpen(false)}
          onLogout={handleLogout}
          className={classSuffix}
        />
      </>
    );
  };

  const ThemeToggle = ({ isMobile = false }) => (
    <button
      className={`theme-toggle-btn ${isMobile ? 'mobile-only' : 'desktop-only'}`}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark(prev => !prev)}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <div className="logo">Logo</div>
        <div className="nav-links"><NavLinks /></div>
      </div>
      <div className="auth-buttons">
        <AuthButtons />
        <ThemeToggle />
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(prev => !prev)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" role="menu" aria-label="Mobile navigation">
          <NavLinks />
          <AuthButtons isMobile />
          <ThemeToggle isMobile />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
