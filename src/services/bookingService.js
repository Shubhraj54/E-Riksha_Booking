// Booking Service for Admin Dashboard
class BookingService {
  // Get recent bookings
  getRecentBookings(limit = 5) {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map(booking => ({
          id: booking.id,
          customerName: booking.customerName || booking.userName || 'Unknown Customer',
          vehicleName: booking.vehicleName || booking.vehicle?.name || 'Unknown Vehicle',
          status: booking.status || 'pending',
          createdAt: booking.createdAt,
          pickupDate: booking.pickupDate,
          returnDate: booking.returnDate,
          totalAmount: booking.totalAmount || 0
        }));
    } catch (error) {
      console.error('Error getting recent bookings:', error);
      return [];
    }
  }

  // Get all bookings
  getAllBookings() {
    try {
      return JSON.parse(localStorage.getItem('bookings') || '[]');
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
  }

  // Get booking statistics
  getBookingStats() {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;

      return {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
        cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        pendingBookings: 0,
        completionRate: 0,
        cancellationRate: 0
      };
    }
  }

  // Update booking status
  updateBookingStatus(bookingId, status) {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = status;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }
}

export default new BookingService(); 