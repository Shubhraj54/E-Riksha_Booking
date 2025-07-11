// Sample Data Utility for Testing
import vehicleService from '../services/vehicleService';

export const initializeSampleData = () => {
  // Initialize sample users if not exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  if (existingUsers.length === 0) {
    const sampleUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@eriksha.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin',
        isAdmin: true,
        status: 'active',
        createdAt: new Date('2024-01-01').toISOString(),
        joiningDate: new Date('2024-01-01').toISOString()
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543211',
        password: 'password123',
        role: 'customer',
        status: 'active',
        createdAt: new Date('2024-01-15').toISOString(),
        joiningDate: new Date('2024-01-15').toISOString()
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543212',
        password: 'password123',
        role: 'customer',
        status: 'active',
        createdAt: new Date('2024-02-01').toISOString(),
        joiningDate: new Date('2024-02-01').toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }

  // Initialize sample bookings if not exists
  const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (existingBookings.length === 0) {
    const sampleBookings = [
      {
        id: 1,
        userId: 2,
        rikshaId: 1,
        name: 'John Doe',
        phone: '9876543211',
        date: '2024-12-15',
        time: '10:00',
        hours: 4,
        bookingType: 'hourly',
        status: 'completed',
        amount: 800,
        createdAt: new Date('2024-12-10').toISOString()
      },
      {
        id: 2,
        userId: 3,
        rikshaId: 2,
        name: 'Jane Smith',
        phone: '9876543212',
        date: '2024-12-16',
        time: '14:00',
        days: 2,
        bookingType: 'day',
        status: 'confirmed',
        amount: 1200,
        createdAt: new Date('2024-12-12').toISOString()
      },
      {
        id: 3,
        userId: 2,
        rikshaId: 3,
        name: 'John Doe',
        phone: '9876543211',
        date: '2024-12-17',
        time: '09:00',
        hours: 8,
        bookingType: 'hourly',
        status: 'pending',
        amount: 1600,
        createdAt: new Date('2024-12-14').toISOString()
      }
    ];
    localStorage.setItem('bookings', JSON.stringify(sampleBookings));
  }

  // Initialize sample payments if not exists
  const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
  if (existingPayments.length === 0) {
    const vehicles = vehicleService.getAllVehicles();
    const samplePayments = [
      {
        paymentId: 'pay_1234567890',
        bookingData: { name: 'John Doe' },
        vehicle: vehicles[0],
        amount: 800,
        timestamp: new Date('2024-12-10T10:00:00').toISOString(),
        status: 'completed'
      },
      {
        paymentId: 'pay_1234567891',
        bookingData: { name: 'Jane Smith' },
        vehicle: vehicles[1],
        amount: 1200,
        timestamp: new Date('2024-12-12T14:00:00').toISOString(),
        status: 'completed'
      }
    ];
    localStorage.setItem('payments', JSON.stringify(samplePayments));
  }

  console.log('Sample data initialized successfully!');
  console.log('Admin credentials: admin@eriksha.com / admin123');
};

export const clearSampleData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('bookings');
  localStorage.removeItem('payments');
  console.log('Sample data cleared!');
}; 