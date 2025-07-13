import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaStar, FaCar, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaChartLine, FaTrophy, FaEdit, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import driverService from '../../services/driverService';
import vehicleService from '../../services/vehicleService';
import toast from 'react-hot-toast';
import '../../CSS/DriverDashboard.css';

const DriverDashboard = ({ driverId }) => {
  const [driver, setDriver] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [assignedVehicle, setAssignedVehicle] = useState(null);
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (driverId) {
      loadDriverData();
    }
  }, [driverId]);

  const loadDriverData = () => {
    setLoading(true);
    try {
      const driverData = driverService.getDriverById(driverId);
      const dashboardData = driverService.getDriverDashboardData(driverId);
      const vehicleData = driverData.vehicleId ? vehicleService.getVehicleById(driverData.vehicleId) : null;
      const earningsData = driverService.getDriverEarnings(driverId).slice(-5);

      setDriver(driverData);
      setDashboardData(dashboardData);
      setAssignedVehicle(vehicleData);
      setRecentEarnings(earningsData);
    } catch (error) {
      toast.error('Error loading driver data');
      console.error('Error loading driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = (newAvailability) => {
    try {
      driverService.updateDriverAvailability(driverId, newAvailability);
      setDriver({ ...driver, availability: newAvailability });
      toast.success(`Availability updated to ${newAvailability}`);
    } catch (error) {
      toast.error('Error updating availability');
    }
  };

  const exportEarningsReport = () => {
    const earnings = driverService.getDriverEarnings(driverId);
    const csvContent = [
      ['Date', 'Amount', 'Trip ID', 'Status'],
      ...earnings.map(earning => [
        new Date(earning.date).toLocaleDateString(),
        earning.amount,
        earning.tripId || 'N/A',
        earning.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${driver.name}_earnings_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Earnings report exported successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'suspended': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'text-green-600';
      case 'expired': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="driver-dashboard">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="driver-dashboard">
        <div className="error-message">
          <h2>Driver not found</h2>
          <p>The requested driver information could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="driver-profile-header">
          <img src={driver.profileImage} alt={driver.name} className="profile-image" />
          <div className="profile-info">
            <h1>{driver.name}</h1>
            <p className="driver-id">Driver ID: {driver.id}</p>
            <div className="status-badges">
              <span className={`status-badge ${driver.status}`}>{driver.status}</span>
              <span className={`availability-badge ${driver.availability}`}>{driver.availability}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={exportEarningsReport}
          >
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>{driver.rating}</h3>
            <p>Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCar />
          </div>
          <div className="stat-content">
            <h3>{driver.totalTrips}</h3>
            <p>Total Trips</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>₹{driver.totalEarnings.toLocaleString()}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{driver.experience}</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUser /> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          <FaMoneyBillWave /> Earnings
        </button>
        <button 
          className={`tab ${activeTab === 'vehicle' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicle')}
        >
          <FaCar /> Vehicle
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <FaChartLine /> Performance
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-content">
          <div className="overview-grid">
            {/* Personal Information */}
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <FaPhone />
                  <span>{driver.phone}</span>
                </div>
                <div className="info-item">
                  <FaEnvelope />
                  <span>{driver.email}</span>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt />
                  <span>{driver.address}</span>
                </div>
                <div className="info-item">
                  <FaIdCard />
                  <span>{driver.licenseNumber}</span>
                </div>
                <div className="info-item">
                  <FaCalendarAlt />
                  <span>License Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <FaCalendarAlt />
                  <span>Joined: {new Date(driver.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Skills & Languages */}
            <div className="info-card">
              <h3>Skills & Languages</h3>
              <div className="skills-section">
                <h4>Vehicle Skills:</h4>
                <div className="skills-tags">
                  {driver.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="languages-section">
                <h4>Languages:</h4>
                <div className="skills-tags">
                  {driver.languages.map(lang => (
                    <span key={lang} className="skill-tag">{lang}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="info-card">
              <h3>Documents</h3>
              <div className="documents-list">
                {Object.entries(driver.documents).map(([doc, status]) => (
                  <div key={doc} className="document-item">
                    <span className="doc-name">{doc.charAt(0).toUpperCase() + doc.slice(1)}:</span>
                    <span className={`doc-status ${getDocumentStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Control */}
            <div className="info-card">
              <h3>Availability Control</h3>
              <div className="availability-controls">
                <button 
                  className={`availability-btn ${driver.availability === 'available' ? 'active' : ''}`}
                  onClick={() => updateAvailability('available')}
                >
                  <FaCheck /> Available
                </button>
                <button 
                  className={`availability-btn ${driver.availability === 'busy' ? 'active' : ''}`}
                  onClick={() => updateAvailability('busy')}
                >
                  <FaClock /> Busy
                </button>
                <button 
                  className={`availability-btn ${driver.availability === 'unavailable' ? 'active' : ''}`}
                  onClick={() => updateAvailability('unavailable')}
                >
                  <FaTimes /> Unavailable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="earnings-content">
          <div className="earnings-overview">
            <div className="earnings-card">
              <h3>Monthly Earnings</h3>
              <div className="earnings-amount">
                ₹{dashboardData?.monthlyEarnings?.toLocaleString() || 0}
              </div>
            </div>
            <div className="earnings-card">
              <h3>Weekly Stats</h3>
              <div className="weekly-stats">
                <div className="stat-item">
                  <span>Total Earnings:</span>
                  <span>₹{dashboardData?.weeklyStats?.totalEarnings?.toLocaleString() || 0}</span>
                </div>
                <div className="stat-item">
                  <span>Total Trips:</span>
                  <span>{dashboardData?.weeklyStats?.totalTrips || 0}</span>
                </div>
                <div className="stat-item">
                  <span>Average per Trip:</span>
                  <span>₹{dashboardData?.weeklyStats?.averagePerTrip?.toFixed(2) || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-earnings">
            <h3>Recent Earnings</h3>
            <div className="earnings-list">
              {recentEarnings.length > 0 ? (
                recentEarnings.map(earning => (
                  <div key={earning.id} className="earning-item">
                    <div className="earning-date">
                      {new Date(earning.date).toLocaleDateString()}
                    </div>
                    <div className="earning-amount">
                      ₹{earning.amount.toLocaleString()}
                    </div>
                    <div className="earning-status">
                      <span className={`status-badge ${earning.status}`}>
                        {earning.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-earnings">
                  <FaMoneyBillWave />
                  <p>No recent earnings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Tab */}
      {activeTab === 'vehicle' && (
        <div className="vehicle-content">
          {assignedVehicle ? (
            <div className="vehicle-assignment">
              <div className="vehicle-card">
                <img src={assignedVehicle.image} alt={assignedVehicle.name} className="vehicle-image" />
                <div className="vehicle-details">
                  <h3>{assignedVehicle.name}</h3>
                  <p className="vehicle-type">{assignedVehicle.type}</p>
                  <p className="vehicle-status">Status: {assignedVehicle.status}</p>
                  <div className="vehicle-specs">
                    <div className="spec-item">
                      <span>Hourly Rate:</span>
                      <span>₹{assignedVehicle.hourlyRate}</span>
                    </div>
                    <div className="spec-item">
                      <span>Daily Rate:</span>
                      <span>₹{assignedVehicle.dailyRate}</span>
                    </div>
                    <div className="spec-item">
                      <span>Fuel Type:</span>
                      <span>{assignedVehicle.fuelType}</span>
                    </div>
                    <div className="spec-item">
                      <span>Capacity:</span>
                      <span>{assignedVehicle.capacity} passengers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-vehicle">
              <FaCar />
              <h3>No Vehicle Assigned</h3>
              <p>You are not currently assigned to any vehicle.</p>
            </div>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="performance-content">
          <div className="performance-metrics">
            <div className="metric-card">
              <h3>Performance Rating</h3>
              <div className="rating-display">
                <FaStar className="star-icon" />
                <span className="rating-value">{driver.rating}</span>
                <span className="rating-max">/ 5.0</span>
              </div>
              <p>Based on {driver.totalTrips} trips</p>
            </div>
            
            <div className="metric-card">
              <h3>Commission Rate</h3>
              <div className="commission-rate">
                {driver.commission}%
              </div>
              <p>Your earnings percentage</p>
            </div>

            <div className="metric-card">
              <h3>Experience Level</h3>
              <div className="experience-level">
                {driver.experience} years
              </div>
              <p>Professional experience</p>
            </div>
          </div>

          <div className="performance-chart">
            <h3>Performance Trends</h3>
            <div className="chart-placeholder">
              <FaChartLine />
              <p>Performance analytics chart will be displayed here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard; 