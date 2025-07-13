import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import vehicleService from '../../services/vehicleService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    try {
      const analyticsData = adminService.getDashboardStats();
      const allUsers = adminService.getUsers();
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      const allVehicles = vehicleService.getAllVehicles();
      const adminNotifications = adminService.getSystemAlerts();

      setAnalytics(analyticsData);
      setUsers(allUsers);
      setBookings(allBookings);
      setPayments(allPayments);
      setVehicles(allVehicles);
      setNotifications(adminNotifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return '#2e7d32';
      case 'pending':
        return '#f57c00';
      case 'cancelled':
      case 'inactive':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
      case 'inactive':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      adminService.updateUserStatus(userId, newStatus);
      loadDashboardData();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      // Update booking status in localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = newStatus;
        if (newStatus === 'cancelled') {
          bookings[bookingIndex].cancellationReason = 'Admin cancellation';
        }
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadDashboardData();
        toast.success('Booking status updated successfully');
      } else {
        toast.error('Booking not found');
      }
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const exportData = () => {
    try {
      const data = {
        users: JSON.parse(localStorage.getItem('users') || '[]'),
        vehicles: JSON.parse(localStorage.getItem('vehicles') || '[]'),
        bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
        payments: JSON.parse(localStorage.getItem('payments') || '[]'),
        drivers: JSON.parse(localStorage.getItem('drivers') || '[]'),
        analytics: adminService.getDashboardStats(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your e-riksha rental business</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportData}>
            📊 Export Data
          </button>
          <button className="btn btn-secondary" onClick={loadDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {notifications.length > 0 && (
        <div className="alerts-section">
          <h3>🚨 System Alerts</h3>
          <div className="alerts-grid">
            {notifications.map((notification, index) => (
              <div key={index} className={`alert-card ${notification.type}`}>
                <span className="alert-icon">
                  {notification.type === 'error' ? '🚨' : 
                   notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div className="alert-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="alert-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <h3>₹{analytics.totalRevenue?.toLocaleString() || '0'}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">+{analytics.revenueThisMonth || 0} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bookings">📋</div>
          <div className="stat-content">
            <h3>{analytics.totalBookings || 0}</h3>
            <p>Total Bookings</p>
            <span className="stat-change positive">+{analytics.bookingsThisMonth || 0} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>{analytics.totalUsers || 0}</h3>
            <p>Total Users</p>
            <span className="stat-change positive">+{analytics.newUsersThisMonth || 0} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon vehicles">🚗</div>
          <div className="stat-content">
            <h3>{analytics.totalVehicles || 0}</h3>
            <p>Total Vehicles</p>
            <span className="stat-change positive">{analytics.availableVehicles || 0} available</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💰 Payments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          🚗 Vehicles
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Revenue Analytics</h3>
                <div className="metric">
                  <span>Total Revenue:</span>
                  <span>₹{analytics.totalRevenue?.toLocaleString() || '0'}</span>
                </div>
                <div className="metric">
                  <span>Monthly Revenue:</span>
                  <span>₹{analytics.revenueThisMonth?.toLocaleString() || '0'}</span>
                </div>
                <div className="metric">
                  <span>Growth Rate:</span>
                  <span>{analytics.growthRate || 0}%</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Vehicle Performance</h3>
                <div className="metric">
                  <span>Total Vehicles:</span>
                  <span>{analytics.totalVehicles || 0}</span>
                </div>
                <div className="metric">
                  <span>Available:</span>
                  <span>{analytics.availableVehicles || 0}</span>
                </div>
                <div className="metric">
                  <span>Active Drivers:</span>
                  <span>{analytics.activeDrivers || 0}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="recent-activity">
                  {bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="activity-item">
                      <span>📋 Booking #{booking.id}</span>
                      <span className={`activity-status ${booking.status}`}>{booking.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <h3>Top Performing Vehicles</h3>
                <div className="top-vehicles">
                  {vehicles.slice(0, 3).map(vehicle => (
                    <div key={vehicle.id} className="vehicle-item">
                      <span>{vehicle.name}</span>
                      <span>₹{vehicle.totalEarnings?.toLocaleString() || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(user.status || 'active') }}
                        >
                          {getStatusIcon(user.status || 'active')} {user.status || 'active'}
                        </span>
                      </td>
                      <td>{format(new Date(user.createdAt || user.joiningDate), 'MMM dd, yyyy')}</td>
                      <td>
                        <select
                          value={user.status || 'active'}
                          onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-tab">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.name}</td>
                      <td>{vehicles.find(v => v.id === booking.rikshaId)?.name || 'N/A'}</td>
                      <td>{booking.date}</td>
                      <td>₹{booking.amount || 'N/A'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(booking.status) }}
                        >
                          {getStatusIcon(booking.status)} {booking.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="payments-tab">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.paymentId}>
                      <td>#{payment.paymentId.slice(-8)}</td>
                      <td>{payment.bookingData?.name}</td>
                      <td>{payment.vehicle?.name}</td>
                      <td>₹{payment.amount}</td>
                      <td>{format(new Date(payment.timestamp), 'MMM dd, yyyy HH:mm')}</td>
                      <td>
                        <span className="status-badge success">
                          ✅ Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="vehicles-tab">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Earnings</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.name}</td>
                      <td>
                        <span className="type-badge">{vehicle.type}</span>
                      </td>
                      <td>{vehicle.driverName}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(vehicle.status) }}
                        >
                          {getStatusIcon(vehicle.status)} {vehicle.status}
                        </span>
                      </td>
                      <td>₹{vehicle.totalEarnings?.toLocaleString()}</td>
                      <td>⭐ {vehicle.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 