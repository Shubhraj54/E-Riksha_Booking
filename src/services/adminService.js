// Admin Service for Dashboard and Management
class AdminService {
  // Get comprehensive dashboard statistics
  getDashboardStats() {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Calculate monthly data
      const monthlyBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      });

      const monthlyPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });

      const monthlyUsers = users.filter(user => {
        const userDate = new Date(user.createdAt || Date.now());
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      });

      // Calculate revenue
      const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      // Calculate growth rates
      const lastMonthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear;
      });

      const growthRate = lastMonthBookings.length > 0 
        ? ((monthlyBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100 
        : 0;

      return {
        totalUsers: users.length,
        newUsersThisMonth: monthlyUsers.length,
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.status === 'available').length,
        totalBookings: bookings.length,
        bookingsThisMonth: monthlyBookings.length,
        totalRevenue: totalRevenue,
        revenueThisMonth: monthlyRevenue,
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.status === 'active').length,
        growthRate: Math.round(growthRate),
        monthlyGrowth: Math.round(growthRate)
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalUsers: 0,
        newUsersThisMonth: 0,
        totalVehicles: 0,
        availableVehicles: 0,
        totalBookings: 0,
        bookingsThisMonth: 0,
        totalRevenue: 0,
        revenueThisMonth: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        growthRate: 0,
        monthlyGrowth: 0
      };
    }
  }

  // Get system alerts
  getSystemAlerts() {
    const alerts = [];
    const currentDate = new Date();

    try {
      const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');

      // Check for low vehicle availability
      const availableVehicles = vehicles.filter(v => v.status === 'available');
      if (availableVehicles.length < 3) {
        alerts.push({
          type: 'warning',
          title: 'Low Vehicle Availability',
          message: `Only ${availableVehicles.length} vehicles available. Consider adding more vehicles.`,
          time: 'Just now'
        });
      }

      // Check for pending bookings
      const pendingBookings = bookings.filter(b => b.status === 'pending');
      if (pendingBookings.length > 5) {
        alerts.push({
          type: 'info',
          title: 'Pending Bookings',
          message: `${pendingBookings.length} bookings are pending approval.`,
          time: '5 minutes ago'
        });
      }

      // Check for driver availability
      const activeDrivers = drivers.filter(d => d.status === 'active');
      if (activeDrivers.length < 2) {
        alerts.push({
          type: 'warning',
          title: 'Low Driver Availability',
          message: `Only ${activeDrivers.length} drivers are active. Consider activating more drivers.`,
          time: '10 minutes ago'
        });
      }

      // Check for recent successful payments
      const recentPayments = JSON.parse(localStorage.getItem('payments') || '[]')
        .filter(p => p.status === 'success')
        .slice(-3);

      if (recentPayments.length > 0) {
        alerts.push({
          type: 'success',
          title: 'Recent Payments',
          message: `${recentPayments.length} payments processed successfully in the last hour.`,
          time: '15 minutes ago'
        });
      }

      // Check for system health
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      if (completionRate > 90) {
        alerts.push({
          type: 'success',
          title: 'High Completion Rate',
          message: `Booking completion rate is ${Math.round(completionRate)}%. Excellent performance!`,
          time: '1 hour ago'
        });
      }

    } catch (error) {
      console.error('Error getting system alerts:', error);
      alerts.push({
        type: 'warning',
        title: 'System Error',
        message: 'Unable to load system alerts. Please refresh the page.',
        time: 'Just now'
      });
    }

    return alerts;
  }

  // Get user management data
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Update user status
  updateUserStatus(userId, status) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].status = status;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  // Delete user
  deleteUser(userId) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Get system settings
  getSystemSettings() {
    try {
      return JSON.parse(localStorage.getItem('systemSettings') || '{}');
    } catch (error) {
      console.error('Error getting system settings:', error);
      return {};
    }
  }

  // Update system settings
  updateSystemSettings(settings) {
    try {
      const currentSettings = this.getSystemSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem('systemSettings', JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Error updating system settings:', error);
      return false;
    }
  }

  // Get admin activity log
  getActivityLog() {
    try {
      return JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
    } catch (error) {
      console.error('Error getting activity log:', error);
      return [];
    }
  }

  // Add activity log entry
  addActivityLog(action, details) {
    try {
      const log = this.getActivityLog();
      const entry = {
        id: Date.now(),
        action,
        details,
        timestamp: new Date().toISOString(),
        adminId: JSON.parse(localStorage.getItem('currentUser') || '{}').id
      };
      log.unshift(entry);
      
      // Keep only last 100 entries
      if (log.length > 100) {
        log.splice(100);
      }
      
      localStorage.setItem('adminActivityLog', JSON.stringify(log));
      return true;
    } catch (error) {
      console.error('Error adding activity log:', error);
      return false;
    }
  }
}

export default new AdminService(); 