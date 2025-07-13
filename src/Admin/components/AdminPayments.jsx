import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaSearch, FaEdit, FaTrash, FaEye, FaDownload, FaFilter, FaCheck, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import paymentService from '../../services/paymentService';
import toast from 'react-hot-toast';
import '../CSS/AdminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const loadPayments = () => {
    setLoading(true);
    try {
      const allPayments = paymentService.getAllPayments();
      setPayments(allPayments);
      setFilteredPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Error loading payments');
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toString().includes(searchTerm) ||
        payment.paymentId?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment({ ...payment });
    setShowPaymentModal(true);
  };

  const handleDeletePayment = (payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const confirmDeletePayment = () => {
    if (selectedPayment) {
      // In a real app, you'd call an API to delete the payment
      toast.success('Payment deleted successfully');
      loadPayments();
      setShowDeleteModal(false);
      setSelectedPayment(null);
    }
  };

  const handleUpdatePayment = (updatedPayment) => {
    // In a real app, you'd call an API to update the payment
    toast.success('Payment updated successfully');
    loadPayments();
    setShowPaymentModal(false);
    setEditingPayment(null);
  };

  const exportPayments = () => {
    try {
      const exportData = filteredPayments.map(payment => ({
        ID: payment.id || payment.paymentId,
        'Customer Name': payment.customerName || 'Unknown',
        Amount: `₹${payment.amount?.toLocaleString() || 0}`,
        Status: payment.status || 'pending',
        Method: payment.method || 'online',
        Date: payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A',
        'Transaction ID': payment.transactionId || 'N/A'
      }));

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Payments exported successfully');
    } catch (error) {
      toast.error('Error exporting payments');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { class: 'status-success', label: 'Success', icon: <FaCheck /> },
      pending: { class: 'status-pending', label: 'Pending', icon: <FaEye /> },
      failed: { class: 'status-failed', label: 'Failed', icon: <FaTimes /> },
      refunded: { class: 'status-refunded', label: 'Refunded', icon: <FaMoneyBillWave /> }
    };

    const config = statusConfig[status] || { class: 'status-unknown', label: 'Unknown', icon: <FaEye /> };
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getPaymentStats = () => {
    const stats = paymentService.getPaymentStats();
    return stats;
  };

  if (loading) {
    return (
      <div className="admin-payments">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-table"></div>
        </div>
      </div>
    );
  }

  const paymentStats = getPaymentStats();

  return (
    <div className="admin-payments">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1><FaCreditCard /> Payment Management</h1>
          <p>Track and manage all payment transactions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportPayments}>
            <FaDownload /> Export Payments
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search payments by customer, ID, or transaction ID..."
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
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>{paymentStats.totalPayments}</h3>
          <p>Total Payments</p>
        </div>
        <div className="stat-card">
          <h3>₹{paymentStats.totalAmount?.toLocaleString() || 0}</h3>
          <p>Total Amount</p>
        </div>
        <div className="stat-card">
          <h3>{paymentStats.successfulPayments}</h3>
          <p>Successful</p>
        </div>
        <div className="stat-card">
          <h3>{paymentStats.failedPayments}</h3>
          <p>Failed</p>
        </div>
        <div className="stat-card">
          <h3>{paymentStats.pendingPayments}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{Math.round(paymentStats.successRate)}%</h3>
          <p>Success Rate</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map(payment => (
                <tr key={payment.id || payment.paymentId}>
                  <td>
                    <div className="payment-id">
                      <strong>#{payment.id || payment.paymentId}</strong>
                      <span>{payment.transactionId || 'No TXN ID'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <h4>{payment.customerName || 'Unknown Customer'}</h4>
                      <span>{payment.customerEmail || 'No email'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      <strong>₹{payment.amount?.toLocaleString() || 0}</strong>
                      <span>{payment.currency || 'INR'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="method-info">
                      <span className={`method-badge ${payment.method || 'online'}`}>
                        {payment.method || 'Online'}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <div className="date-info">
                      <span className="date">
                        {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="time">
                        {payment.date ? new Date(payment.date).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon view"
                        onClick={() => handleViewPayment(payment)}
                        title="View Payment"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEditPayment(payment)}
                        title="Edit Payment"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeletePayment(payment)}
                        title="Delete Payment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="no-data-content">
                    <FaCreditCard />
                    <p>No payments found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPayment ? 'Edit Payment' : 'Payment Details'}</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {editingPayment ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePayment(editingPayment);
                }}>
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      value={editingPayment.customerName || ''}
                      onChange={(e) => setEditingPayment({...editingPayment, customerName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      value={editingPayment.amount || 0}
                      onChange={(e) => setEditingPayment({...editingPayment, amount: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editingPayment.status || 'pending'}
                      onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={editingPayment.method || 'online'}
                      onChange={(e) => setEditingPayment({...editingPayment, method: e.target.value})}
                    >
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Payment
                    </button>
                  </div>
                </form>
              ) : (
                <div className="payment-details-view">
                  <div className="payment-header">
                    <h4>Payment #{selectedPayment?.id || selectedPayment?.paymentId}</h4>
                    {getStatusBadge(selectedPayment?.status)}
                  </div>
                  <div className="payment-info-grid">
                    <div className="info-item">
                      <label>Customer:</label>
                      <span>{selectedPayment?.customerName || 'Unknown'}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{selectedPayment?.customerEmail || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Amount:</label>
                      <span>₹{selectedPayment?.amount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="info-item">
                      <label>Currency:</label>
                      <span>{selectedPayment?.currency || 'INR'}</span>
                    </div>
                    <div className="info-item">
                      <label>Method:</label>
                      <span className={`method-badge ${selectedPayment?.method || 'online'}`}>
                        {selectedPayment?.method || 'Online'}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Transaction ID:</label>
                      <span>{selectedPayment?.transactionId || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Date:</label>
                      <span>{selectedPayment?.date ? new Date(selectedPayment.date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Time:</label>
                      <span>{selectedPayment?.date ? new Date(selectedPayment.date).toLocaleTimeString() : 'N/A'}</span>
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
              <h3>Delete Payment</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete payment <strong>#{selectedPayment?.id || selectedPayment?.paymentId}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Keep Payment
              </button>
              <button className="btn btn-danger" onClick={confirmDeletePayment}>
                Delete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments; 