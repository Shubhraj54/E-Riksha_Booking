// Location Service for GPS and Pickup Management
class LocationService {
  constructor() {
    this.pickupPoints = this.loadPickupPoints();
    this.userLocation = null;
    this.watchId = null;
  }

  // Load pickup points from localStorage
  loadPickupPoints() {
    try {
      return JSON.parse(localStorage.getItem('pickupPoints') || '[]');
    } catch (error) {
      console.error('Error loading pickup points:', error);
      return this.getDefaultPickupPoints();
    }
  }

  // Save pickup points to localStorage
  savePickupPoints() {
    try {
      localStorage.setItem('pickupPoints', JSON.stringify(this.pickupPoints));
    } catch (error) {
      console.error('Error saving pickup points:', error);
    }
  }

  // Get default pickup points for demo
  getDefaultPickupPoints() {
    const defaultPoints = [
      {
        id: 1,
        name: 'Central Station',
        address: 'Indore Railway Station, Indore, MP',
        coordinates: { lat: 22.7196, lng: 75.8577 },
        type: 'station',
        isActive: true,
        operatingHours: '24/7',
        contact: '+91-9876543210',
        facilities: ['Parking', 'Waiting Area', 'Restroom'],
        rating: 4.5,
        totalPickups: 150
      },
      {
        id: 2,
        name: 'Airport Terminal',
        address: 'Devi Ahilya Bai Holkar Airport, Indore, MP',
        coordinates: { lat: 22.7218, lng: 75.8014 },
        type: 'airport',
        isActive: true,
        operatingHours: '24/7',
        contact: '+91-9876543211',
        facilities: ['Parking', 'Waiting Area', 'Restroom', 'WiFi'],
        rating: 4.8,
        totalPickups: 89
      },
      {
        id: 3,
        name: 'City Center Mall',
        address: 'Treasure Island Mall, Indore, MP',
        coordinates: { lat: 22.7248, lng: 75.8839 },
        type: 'mall',
        isActive: true,
        operatingHours: '10:00 AM - 10:00 PM',
        contact: '+91-9876543212',
        facilities: ['Parking', 'Waiting Area', 'Food Court'],
        rating: 4.3,
        totalPickups: 67
      },
      {
        id: 4,
        name: 'University Campus',
        address: 'IIT Indore, Indore, MP',
        coordinates: { lat: 22.5204, lng: 75.9224 },
        type: 'educational',
        isActive: true,
        operatingHours: '8:00 AM - 8:00 PM',
        contact: '+91-9876543213',
        facilities: ['Parking', 'Waiting Area'],
        rating: 4.6,
        totalPickups: 45
      },
      {
        id: 5,
        name: 'Hospital Complex',
        address: 'MY Hospital, Indore, MP',
        coordinates: { lat: 22.7235, lng: 75.8839 },
        type: 'hospital',
        isActive: true,
        operatingHours: '24/7',
        contact: '+91-9876543214',
        facilities: ['Parking', 'Waiting Area', 'Emergency Support'],
        rating: 4.7,
        totalPickups: 123
      }
    ];

    // Save default points if none exist
    if (this.pickupPoints.length === 0) {
      this.pickupPoints = defaultPoints;
      this.savePickupPoints();
    }

    return defaultPoints;
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(this.userLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Watch user location for real-time updates
  startLocationWatching(callback) {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return null;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        if (callback) callback(this.userLocation);
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );

    return this.watchId;
  }

  // Stop location watching
  stopLocationWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get nearest pickup points
  getNearestPickupPoints(userLocation, limit = 5) {
    if (!userLocation) return [];

    const pointsWithDistance = this.pickupPoints
      .filter(point => point.isActive)
      .map(point => ({
        ...point,
        distance: this.calculateDistance(userLocation, point.coordinates)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return pointsWithDistance;
  }

  // Get pickup points by type
  getPickupPointsByType(type) {
    return this.pickupPoints.filter(point => point.type === type && point.isActive);
  }

  // Add new pickup point
  addPickupPoint(pointData) {
    const newPoint = {
      id: Date.now(),
      ...pointData,
      isActive: true,
      totalPickups: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    };

    this.pickupPoints.push(newPoint);
    this.savePickupPoints();
    return newPoint;
  }

  // Update pickup point
  updatePickupPoint(id, updates) {
    const index = this.pickupPoints.findIndex(point => point.id === id);
    if (index !== -1) {
      this.pickupPoints[index] = { ...this.pickupPoints[index], ...updates };
      this.savePickupPoints();
      return this.pickupPoints[index];
    }
    return null;
  }

  // Delete pickup point
  deletePickupPoint(id) {
    const index = this.pickupPoints.findIndex(point => point.id === id);
    if (index !== -1) {
      const deletedPoint = this.pickupPoints.splice(index, 1)[0];
      this.savePickupPoints();
      return deletedPoint;
    }
    return null;
  }

  // Calculate location-based pricing
  calculateLocationPricing(basePrice, userLocation, pickupPoint) {
    if (!userLocation || !pickupPoint) return basePrice;

    const distance = this.calculateDistance(userLocation, pickupPoint.coordinates);
    
    // Distance-based pricing
    let locationMultiplier = 1.0;
    
    if (distance <= 2) {
      locationMultiplier = 1.0; // No extra charge for nearby locations
    } else if (distance <= 5) {
      locationMultiplier = 1.1; // 10% extra for 2-5 km
    } else if (distance <= 10) {
      locationMultiplier = 1.2; // 20% extra for 5-10 km
    } else {
      locationMultiplier = 1.3; // 30% extra for >10 km
    }

    // Type-based pricing
    let typeMultiplier = 1.0;
    switch (pickupPoint.type) {
      case 'airport':
        typeMultiplier = 1.2; // 20% extra for airport
        break;
      case 'station':
        typeMultiplier = 1.1; // 10% extra for station
        break;
      case 'hospital':
        typeMultiplier = 1.15; // 15% extra for hospital
        break;
      default:
        typeMultiplier = 1.0;
    }

    const finalPrice = basePrice * locationMultiplier * typeMultiplier;
    return Math.round(finalPrice);
  }

  // Get estimated travel time
  getEstimatedTravelTime(distance) {
    // Average speed: 30 km/h in city
    const averageSpeed = 30;
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} minutes`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }

  // Search pickup points by name or address
  searchPickupPoints(query) {
    const searchTerm = query.toLowerCase();
    return this.pickupPoints.filter(point => 
      point.isActive && (
        point.name.toLowerCase().includes(searchTerm) ||
        point.address.toLowerCase().includes(searchTerm) ||
        point.type.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Get pickup point statistics
  getPickupPointStats() {
    const totalPoints = this.pickupPoints.length;
    const activePoints = this.pickupPoints.filter(point => point.isActive).length;
    const totalPickups = this.pickupPoints.reduce((sum, point) => sum + point.totalPickups, 0);
    const averageRating = this.pickupPoints.length > 0 
      ? this.pickupPoints.reduce((sum, point) => sum + point.rating, 0) / this.pickupPoints.length 
      : 0;

    const typeStats = {};
    this.pickupPoints.forEach(point => {
      if (!typeStats[point.type]) {
        typeStats[point.type] = { count: 0, totalPickups: 0 };
      }
      typeStats[point.type].count++;
      typeStats[point.type].totalPickups += point.totalPickups;
    });

    return {
      totalPoints,
      activePoints,
      totalPickups,
      averageRating: Math.round(averageRating * 10) / 10,
      typeStats
    };
  }

  // Validate coordinates
  validateCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Get address from coordinates (reverse geocoding simulation)
  async getAddressFromCoordinates(coordinates) {
    // In a real app, you would use Google Maps Geocoding API or similar
    // For demo purposes, we'll return a simulated address
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Address near ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
      }, 500);
    });
  }

  // Get coordinates from address (geocoding simulation)
  async getCoordinatesFromAddress(address) {
    // In a real app, you would use Google Maps Geocoding API or similar
    // For demo purposes, we'll return simulated coordinates
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate coordinates for Indore area
        const lat = 22.7196 + (Math.random() - 0.5) * 0.1;
        const lng = 75.8577 + (Math.random() - 0.5) * 0.1;
        resolve({ lat, lng });
      }, 500);
    });
  }
}

export default new LocationService(); 