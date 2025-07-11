import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import vehicleService from '../services/vehicleService';
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
      const analyticsData = adminService.getBusinessAnalytics();
      const allUsers = adminService.getAllUsers();
      const allBookings = adminService.getAllBookings();
      const allPayments = adminService.getAllPayments();
      const allVehicles = vehicleService.getAllVehicles();
      const adminNotifications = adminService.getAdminNotifications();

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
      adminService.updateUser(userId, { status: newStatus });
      loadDashboardData();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      if (newStatus === 'cancelled') {
        adminService.cancelBooking(bookingId, 'Admin cancellation');
      } else if (newStatus === 'completed') {
        adminService.completeBooking(bookingId);
      } else {
        adminService.updateBooking(bookingId, { status: newStatus });
      }
      loadDashboardData();
      toast.success('Booking status updated successfully');
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const exportData = () => {
    try {
      const data = adminService.exportAllData();
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
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="action-btn export" onClick={exportData}>
            📊 Export Data
          </button>
          <button className="action-btn refresh" onClick={loadDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="admin-notifications">
          {notifications.map((notification, index) => (
            <div key={index} className={`notification-item ${notification.type}`}>
              <span className="notification-icon">
                {notification.type === 'error' ? '🚨' : 
                 notification.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{analytics.revenue?.total?.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{analytics.bookings?.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{analytics.users?.total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>{analytics.vehicles?.total}</h3>
            <p>Total Vehicles</p>
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
                  <span>₹{analytics.revenue?.total?.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span>Average Booking:</span>
                  <span>₹{analytics.revenue?.average?.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span>Success Rate:</span>
                  <span>{analytics.bookings?.successRate?.toFixed(1)}%</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Vehicle Performance</h3>
                <div className="metric">
                  <span>Utilization Rate:</span>
                  <span>{analytics.vehicles?.utilizationRate?.toFixed(1)}%</span>
                </div>
                <div className="metric">
                  <span>Available:</span>
                  <span>{analytics.vehicles?.available}</span>
                </div>
                <div className="metric">
                  <span>Rented:</span>
                  <span>{analytics.vehicles?.rented}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="recent-activity">
                  {analytics.activity?.recentBookings?.slice(0, 3).map(booking => (
                    <div key={booking.id} className="activity-item">
                      <span>📋 Booking #{booking.id}</span>
                      <span className="activity-status">{booking.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <h3>Top Performing Vehicles</h3>
                <div className="top-vehicles">
                  {analytics.vehicles?.topPerformers?.slice(0, 3).map(vehicle => (
                    <div key={vehicle.id} className="vehicle-item">
                      <span>{vehicle.name}</span>
                      <span>₹{vehicle.totalEarnings?.toLocaleString()}</span>
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