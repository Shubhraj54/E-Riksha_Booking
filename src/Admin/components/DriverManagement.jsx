import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaStar, FaCar, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaDownload, FaEye, FaCheck, FaTimes, FaClock, FaChartLine, FaUsers, FaTrophy } from 'react-icons/fa';
import driverService from '../../services/driverService';
import vehicleService from '../../services/vehicleService';
import toast from 'react-hot-toast';
import '../../CSS/DriverManagement.css';

const DriverManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseExpiry: '',
    experience: 0,
    commission: 10,
    address: '',
    emergencyContact: '',
    skills: [],
    languages: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const driversData = driverService.getAllDrivers();
      const vehiclesData = vehicleService.getAllVehicles();
      const statsData = driverService.getDriverStats();

      setDrivers(driversData);
      setVehicles(vehiclesData);
      setStats(statsData);
    } catch (error) {
      toast.error('Error loading driver data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    const matchesAvailability = filterAvailability === 'all' || driver.availability === filterAvailability;
    
    return matchesSearch && matchesStatus && matchesAvailability;
  });

  const handleAddDriver = () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newDriver = driverService.addDriver(driverForm);
      setDrivers([...drivers, newDriver]);
      setShowAddModal(false);
      setDriverForm({
        name: '',
        phone: '',
        email: '',
        licenseNumber: '',
        licenseExpiry: '',
        experience: 0,
        commission: 10,
        address: '',
        emergencyContact: '',
        skills: [],
        languages: []
      });
      toast.success('Driver added successfully');
      loadData(); // Reload stats
    } catch (error) {
      toast.error('Error adding driver');
    }
  };

  const handleUpdateDriver = () => {
    if (!selectedDriver) return;

    try {
      const updatedDriver = driverService.updateDriver(selectedDriver.id, driverForm);
      setDrivers(drivers.map(d => d.id === selectedDriver.id ? updatedDriver : d));
      setShowEditModal(false);
      setSelectedDriver(null);
      toast.success('Driver updated successfully');
      loadData();
    } catch (error) {
      toast.error('Error updating driver');
    }
  };

  const handleDeleteDriver = (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        driverService.deleteDriver(driverId);
        setDrivers(drivers.filter(d => d.id !== driverId));
        toast.success('Driver deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Error deleting driver');
      }
    }
  };

  const handleAssignVehicle = (driverId, vehicleId) => {
    try {
      driverService.assignDriverToVehicle(driverId, vehicleId);
      setDrivers(drivers.map(d => 
        d.id === driverId ? { ...d, vehicleId } : d
      ));
      setShowAssignmentModal(false);
      toast.success('Vehicle assigned successfully');
    } catch (error) {
      toast.error('Error assigning vehicle');
    }
  };

  const handleUnassignVehicle = (driverId) => {
    try {
      driverService.unassignDriver(driverId);
      setDrivers(drivers.map(d => 
        d.id === driverId ? { ...d, vehicleId: null } : d
      ));
      toast.success('Vehicle unassigned successfully');
    } catch (error) {
      toast.error('Error unassigning vehicle');
    }
  };

  const handleStatusChange = (driverId, newStatus) => {
    try {
      driverService.updateDriver(driverId, { status: newStatus });
      setDrivers(drivers.map(d => 
        d.id === driverId ? { ...d, status: newStatus } : d
      ));
      toast.success(`Driver status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Error updating driver status');
    }
  };

  const handleAvailabilityChange = (driverId, newAvailability) => {
    try {
      driverService.updateDriverAvailability(driverId, newAvailability);
      setDrivers(drivers.map(d => 
        d.id === driverId ? { ...d, availability: newAvailability } : d
      ));
      toast.success(`Driver availability updated to ${newAvailability}`);
    } catch (error) {
      toast.error('Error updating driver availability');
    }
  };

  const exportDriverData = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'License', 'Status', 'Availability', 'Rating', 'Total Trips', 'Total Earnings'],
      ...filteredDrivers.map(driver => [
        driver.name,
        driver.phone,
        driver.email,
        driver.licenseNumber,
        driver.status,
        driver.availability,
        driver.rating,
        driver.totalTrips,
        driver.totalEarnings
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivers_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Driver data exported successfully');
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
      <div className="driver-management">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-tabs"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-management">
      {/* Header */}
      <div className="driver-header">
        <div className="header-content">
          <h1><FaUsers /> Driver Management</h1>
          <p>Manage your driver fleet, assignments, and performance</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Driver
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportDriverData}
          >
            <FaDownload /> Export Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="driver-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartLine /> Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          <FaUsers /> Drivers
        </button>
        <button 
          className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <FaCar /> Assignments
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <FaTrophy /> Performance
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.totalDrivers || 0}</h3>
                <p>Total Drivers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active">
                <FaCheck />
              </div>
              <div className="stat-content">
                <h3>{stats.activeDrivers || 0}</h3>
                <p>Active Drivers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon available">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>{stats.availableDrivers || 0}</h3>
                <p>Available Now</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon earnings">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalEarnings?.toLocaleString() || 0}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="top-performers">
            <h3><FaTrophy /> Top Performing Drivers</h3>
            <div className="performers-grid">
              {stats.topPerformers?.map((driver, index) => (
                <div key={driver.id} className="performer-card">
                  <div className="performer-rank">#{index + 1}</div>
                  <img src={driver.profileImage} alt={driver.name} className="performer-image" />
                  <div className="performer-info">
                    <h4>{driver.name}</h4>
                    <div className="performer-stats">
                      <span><FaStar className="text-yellow-500" /> {driver.rating}</span>
                      <span><FaCar /> {driver.totalTrips} trips</span>
                      <span><FaMoneyBillWave /> ₹{driver.totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h3>Recent Driver Activity</h3>
            <div className="activity-list">
              {drivers.slice(0, 5).map(driver => (
                <div key={driver.id} className="activity-item">
                  <img src={driver.profileImage} alt={driver.name} className="activity-image" />
                  <div className="activity-content">
                    <h4>{driver.name}</h4>
                    <p>Status: <span className={getStatusColor(driver.status)}>{driver.status}</span></p>
                    <p>Availability: <span className={getAvailabilityColor(driver.availability)}>{driver.availability}</span></p>
                  </div>
                  <div className="activity-time">
                    <FaClock />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <div className="drivers-content">
          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select 
                value={filterAvailability} 
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Drivers List */}
          <div className="drivers-grid">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="driver-card">
                <div className="driver-header">
                  <img src={driver.profileImage} alt={driver.name} className="driver-image" />
                  <div className="driver-status">
                    <span className={`status-badge ${driver.status}`}>{driver.status}</span>
                    <span className={`availability-badge ${driver.availability}`}>{driver.availability}</span>
                  </div>
                </div>
                
                <div className="driver-info">
                  <h3>{driver.name}</h3>
                  <div className="driver-details">
                    <p><FaPhone /> {driver.phone}</p>
                    <p><FaEnvelope /> {driver.email}</p>
                    <p><FaIdCard /> {driver.licenseNumber}</p>
                    <p><FaStar className="text-yellow-500" /> {driver.rating} ({driver.totalTrips} trips)</p>
                    <p><FaMoneyBillWave /> ₹{driver.totalEarnings.toLocaleString()}</p>
                  </div>
                  
                  <div className="driver-skills">
                    <h4>Skills:</h4>
                    <div className="skills-tags">
                      {driver.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="driver-documents">
                    <h4>Documents:</h4>
                    <div className="document-status">
                      {Object.entries(driver.documents).map(([doc, status]) => (
                        <span key={doc} className={`doc-status ${getDocumentStatusColor(status)}`}>
                          {doc}: {status}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="driver-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setSelectedDriver(driver);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FaEye /> View
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setSelectedDriver(driver);
                      setDriverForm(driver);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="assignments-content">
          <div className="assignments-grid">
            {drivers.map(driver => {
              const assignedVehicle = vehicles.find(v => v.id === driver.vehicleId);
              return (
                <div key={driver.id} className="assignment-card">
                  <div className="assignment-driver">
                    <img src={driver.profileImage} alt={driver.name} className="assignment-image" />
                    <div className="assignment-info">
                      <h3>{driver.name}</h3>
                      <p><FaStar className="text-yellow-500" /> {driver.rating}</p>
                      <p><FaCar /> {driver.totalTrips} trips</p>
                    </div>
                  </div>
                  
                  <div className="assignment-vehicle">
                    {assignedVehicle ? (
                      <>
                        <img src={assignedVehicle.image} alt={assignedVehicle.name} className="vehicle-image" />
                        <div className="vehicle-info">
                          <h4>{assignedVehicle.name}</h4>
                          <p>{assignedVehicle.type}</p>
                          <p className="vehicle-status">{assignedVehicle.status}</p>
                        </div>
                      </>
                    ) : (
                      <div className="no-vehicle">
                        <FaCar />
                        <p>No vehicle assigned</p>
                      </div>
                    )}
                  </div>

                  <div className="assignment-actions">
                    {assignedVehicle ? (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleUnassignVehicle(driver.id)}
                      >
                        Unassign
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowAssignmentModal(true);
                        }}
                      >
                        Assign Vehicle
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="performance-content">
          <div className="performance-stats">
            <div className="performance-card">
              <h3>Average Rating</h3>
              <div className="performance-value">
                <FaStar className="text-yellow-500" />
                <span>{stats.averageRating || 0}</span>
              </div>
            </div>
            <div className="performance-card">
              <h3>Total Trips</h3>
              <div className="performance-value">
                <FaCar />
                <span>{drivers.reduce((sum, d) => sum + d.totalTrips, 0)}</span>
              </div>
            </div>
            <div className="performance-card">
              <h3>Total Earnings</h3>
              <div className="performance-value">
                <FaMoneyBillWave />
                <span>₹{stats.totalEarnings?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          <div className="performance-list">
            <h3>Driver Performance Rankings</h3>
            <div className="performance-table">
              <div className="table-header">
                <span>Rank</span>
                <span>Driver</span>
                <span>Rating</span>
                <span>Trips</span>
                <span>Earnings</span>
                <span>Status</span>
              </div>
              {drivers
                .sort((a, b) => b.rating - a.rating)
                .map((driver, index) => (
                  <div key={driver.id} className="table-row">
                    <span className="rank">#{index + 1}</span>
                    <span className="driver-name">
                      <img src={driver.profileImage} alt={driver.name} />
                      {driver.name}
                    </span>
                    <span className="rating">
                      <FaStar className="text-yellow-500" />
                      {driver.rating}
                    </span>
                    <span>{driver.totalTrips}</span>
                    <span>₹{driver.totalEarnings.toLocaleString()}</span>
                    <span className={`status ${driver.status}`}>{driver.status}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Driver</h3>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                  placeholder="Driver name"
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                  placeholder="Email address"
                />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  value={driverForm.licenseNumber}
                  onChange={(e) => setDriverForm({...driverForm, licenseNumber: e.target.value})}
                  placeholder="License number"
                />
              </div>
              <div className="form-group">
                <label>License Expiry</label>
                <input
                  type="date"
                  value={driverForm.licenseExpiry}
                  onChange={(e) => setDriverForm({...driverForm, licenseExpiry: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  type="number"
                  value={driverForm.experience}
                  onChange={(e) => setDriverForm({...driverForm, experience: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Commission (%)</label>
                <input
                  type="number"
                  value={driverForm.commission}
                  onChange={(e) => setDriverForm({...driverForm, commission: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={driverForm.address}
                  onChange={(e) => setDriverForm({...driverForm, address: e.target.value})}
                  placeholder="Driver address"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={driverForm.emergencyContact}
                  onChange={(e) => setDriverForm({...driverForm, emergencyContact: e.target.value})}
                  placeholder="Emergency contact"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddDriver}>
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && selectedDriver && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Driver</h3>
              <button onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={driverForm.status}
                  onChange={(e) => setDriverForm({...driverForm, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="form-group">
                <label>Availability</label>
                <select
                  value={driverForm.availability}
                  onChange={(e) => setDriverForm({...driverForm, availability: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="form-group">
                <label>Commission (%)</label>
                <input
                  type="number"
                  value={driverForm.commission}
                  onChange={(e) => setDriverForm({...driverForm, commission: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateDriver}>
                Update Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedDriver && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Vehicle to {selectedDriver.name}</h3>
              <button onClick={() => setShowAssignmentModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="available-vehicles">
                <h4>Available Vehicles</h4>
                <div className="vehicle-list">
                  {vehicles
                    .filter(v => v.status === 'available' && !drivers.find(d => d.vehicleId === v.id))
                    .map(vehicle => (
                      <div key={vehicle.id} className="vehicle-option">
                        <img src={vehicle.image} alt={vehicle.name} />
                        <div className="vehicle-details">
                          <h5>{vehicle.name}</h5>
                          <p>{vehicle.type}</p>
                          <p>₹{vehicle.hourlyRate}/hour</p>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAssignVehicle(selectedDriver.id, vehicle.id)}
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {showDetailsModal && selectedDriver && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Driver Details</h3>
              <button onClick={() => setShowDetailsModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="driver-details-grid">
                <div className="driver-profile">
                  <img src={selectedDriver.profileImage} alt={selectedDriver.name} />
                  <h3>{selectedDriver.name}</h3>
                  <p className="driver-status">
                    Status: <span className={getStatusColor(selectedDriver.status)}>{selectedDriver.status}</span>
                  </p>
                  <p className="driver-availability">
                    Availability: <span className={getAvailabilityColor(selectedDriver.availability)}>{selectedDriver.availability}</span>
                  </p>
                </div>
                
                <div className="driver-stats">
                  <div className="stat-item">
                    <FaStar className="text-yellow-500" />
                    <span>Rating: {selectedDriver.rating}</span>
                  </div>
                  <div className="stat-item">
                    <FaCar />
                    <span>Total Trips: {selectedDriver.totalTrips}</span>
                  </div>
                  <div className="stat-item">
                    <FaMoneyBillWave />
                    <span>Total Earnings: ₹{selectedDriver.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <FaCalendarAlt />
                    <span>Experience: {selectedDriver.experience} years</span>
                  </div>
                </div>

                <div className="driver-contact">
                  <h4>Contact Information</h4>
                  <p><FaPhone /> {selectedDriver.phone}</p>
                  <p><FaEnvelope /> {selectedDriver.email}</p>
                  <p><FaMapMarkerAlt /> {selectedDriver.address}</p>
                  <p>Emergency: {selectedDriver.emergencyContact}</p>
                </div>

                <div className="driver-documents">
                  <h4>Documents</h4>
                  {Object.entries(selectedDriver.documents).map(([doc, status]) => (
                    <div key={doc} className="document-item">
                      <span className="doc-name">{doc}:</span>
                      <span className={`doc-status ${getDocumentStatusColor(status)}`}>{status}</span>
                    </div>
                  ))}
                </div>

                <div className="driver-skills">
                  <h4>Skills & Languages</h4>
                  <div className="skills-section">
                    <h5>Vehicle Skills:</h5>
                    <div className="skills-tags">
                      {selectedDriver.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="languages-section">
                    <h5>Languages:</h5>
                    <div className="skills-tags">
                      {selectedDriver.languages.map(lang => (
                        <span key={lang} className="skill-tag">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement; 