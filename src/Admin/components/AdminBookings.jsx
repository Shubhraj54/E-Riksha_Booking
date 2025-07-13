import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaEdit, FaTrash, FaEye, FaDownload, FaFilter, FaCheck, FaTimes } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';
import '../CSS/AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = () => {
    setLoading(true);
    try {
      const allBookings = bookingService.getAllBookings();
      setBookings(allBookings);
      setFilteredBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking({ ...booking });
    setShowBookingModal(true);
  };

  const handleDeleteBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDeleteBooking = () => {
    if (selectedBooking) {
      const success = bookingService.updateBookingStatus(selectedBooking.id, 'cancelled');
      if (success) {
        toast.success('Booking cancelled successfully');
        loadBookings();
        setShowDeleteModal(false);
        setSelectedBooking(null);
      } else {
        toast.error('Error cancelling booking');
      }
    }
  };

  const handleUpdateBooking = (updatedBooking) => {
    const success = bookingService.updateBookingStatus(updatedBooking.id, updatedBooking.status);
    if (success) {
      toast.success('Booking updated successfully');
      loadBookings();
      setShowBookingModal(false);
      setEditingBooking(null);
    } else {
      toast.error('Error updating booking');
    }
  };

  const exportBookings = () => {
    try {
      const exportData = filteredBookings.map(booking => ({
        ID: booking.id,
        'Customer Name': booking.customerName || 'Unknown',
        'Vehicle Name': booking.vehicleName || 'Unknown',
        Status: booking.status || 'pending',
        'Pickup Date': booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A',
        'Return Date': booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : 'N/A',
        'Total Amount': `₹${booking.totalAmount || 0}`,
        'Created Date': new Date(booking.createdAt || Date.now()).toLocaleDateString()
      }));

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Bookings exported successfully');
    } catch (error) {
      toast.error('Error exporting bookings');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', label: 'Confirmed', icon: <FaCheck /> },
      pending: { class: 'status-pending', label: 'Pending', icon: <FaEye /> },
      completed: { class: 'status-completed', label: 'Completed', icon: <FaCheck /> },
      cancelled: { class: 'status-cancelled', label: 'Cancelled', icon: <FaTimes /> }
    };

    const config = statusConfig[status] || { class: 'status-unknown', label: 'Unknown', icon: <FaEye /> };
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getBookingStats = () => {
    const stats = bookingService.getBookingStats();
    return stats;
  };

  if (loading) {
    return (
      <div className="admin-bookings">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-table"></div>
        </div>
      </div>
    );
  }

  const bookingStats = getBookingStats();

  return (
    <div className="admin-bookings">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1><FaCalendarAlt /> Booking Management</h1>
          <p>Manage all vehicle bookings and reservations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportBookings}>
            <FaDownload /> Export Bookings
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search bookings by customer, vehicle, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>{bookingStats.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{bookingStats.confirmedBookings}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{bookingStats.completedBookings}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{bookingStats.pendingBookings}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{bookingStats.cancelledBookings}</h3>
          <p>Cancelled</p>
        </div>
        <div className="stat-card">
          <h3>{Math.round(bookingStats.completionRate)}%</h3>
          <p>Completion Rate</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <div className="booking-id">
                      <strong>#{booking.id}</strong>
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <h4>{booking.customerName || 'Unknown Customer'}</h4>
                      <span>{booking.customerEmail || 'No email'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vehicle-info">
                      <h4>{booking.vehicleName || 'Unknown Vehicle'}</h4>
                      <span>{booking.vehicleType || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <span className="date">
                        {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="time">
                        {booking.pickupTime || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <span className="date">
                        {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="time">
                        {booking.returnTime || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      <strong>₹{booking.totalAmount?.toLocaleString() || 0}</strong>
                      <span>{booking.paymentStatus || 'Pending'}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon view"
                        onClick={() => handleViewBooking(booking)}
                        title="View Booking"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEditBooking(booking)}
                        title="Edit Booking"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeleteBooking(booking)}
                        title="Cancel Booking"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-content">
                    <FaCalendarAlt />
                    <p>No bookings found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBooking ? 'Edit Booking' : 'Booking Details'}</h3>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {editingBooking ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateBooking(editingBooking);
                }}>
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      value={editingBooking.customerName || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, customerName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Name</label>
                    <input
                      type="text"
                      value={editingBooking.vehicleName || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, vehicleName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pickup Date</label>
                      <input
                        type="date"
                        value={editingBooking.pickupDate ? editingBooking.pickupDate.split('T')[0] : ''}
                        onChange={(e) => setEditingBooking({...editingBooking, pickupDate: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Return Date</label>
                      <input
                        type="date"
                        value={editingBooking.returnDate ? editingBooking.returnDate.split('T')[0] : ''}
                        onChange={(e) => setEditingBooking({...editingBooking, returnDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editingBooking.status || 'pending'}
                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Amount</label>
                    <input
                      type="number"
                      value={editingBooking.totalAmount || 0}
                      onChange={(e) => setEditingBooking({...editingBooking, totalAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Booking
                    </button>
                  </div>
                </form>
              ) : (
                <div className="booking-details-view">
                  <div className="booking-header">
                    <h4>Booking #{selectedBooking?.id}</h4>
                    {getStatusBadge(selectedBooking?.status)}
                  </div>
                  <div className="booking-info-grid">
                    <div className="info-item">
                      <label>Customer:</label>
                      <span>{selectedBooking?.customerName || 'Unknown'}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{selectedBooking?.customerEmail || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Vehicle:</label>
                      <span>{selectedBooking?.vehicleName || 'Unknown'}</span>
                    </div>
                    <div className="info-item">
                      <label>Vehicle Type:</label>
                      <span>{selectedBooking?.vehicleType || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Pickup Date:</label>
                      <span>{selectedBooking?.pickupDate ? new Date(selectedBooking.pickupDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Return Date:</label>
                      <span>{selectedBooking?.returnDate ? new Date(selectedBooking.returnDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Amount:</label>
                      <span>₹{selectedBooking?.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="info-item">
                      <label>Payment Status:</label>
                      <span>{selectedBooking?.paymentStatus || 'Pending'}</span>
                    </div>
                    <div className="info-item">
                      <label>Created:</label>
                      <span>{new Date(selectedBooking?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Booking</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel booking <strong>#{selectedBooking?.id}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Keep Booking
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteBooking}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings; 