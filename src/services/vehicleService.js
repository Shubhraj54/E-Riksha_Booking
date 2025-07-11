// Vehicle Management Service
class VehicleService {
  constructor() {
    this.vehicles = this.loadVehicles();
  }

  // Load vehicles from localStorage
  loadVehicles() {
    try {
      const stored = localStorage.getItem('vehicles');
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with default vehicles if none exist
      return this.getDefaultVehicles();
    } catch (error) {
      console.error('Error loading vehicles:', error);
      return this.getDefaultVehicles();
    }
  }

  // Save vehicles to localStorage
  saveVehicles() {
    try {
      localStorage.setItem('vehicles', JSON.stringify(this.vehicles));
    } catch (error) {
      console.error('Error saving vehicles:', error);
    }
  }

  // Get default vehicles
  getDefaultVehicles() {
    return [
      {
        id: 'v1',
        name: 'Auto Rickshaw 1',
        type: 'auto',
        number: 'DL-01-AB-1234',
        model: 'Bajaj RE',
        year: 2022,
        color: 'Yellow',
        image: '/src/assets/auto1.jpg',
        desc: 'Comfortable auto rickshaw for city travel',
        status: 'available', // available, rented, maintenance, out_of_service
        hourlyRate: 50,
        dailyRate: 800,
        fuelType: 'CNG',
        mileage: '35 km/l',
        capacity: '3 passengers',
        features: ['CNG', 'Music System', 'GPS'],
        location: 'Delhi Central',
        driverId: 'd1',
        driverName: 'Rajesh Kumar',
        driverPhone: '+91-98765-43210',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-04-15',
        totalRentals: 45,
        totalEarnings: 22500,
        rating: 4.5,
        createdAt: '2024-01-01',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'v2',
        name: 'Toto Vehicle 1',
        type: 'toto',
        number: 'DL-02-CD-5678',
        model: 'Mahindra Treo',
        year: 2023,
        color: 'Green',
        image: '/src/assets/toto1.jpg',
        desc: 'Electric toto for eco-friendly travel',
        status: 'available',
        hourlyRate: 80,
        dailyRate: 1200,
        fuelType: 'Electric',
        mileage: '80 km/charge',
        capacity: '4 passengers',
        features: ['Electric', 'LED Lights', 'Digital Meter'],
        location: 'Delhi Central',
        driverId: 'd2',
        driverName: 'Amit Singh',
        driverPhone: '+91-98765-43211',
        lastMaintenance: '2024-02-01',
        nextMaintenance: '2024-05-01',
        totalRentals: 32,
        totalEarnings: 25600,
        rating: 4.8,
        createdAt: '2024-01-15',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'v3',
        name: 'Car 1',
        type: 'car',
        number: 'DL-03-EF-9012',
        model: 'Maruti Swift',
        year: 2021,
        color: 'White',
        image: '/src/assets/car1.jpg',
        desc: 'Compact car for comfortable travel',
        status: 'maintenance',
        hourlyRate: 150,
        dailyRate: 2000,
        fuelType: 'Petrol',
        mileage: '20 km/l',
        capacity: '5 passengers',
        features: ['AC', 'Music System', 'Power Steering'],
        location: 'Delhi Central',
        driverId: 'd3',
        driverName: 'Suresh Patel',
        driverPhone: '+91-98765-43212',
        lastMaintenance: '2024-03-01',
        nextMaintenance: '2024-06-01',
        totalRentals: 28,
        totalEarnings: 42000,
        rating: 4.6,
        createdAt: '2024-02-01',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'v4',
        name: 'Bike 1',
        type: 'bike',
        number: 'DL-04-GH-3456',
        model: 'Honda Activa',
        year: 2023,
        color: 'Red',
        image: '/src/assets/bike1.jpg',
        desc: 'Scooter for quick city travel',
        status: 'rented',
        hourlyRate: 30,
        dailyRate: 500,
        fuelType: 'Petrol',
        mileage: '45 km/l',
        capacity: '2 passengers',
        features: ['LED Lights', 'Digital Console'],
        location: 'Delhi Central',
        driverId: 'd4',
        driverName: 'Priya Sharma',
        driverPhone: '+91-98765-43213',
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-04-20',
        totalRentals: 67,
        totalEarnings: 20100,
        rating: 4.7,
        createdAt: '2024-01-10',
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Get all vehicles
  getAllVehicles() {
    return this.vehicles;
  }

  // Get vehicles by status
  getVehiclesByStatus(status) {
    return this.vehicles.filter(vehicle => vehicle.status === status);
  }

  // Get vehicles by type
  getVehiclesByType(type) {
    return this.vehicles.filter(vehicle => vehicle.type === type);
  }

  // Get available vehicles
  getAvailableVehicles() {
    return this.vehicles.filter(vehicle => vehicle.status === 'available');
  }

  // Get vehicle by ID
  getVehicleById(id) {
    return this.vehicles.find(vehicle => vehicle.id === id);
  }

  // Add new vehicle
  addVehicle(vehicleData) {
    const newVehicle = {
      id: `v${Date.now()}`,
      ...vehicleData,
      status: 'available',
      totalRentals: 0,
      totalEarnings: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.vehicles.push(newVehicle);
    this.saveVehicles();
    return newVehicle;
  }

  // Update vehicle
  updateVehicle(id, updates) {
    const index = this.vehicles.findIndex(vehicle => vehicle.id === id);
    if (index !== -1) {
      this.vehicles[index] = {
        ...this.vehicles[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveVehicles();
      return this.vehicles[index];
    }
    return null;
  }

  // Delete vehicle
  deleteVehicle(id) {
    const index = this.vehicles.findIndex(vehicle => vehicle.id === id);
    if (index !== -1) {
      const deletedVehicle = this.vehicles.splice(index, 1)[0];
      this.saveVehicles();
      return deletedVehicle;
    }
    return null;
  }

  // Update vehicle status
  updateVehicleStatus(id, status) {
    return this.updateVehicle(id, { status });
  }

  // Mark vehicle as rented
  markAsRented(id) {
    return this.updateVehicleStatus(id, 'rented');
  }

  // Mark vehicle as available
  markAsAvailable(id) {
    return this.updateVehicleStatus(id, 'available');
  }

  // Mark vehicle for maintenance
  markForMaintenance(id) {
    return this.updateVehicleStatus(id, 'maintenance');
  }

  // Mark vehicle as out of service
  markOutOfService(id) {
    return this.updateVehicleStatus(id, 'out_of_service');
  }

  // Schedule maintenance
  scheduleMaintenance(id, maintenanceDate) {
    const vehicle = this.getVehicleById(id);
    if (vehicle) {
      const nextMaintenance = new Date(maintenanceDate);
      nextMaintenance.setMonth(nextMaintenance.getMonth() + 3); // 3 months from now
      
      return this.updateVehicle(id, {
        lastMaintenance: maintenanceDate,
        nextMaintenance: nextMaintenance.toISOString().split('T')[0],
        status: 'maintenance'
      });
    }
    return null;
  }

  // Complete maintenance
  completeMaintenance(id) {
    return this.updateVehicleStatus(id, 'available');
  }

  // Update vehicle earnings
  updateEarnings(id, amount) {
    const vehicle = this.getVehicleById(id);
    if (vehicle) {
      return this.updateVehicle(id, {
        totalEarnings: vehicle.totalEarnings + amount,
        totalRentals: vehicle.totalRentals + 1
      });
    }
    return null;
  }

  // Update vehicle rating
  updateRating(id, newRating) {
    const vehicle = this.getVehicleById(id);
    if (vehicle) {
      const currentRating = vehicle.rating;
      const totalRentals = vehicle.totalRentals;
      const newAverageRating = ((currentRating * totalRentals) + newRating) / (totalRentals + 1);
      
      return this.updateVehicle(id, {
        rating: Math.round(newAverageRating * 10) / 10
      });
    }
    return null;
  }

  // Get vehicle statistics
  getVehicleStats() {
    const total = this.vehicles.length;
    const available = this.getVehiclesByStatus('available').length;
    const rented = this.getVehiclesByStatus('rented').length;
    const maintenance = this.getVehiclesByStatus('maintenance').length;
    const outOfService = this.getVehiclesByStatus('out_of_service').length;
    
    const totalEarnings = this.vehicles.reduce((sum, vehicle) => sum + vehicle.totalEarnings, 0);
    const totalRentals = this.vehicles.reduce((sum, vehicle) => sum + vehicle.totalRentals, 0);
    const avgRating = this.vehicles.length > 0 
      ? this.vehicles.reduce((sum, vehicle) => sum + vehicle.rating, 0) / this.vehicles.length 
      : 0;

    return {
      total,
      available,
      rented,
      maintenance,
      outOfService,
      totalEarnings,
      totalRentals,
      avgRating: Math.round(avgRating * 10) / 10,
      utilizationRate: total > 0 ? Math.round((rented / total) * 100) : 0
    };
  }

  // Get vehicles needing maintenance
  getVehiclesNeedingMaintenance() {
    const today = new Date();
    return this.vehicles.filter(vehicle => {
      const nextMaintenance = new Date(vehicle.nextMaintenance);
      const daysUntilMaintenance = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
      return daysUntilMaintenance <= 30; // Within 30 days
    });
  }

  // Search vehicles
  searchVehicles(query) {
    const searchTerm = query.toLowerCase();
    return this.vehicles.filter(vehicle => 
      vehicle.name.toLowerCase().includes(searchTerm) ||
      vehicle.number.toLowerCase().includes(searchTerm) ||
      vehicle.type.toLowerCase().includes(searchTerm) ||
      vehicle.driverName.toLowerCase().includes(searchTerm) ||
      vehicle.location.toLowerCase().includes(searchTerm)
    );
  }

  // Get vehicles by location
  getVehiclesByLocation(location) {
    return this.vehicles.filter(vehicle => vehicle.location === location);
  }

  // Get top performing vehicles
  getTopPerformingVehicles(limit = 5) {
    return this.vehicles
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, limit);
  }

  // Get vehicles with low ratings
  getLowRatedVehicles(threshold = 3.5) {
    return this.vehicles.filter(vehicle => vehicle.rating < threshold);
  }

  // Export vehicle data
  exportVehicleData() {
    return {
      vehicles: this.vehicles,
      stats: this.getVehicleStats(),
      exportDate: new Date().toISOString()
    };
  }

  // Import vehicle data
  importVehicleData(data) {
    if (data.vehicles && Array.isArray(data.vehicles)) {
      this.vehicles = data.vehicles;
      this.saveVehicles();
      return true;
    }
    return false;
  }
}

export default new VehicleService(); 