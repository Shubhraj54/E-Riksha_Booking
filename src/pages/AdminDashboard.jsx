import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaCalendarAlt, FaCreditCard, FaChartLine, FaUserTie, FaExclamationTriangle, FaCheckCircle, FaClock, FaDownload, FaCog } from 'react-icons/fa';
import adminService from '../services/adminService';
import driverService from '../services/driverService';
import vehicleService from '../services/vehicleService';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data
      const dashboardStats = adminService.getDashboardStats();
      const recentBookingsData = bookingService.getRecentBookings(5);
      const recentPaymentsData = paymentService.getRecentPayments(5);
      const systemAlerts = adminService.getSystemAlerts();

      setStats(dashboardStats);
      setRecentBookings(recentBookingsData);
      setRecentPayments(recentPaymentsData);
      setAlerts(systemAlerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportDashboardReport = () => {
    try {
      const reportData = {
        stats,
        recentBookings,
        recentPayments,
        alerts,
        generatedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_dashboard_report_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Dashboard report exported successfully');
    } catch (error) {
      toast.error('Error exporting report');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportDashboardReport}>
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
            <span className="stat-change positive">+{stats.newUsersThisMonth || 0} this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon vehicles">
            <FaCar />
          </div>
          <div className="stat-content">
            <h3>{stats.totalVehicles || 0}</h3>
            <p>Total Vehicles</p>
            <span className="stat-change positive">+{stats.availableVehicles || 0} available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBookings || 0}</h3>
            <p>Total Bookings</p>
            <span className="stat-change positive">+{stats.bookingsThisMonth || 0} this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaCreditCard />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">+₹{stats.revenueThisMonth?.toLocaleString() || 0} this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon drivers">
            <FaUserTie />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDrivers || 0}</h3>
            <p>Total Drivers</p>
            <span className="stat-change positive">+{stats.activeDrivers || 0} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon growth">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.growthRate || 0}%</h3>
            <p>Growth Rate</p>
            <span className="stat-change positive">+{stats.monthlyGrowth || 0}% this month</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3><FaExclamationTriangle /> System Alerts</h3>
          <div className="alerts-grid">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-card ${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'warning' && <FaExclamationTriangle />}
                  {alert.type === 'success' && <FaCheckCircle />}
                  {alert.type === 'info' && <FaClock />}
                </div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-section">
          <h3>Recent Bookings</h3>
          <div className="activity-list">
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <div key={booking.id} className="activity-item">
                  <div className="activity-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="activity-content">
                    <h4>Booking #{booking.id}</h4>
                    <p>{booking.customerName} - {booking.vehicleName}</p>
                    <span className="activity-time">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <FaCalendarAlt />
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Payments</h3>
          <div className="activity-list">
            {recentPayments.length > 0 ? (
              recentPayments.map(payment => (
                <div key={payment.id} className="activity-item">
                  <div className="activity-icon">
                    <FaCreditCard />
                  </div>
                  <div className="activity-content">
                    <h4>Payment #{payment.id}</h4>
                    <p>{payment.customerName} - ₹{payment.amount.toLocaleString()}</p>
                    <span className="activity-time">{new Date(payment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <FaCreditCard />
                <p>No recent payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/admin/users'}>
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/driver-management'}>
            <FaUserTie />
            <span>Manage Drivers</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/vehicle-management'}>
            <FaCar />
            <span>Manage Vehicles</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/bookings'}>
            <FaCalendarAlt />
            <span>View Bookings</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/payments'}>
            <FaCreditCard />
            <span>View Payments</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/settings'}>
            <FaCog />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 