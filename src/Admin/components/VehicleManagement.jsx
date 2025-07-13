import React, { useState, useEffect } from 'react';
import vehicleService from '../../services/vehicleService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import '../../CSS/VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    setLoading(true);
    try {
      const allVehicles = vehicleService.getAllVehicles();
      setVehicles(allVehicles);
      setStats(vehicleService.getVehicleStats());
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredVehicles = () => {
    let filtered = vehicles;

    // Apply search filter
    if (searchQuery) {
      filtered = vehicleService.searchVehicles(searchQuery);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#2e7d32';
      case 'rented':
        return '#1976d2';
      case 'maintenance':
        return '#f57c00';
      case 'out_of_service':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'rented':
        return '🚗';
      case 'maintenance':
        return '🔧';
      case 'out_of_service':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      vehicleService.updateVehicleStatus(vehicleId, newStatus);
      loadVehicles();
      toast.success(`Vehicle status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update vehicle status');
    }
  };

  const handleMaintenance = async (vehicleId, maintenanceDate) => {
    try {
      vehicleService.scheduleMaintenance(vehicleId, maintenanceDate);
      loadVehicles();
      toast.success('Maintenance scheduled successfully');
      setShowMaintenanceModal(false);
    } catch (error) {
      toast.error('Failed to schedule maintenance');
    }
  };

  const handleCompleteMaintenance = async (vehicleId) => {
    try {
      vehicleService.completeMaintenance(vehicleId);
      loadVehicles();
      toast.success('Maintenance completed');
    } catch (error) {
      toast.error('Failed to complete maintenance');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        vehicleService.deleteVehicle(vehicleId);
        loadVehicles();
        toast.success('Vehicle deleted successfully');
      } catch (error) {
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const exportData = () => {
    try {
      const data = vehicleService.exportVehicleData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Vehicle data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="vehicle-management">
        <div className="loading">Loading vehicle management...</div>
      </div>
    );
  }

  const filteredVehicles = getFilteredVehicles();

  return (
    <div className="vehicle-management">
      {/* Header */}
      <div className="vm-header">
        <h2>Vehicle Management</h2>
        <div className="vm-actions">
          <button className="action-btn export" onClick={exportData}>
            📊 Export Data
          </button>
          <button className="action-btn add" onClick={() => setShowAddModal(true)}>
            ➕ Add Vehicle
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.available}</h3>
            <p>Available</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>{stats.rented}</h3>
            <p>Rented</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>{stats.maintenance}</h3>
            <p>Maintenance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalEarnings?.toLocaleString()}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.avgRating}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="vm-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="auto">Auto</option>
            <option value="toto">Toto</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="vehicles-list">
        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            <p>No vehicles found matching your criteria.</p>
          </div>
        ) : (
          filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="vehicle-image">
                <img src={vehicle.image} alt={vehicle.name} />
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(vehicle.status) }}
                >
                  {getStatusIcon(vehicle.status)} {vehicle.status}
                </div>
              </div>
              
              <div className="vehicle-info">
                <h3>{vehicle.name}</h3>
                <p className="vehicle-number">{vehicle.number}</p>
                <p className="vehicle-desc">{vehicle.desc}</p>
                
                <div className="vehicle-details">
                  <div className="detail-item">
                    <span>Type:</span>
                    <span className="type-badge">{vehicle.type}</span>
                  </div>
                  <div className="detail-item">
                    <span>Driver:</span>
                    <span>{vehicle.driverName}</span>
                  </div>
                  <div className="detail-item">
                    <span>Location:</span>
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="detail-item">
                    <span>Rating:</span>
                    <span className="rating">⭐ {vehicle.rating}</span>
                  </div>
                  <div className="detail-item">
                    <span>Earnings:</span>
                    <span className="earnings">₹{vehicle.totalEarnings?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span>Rentals:</span>
                    <span>{vehicle.totalRentals}</span>
                  </div>
                </div>

                <div className="vehicle-rates">
                  <span>₹{vehicle.hourlyRate}/hour</span>
                  <span>₹{vehicle.dailyRate}/day</span>
                </div>
              </div>

              <div className="vehicle-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit
                </button>
                
                <select
                  className="status-select"
                  value={vehicle.status}
                  onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_service">Out of Service</option>
                </select>

                {vehicle.status === 'maintenance' && (
                  <button 
                    className="action-btn complete"
                    onClick={() => handleCompleteMaintenance(vehicle.id)}
                  >
                    ✅ Complete
                  </button>
                )}

                <button 
                  className="action-btn maintenance"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowMaintenanceModal(true);
                  }}
                >
                  🔧 Maintenance
                </button>

                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Schedule Maintenance</h3>
              <button className="close-btn" onClick={() => setShowMaintenanceModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Schedule maintenance for <strong>{selectedVehicle.name}</strong></p>
              <input
                type="date"
                className="date-input"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    handleMaintenance(selectedVehicle.id, e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement; 