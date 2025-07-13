import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCar, FaUserTie, FaCalendarAlt, FaCreditCard, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { getCurrentUser, clearSession } from '../../utils/sessionManager';
import toast from 'react-hot-toast';
import '../CSS/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || (user.role !== 'admin' && !user.isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }
    setAdminUser(user);
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    setAdminUser(null);
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/driver-management', icon: <FaUserTie />, label: 'Driver Management' },
    { path: '/admin/vehicle-management', icon: <FaCar />, label: 'Vehicle Management' },
    { path: '/admin/bookings', icon: <FaCalendarAlt />, label: 'Bookings' },
    { path: '/admin/payments', icon: <FaCreditCard />, label: 'Payments' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  if (!adminUser) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <FaTachometerAlt />
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <FaUserCircle />
          </div>
          <div className="admin-info">
            <h4>{adminUser.name}</h4>
            <p>{adminUser.email}</p>
            <span className="admin-badge">Administrator</span>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 