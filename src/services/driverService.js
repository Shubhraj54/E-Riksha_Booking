// Driver Service for Driver Management
class DriverService {
  constructor() {
    this.drivers = this.loadDrivers();
    this.assignments = this.loadAssignments();
    this.earnings = this.loadEarnings();
  }

  // Load data from localStorage
  loadDrivers() {
    try {
      return JSON.parse(localStorage.getItem('drivers') || '[]');
    } catch (error) {
      console.error('Error loading drivers:', error);
      return this.getDefaultDrivers();
    }
  }

  loadAssignments() {
    try {
      return JSON.parse(localStorage.getItem('driverAssignments') || '[]');
    } catch (error) {
      console.error('Error loading assignments:', error);
      return [];
    }
  }

  loadEarnings() {
    try {
      return JSON.parse(localStorage.getItem('driverEarnings') || '[]');
    } catch (error) {
      console.error('Error loading earnings:', error);
      return [];
    }
  }

  // Save data to localStorage
  saveDrivers() {
    try {
      localStorage.setItem('drivers', JSON.stringify(this.drivers));
    } catch (error) {
      console.error('Error saving drivers:', error);
    }
  }

  saveAssignments() {
    try {
      localStorage.setItem('driverAssignments', JSON.stringify(this.assignments));
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  }

  saveEarnings() {
    try {
      localStorage.setItem('driverEarnings', JSON.stringify(this.earnings));
    } catch (error) {
      console.error('Error saving earnings:', error);
    }
  }

  // Get default drivers for demo
  getDefaultDrivers() {
    const defaultDrivers = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        email: 'rajesh@eriksha.com',
        licenseNumber: 'DL-0123456789',
        licenseExpiry: '2025-12-31',
        experience: 5,
        rating: 4.8,
        totalTrips: 156,
        totalEarnings: 45000,
        status: 'active',
        availability: 'available',
        vehicleId: 1,
        commission: 15,
        address: '123, MG Road, Indore, MP',
        emergencyContact: '+91-9876543211',
        documents: {
          license: 'valid',
          insurance: 'valid',
          fitness: 'valid',
          permit: 'valid'
        },
        skills: ['Auto Rickshaw', 'Car', 'Bike'],
        languages: ['Hindi', 'English'],
        joiningDate: '2023-01-15',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        phone: '+91-9876543212',
        email: 'priya@eriksha.com',
        licenseNumber: 'DL-0123456790',
        licenseExpiry: '2026-03-15',
        experience: 3,
        rating: 4.6,
        totalTrips: 89,
        totalEarnings: 28000,
        status: 'active',
        availability: 'available',
        vehicleId: 2,
        commission: 12,
        address: '456, AB Road, Indore, MP',
        emergencyContact: '+91-9876543213',
        documents: {
          license: 'valid',
          insurance: 'valid',
          fitness: 'valid',
          permit: 'valid'
        },
        skills: ['Auto Rickshaw', 'Toto'],
        languages: ['Hindi', 'English', 'Marathi'],
        joiningDate: '2023-06-20',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 3,
        name: 'Amit Patel',
        phone: '+91-9876543214',
        email: 'amit@eriksha.com',
        licenseNumber: 'DL-0123456791',
        licenseExpiry: '2025-08-20',
        experience: 7,
        rating: 4.9,
        totalTrips: 234,
        totalEarnings: 67000,
        status: 'active',
        availability: 'busy',
        vehicleId: 3,
        commission: 18,
        address: '789, Palasia, Indore, MP',
        emergencyContact: '+91-9876543215',
        documents: {
          license: 'valid',
          insurance: 'valid',
          fitness: 'valid',
          permit: 'valid'
        },
        skills: ['Auto Rickshaw', 'Car', 'Bike', 'Toto'],
        languages: ['Hindi', 'English', 'Gujarati'],
        joiningDate: '2022-11-10',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 4,
        name: 'Sunita Verma',
        phone: '+91-9876543216',
        email: 'sunita@eriksha.com',
        licenseNumber: 'DL-0123456792',
        licenseExpiry: '2026-01-10',
        experience: 2,
        rating: 4.4,
        totalTrips: 67,
        totalEarnings: 19000,
        status: 'active',
        availability: 'available',
        vehicleId: 4,
        commission: 10,
        address: '321, Vijay Nagar, Indore, MP',
        emergencyContact: '+91-9876543217',
        documents: {
          license: 'valid',
          insurance: 'valid',
          fitness: 'valid',
          permit: 'valid'
        },
        skills: ['Auto Rickshaw'],
        languages: ['Hindi', 'English'],
        joiningDate: '2023-09-05',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 5,
        name: 'Vikram Singh',
        phone: '+91-9876543218',
        email: 'vikram@eriksha.com',
        licenseNumber: 'DL-0123456793',
        licenseExpiry: '2025-05-25',
        experience: 4,
        rating: 4.7,
        totalTrips: 123,
        totalEarnings: 38000,
        status: 'inactive',
        availability: 'unavailable',
        vehicleId: 5,
        commission: 14,
        address: '654, Rajendra Nagar, Indore, MP',
        emergencyContact: '+91-9876543219',
        documents: {
          license: 'expired',
          insurance: 'valid',
          fitness: 'valid',
          permit: 'valid'
        },
        skills: ['Auto Rickshaw', 'Car'],
        languages: ['Hindi', 'English', 'Punjabi'],
        joiningDate: '2023-03-12',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    ];

    // Save default drivers if none exist
    if (this.drivers.length === 0) {
      this.drivers = defaultDrivers;
      this.saveDrivers();
    }

    return defaultDrivers;
  }

  // Driver Management
  getAllDrivers() {
    return this.drivers;
  }

  getDriverById(id) {
    return this.drivers.find(driver => driver.id === id);
  }

  getActiveDrivers() {
    return this.drivers.filter(driver => driver.status === 'active');
  }

  getAvailableDrivers() {
    return this.drivers.filter(driver => 
      driver.status === 'active' && driver.availability === 'available'
    );
  }

  addDriver(driverData) {
    const newDriver = {
      id: Date.now(),
      ...driverData,
      status: 'active',
      availability: 'available',
      rating: 0,
      totalTrips: 0,
      totalEarnings: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      documents: {
        license: 'pending',
        insurance: 'pending',
        fitness: 'pending',
        permit: 'pending'
      }
    };

    this.drivers.push(newDriver);
    this.saveDrivers();
    return newDriver;
  }

  updateDriver(id, updates) {
    const index = this.drivers.findIndex(driver => driver.id === id);
    if (index !== -1) {
      this.drivers[index] = { ...this.drivers[index], ...updates };
      this.saveDrivers();
      return this.drivers[index];
    }
    return null;
  }

  deleteDriver(id) {
    const index = this.drivers.findIndex(driver => driver.id === id);
    if (index !== -1) {
      const deletedDriver = this.drivers.splice(index, 1)[0];
      this.saveDrivers();
      return deletedDriver;
    }
    return null;
  }

  // Driver Assignment
  assignDriverToVehicle(driverId, vehicleId) {
    const driver = this.getDriverById(driverId);
    if (driver) {
      driver.vehicleId = vehicleId;
      this.saveDrivers();
      
      // Create assignment record
      const assignment = {
        id: Date.now(),
        driverId,
        vehicleId,
        assignedAt: new Date().toISOString(),
        status: 'active'
      };
      
      this.assignments.push(assignment);
      this.saveAssignments();
      
      return assignment;
    }
    return null;
  }

  unassignDriver(driverId) {
    const driver = this.getDriverById(driverId);
    if (driver) {
      driver.vehicleId = null;
      this.saveDrivers();
      
      // Update assignment status
      const assignment = this.assignments.find(a => 
        a.driverId === driverId && a.status === 'active'
      );
      if (assignment) {
        assignment.status = 'inactive';
        assignment.unassignedAt = new Date().toISOString();
        this.saveAssignments();
      }
      
      return true;
    }
    return false;
  }

  getDriverAssignments(driverId) {
    return this.assignments.filter(assignment => assignment.driverId === driverId);
  }

  getVehicleAssignment(vehicleId) {
    return this.assignments.find(assignment => 
      assignment.vehicleId === vehicleId && assignment.status === 'active'
    );
  }

  // Driver Availability
  updateDriverAvailability(driverId, availability) {
    return this.updateDriver(driverId, { availability });
  }

  getDriversByAvailability(availability) {
    return this.drivers.filter(driver => driver.availability === availability);
  }

  // Performance Tracking
  updateDriverRating(driverId, newRating) {
    const driver = this.getDriverById(driverId);
    if (driver) {
      const currentRating = driver.rating;
      const totalTrips = driver.totalTrips;
      
      // Calculate new average rating
      const newAverageRating = ((currentRating * totalTrips) + newRating) / (totalTrips + 1);
      
      return this.updateDriver(driverId, {
        rating: Math.round(newAverageRating * 10) / 10,
        totalTrips: totalTrips + 1
      });
    }
    return null;
  }

  // Earnings Management
  addDriverEarning(driverId, amount, tripId) {
    const earning = {
      id: Date.now(),
      driverId,
      amount,
      tripId,
      date: new Date().toISOString(),
      status: 'pending'
    };

    this.earnings.push(earning);
    this.saveEarnings();

    // Update driver's total earnings
    const driver = this.getDriverById(driverId);
    if (driver) {
      driver.totalEarnings += amount;
      this.saveDrivers();
    }

    return earning;
  }

  getDriverEarnings(driverId, startDate = null, endDate = null) {
    let earnings = this.earnings.filter(earning => earning.driverId === driverId);
    
    if (startDate && endDate) {
      earnings = earnings.filter(earning => {
        const earningDate = new Date(earning.date);
        return earningDate >= new Date(startDate) && earningDate <= new Date(endDate);
      });
    }
    
    return earnings;
  }

  calculateDriverCommission(driverId, amount) {
    const driver = this.getDriverById(driverId);
    if (driver) {
      return (amount * driver.commission) / 100;
    }
    return 0;
  }

  // Document Management
  updateDriverDocument(driverId, documentType, status) {
    const driver = this.getDriverById(driverId);
    if (driver) {
      driver.documents[documentType] = status;
      this.saveDrivers();
      return driver;
    }
    return null;
  }

  getDriversWithExpiredDocuments() {
    const today = new Date();
    return this.drivers.filter(driver => {
      const licenseExpiry = new Date(driver.licenseExpiry);
      return licenseExpiry < today || driver.documents.license === 'expired';
    });
  }

  // Statistics and Analytics
  getDriverStats() {
    const totalDrivers = this.drivers.length;
    const activeDrivers = this.drivers.filter(d => d.status === 'active').length;
    const availableDrivers = this.drivers.filter(d => 
      d.status === 'active' && d.availability === 'available'
    ).length;
    
    const totalEarnings = this.drivers.reduce((sum, driver) => sum + driver.totalEarnings, 0);
    const averageRating = this.drivers.length > 0 
      ? this.drivers.reduce((sum, driver) => sum + driver.rating, 0) / this.drivers.length 
      : 0;

    const topPerformers = this.drivers
      .filter(d => d.status === 'active')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    return {
      totalDrivers,
      activeDrivers,
      availableDrivers,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      topPerformers
    };
  }

  // Search and Filter
  searchDrivers(query) {
    const searchTerm = query.toLowerCase();
    return this.drivers.filter(driver => 
      driver.name.toLowerCase().includes(searchTerm) ||
      driver.phone.includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm)
    );
  }

  getDriversBySkill(skill) {
    return this.drivers.filter(driver => 
      driver.skills.includes(skill) && driver.status === 'active'
    );
  }

  getDriversByLanguage(language) {
    return this.drivers.filter(driver => 
      driver.languages.includes(language) && driver.status === 'active'
    );
  }

  // Driver Dashboard Data
  getDriverDashboardData(driverId) {
    const driver = this.getDriverById(driverId);
    if (!driver) return null;

    const recentEarnings = this.getDriverEarnings(driverId).slice(-5);
    const assignments = this.getDriverAssignments(driverId);
    const currentAssignment = assignments.find(a => a.status === 'active');

    const monthlyEarnings = this.calculateMonthlyEarnings(driverId);
    const weeklyStats = this.calculateWeeklyStats(driverId);

    return {
      driver,
      recentEarnings,
      currentAssignment,
      monthlyEarnings,
      weeklyStats
    };
  }

  calculateMonthlyEarnings(driverId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyEarnings = this.getDriverEarnings(driverId, startOfMonth, endOfMonth);
    return monthlyEarnings.reduce((sum, earning) => sum + earning.amount, 0);
  }

  calculateWeeklyStats(driverId) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    const weeklyEarnings = this.getDriverEarnings(driverId, startOfWeek, endOfWeek);
    const totalEarnings = weeklyEarnings.reduce((sum, earning) => sum + earning.amount, 0);
    const totalTrips = weeklyEarnings.length;

    return {
      totalEarnings,
      totalTrips,
      averagePerTrip: totalTrips > 0 ? totalEarnings / totalTrips : 0
    };
  }
}

export default new DriverService(); 