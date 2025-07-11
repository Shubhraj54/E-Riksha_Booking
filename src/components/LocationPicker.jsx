import React, { useState, useEffect, useRef } from 'react';
import locationService from '../services/locationService';
import toast from 'react-hot-toast';
import '../CSS/LocationPicker.css';

const LocationPicker = ({ onLocationSelect, selectedLocation = null }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestPoints, setNearestPoints] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const locationRef = useRef(null);

  useEffect(() => {
    loadPickupPoints();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const nearest = locationService.getNearestPickupPoints(userLocation, 10);
      setNearestPoints(nearest);
    }
  }, [userLocation]);

  const loadPickupPoints = () => {
    const points = locationService.pickupPoints.filter(point => point.isActive);
    setAllPoints(points);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setLocationError(null);
    
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      toast.success('Location detected successfully!');
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get your location. Please enable location services or select manually.');
      toast.error('Location access denied. Please enable location services.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (point) => {
    if (onLocationSelect) {
      onLocationSelect(point);
    }
    toast.success(`Selected: ${point.name}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = locationService.searchPickupPoints(query);
      setNearestPoints(results);
    } else {
      if (userLocation) {
        const nearest = locationService.getNearestPickupPoints(userLocation, 10);
        setNearestPoints(nearest);
      }
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    if (type === 'all') {
      if (userLocation) {
        const nearest = locationService.getNearestPickupPoints(userLocation, 10);
        setNearestPoints(nearest);
      }
    } else {
      const filtered = locationService.getPickupPointsByType(type);
      setNearestPoints(filtered);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'airport': return '✈️';
      case 'station': return '🚉';
      case 'mall': return '🏬';
      case 'hospital': return '🏥';
      case 'educational': return '🎓';
      default: return '📍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'airport': return '#e74c3c';
      case 'station': return '#3498db';
      case 'mall': return '#f39c12';
      case 'hospital': return '#e74c3c';
      case 'educational': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const filteredPoints = nearestPoints.filter(point => 
    selectedType === 'all' || point.type === selectedType
  );

  return (
    <div className="location-picker" ref={locationRef}>
      {/* Header */}
      <div className="location-header">
        <h3>📍 Select Pickup Location</h3>
        <button 
          className="location-btn"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? '🔄 Detecting...' : '📍 Use My Location'}
        </button>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="location-error">
          <span>⚠️ {locationError}</span>
          <button onClick={getCurrentLocation}>Try Again</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="location-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search pickup points..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="type-filters">
          <button
            className={`type-filter ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('all')}
          >
            All
          </button>
          <button
            className={`type-filter ${selectedType === 'airport' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('airport')}
          >
            ✈️ Airport
          </button>
          <button
            className={`type-filter ${selectedType === 'station' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('station')}
          >
            🚉 Station
          </button>
          <button
            className={`type-filter ${selectedType === 'mall' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('mall')}
          >
            🏬 Mall
          </button>
          <button
            className={`type-filter ${selectedType === 'hospital' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('hospital')}
          >
            🏥 Hospital
          </button>
        </div>
      </div>

      {/* Current Location Display */}
      {userLocation && (
        <div className="current-location">
          <div className="location-info">
            <span className="location-label">📍 Your Location:</span>
            <span className="location-coords">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
            <span className="location-accuracy">
              Accuracy: ±{Math.round(userLocation.accuracy)}m
            </span>
          </div>
        </div>
      )}

      {/* Pickup Points List */}
      <div className="pickup-points-list">
        {filteredPoints.length === 0 ? (
          <div className="no-points">
            <span>🔍 No pickup points found</span>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredPoints.map((point) => (
            <div
              key={point.id}
              className={`pickup-point ${selectedLocation?.id === point.id ? 'selected' : ''}`}
              onClick={() => handleLocationSelect(point)}
            >
              <div className="point-icon" style={{ backgroundColor: getTypeColor(point.type) }}>
                {getTypeIcon(point.type)}
              </div>
              
              <div className="point-details">
                <div className="point-header">
                  <h4>{point.name}</h4>
                  <div className="point-rating">
                    ⭐ {point.rating} ({point.totalPickups} pickups)
                  </div>
                </div>
                
                <p className="point-address">{point.address}</p>
                
                <div className="point-info">
                  <span className="point-type">{point.type}</span>
                  <span className="point-hours">🕒 {point.operatingHours}</span>
                  {point.distance && (
                    <span className="point-distance">
                      📍 {point.distance.toFixed(1)} km away
                    </span>
                  )}
                </div>

                <div className="point-facilities">
                  {point.facilities.slice(0, 3).map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                  {point.facilities.length > 3 && (
                    <span className="facility-more">
                      +{point.facilities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="point-contact">
                  📞 {point.contact}
                </div>
              </div>

              <div className="point-actions">
                <button 
                  className="select-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocationSelect(point);
                  }}
                >
                  {selectedLocation?.id === point.id ? '✓ Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Map Toggle */}
      <div className="map-toggle">
        <button 
          className="map-btn"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
        </button>
      </div>

      {/* Simple Map Display */}
      {showMap && (
        <div className="simple-map">
          <div className="map-placeholder">
            <div className="map-content">
              <h4>🗺️ Interactive Map</h4>
              <p>Map integration would show pickup points and your location</p>
              <div className="map-features">
                <span>📍 Your Location</span>
                <span>🎯 Pickup Points</span>
                <span>📏 Distance Lines</span>
                <span>🚗 Route Planning</span>
              </div>
              <button className="map-integration-btn">
                Integrate Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Tips */}
      <div className="location-tips">
        <h4>💡 Tips for Better Experience:</h4>
        <ul>
          <li>Enable location services for accurate pickup point suggestions</li>
          <li>Check operating hours before selecting a pickup point</li>
          <li>Consider facilities available at each location</li>
          <li>Distance affects pricing - closer points may be cheaper</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationPicker; 