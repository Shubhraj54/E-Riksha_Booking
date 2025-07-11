import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import paymentService from '../services/paymentService';
import { getCurrentUser } from '../utils/sessionManager';
import '../CSS/PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const paymentHistory = paymentService.getPaymentHistory(user.id);
      setPayments(paymentHistory);
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPayments = () => {
    if (filterStatus === 'all') {
      return payments;
    }
    return payments.filter(payment => payment.status === filterStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2e7d32';
      case 'pending':
        return '#f57c00';
      case 'failed':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const handleDownloadInvoice = (payment) => {
    const invoice = paymentService.generateInvoice(payment);
    paymentService.downloadInvoice(invoice);
  };

  const handleRefund = async (payment) => {
    try {
      const result = await paymentService.refundPayment(payment.paymentId, 'Customer request');
      alert(`Refund processed: ${result.message}`);
      loadPaymentHistory(); // Reload to get updated status
    } catch (error) {
      alert('Failed to process refund');
    }
  };

  if (loading) {
    return (
      <div className="payment-history">
        <h3>Payment History</h3>
        <div className="loading">Loading payment history...</div>
      </div>
    );
  }

  const filteredPayments = getFilteredPayments();

  return (
    <div className="payment-history">
      <div className="payment-header">
        <h3>Payment History</h3>
        <div className="payment-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="no-payments">
          <p>No payments found.</p>
        </div>
      ) : (
        <div className="payments-list">
          {filteredPayments.map((payment) => (
            <div key={payment.paymentId} className="payment-item">
              <div className="payment-info">
                <div className="payment-header">
                  <h4>Payment #{payment.paymentId.slice(-8)}</h4>
                  <span 
                    className="payment-status"
                    style={{ backgroundColor: getStatusColor(payment.status || 'completed') }}
                  >
                    {payment.status || 'completed'}
                  </span>
                </div>
                
                <div className="payment-details">
                  <div className="detail-row">
                    <span>Vehicle:</span>
                    <span>{payment.vehicle?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Amount:</span>
                    <span className="amount">₹{payment.amount}</span>
                  </div>
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{format(new Date(payment.timestamp), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Time:</span>
                    <span>{format(new Date(payment.timestamp), 'HH:mm')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Booking:</span>
                    <span>
                      {payment.bookingData?.bookingType === 'hourly' 
                        ? `${payment.bookingData?.hours} hour(s)` 
                        : `${payment.bookingData?.days} day(s)`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="payment-actions">
                <button 
                  className="action-btn download"
                  onClick={() => handleDownloadInvoice(payment)}
                  title="Download Invoice"
                >
                  📄 Invoice
                </button>
                {payment.status === 'completed' && (
                  <button 
                    className="action-btn refund"
                    onClick={() => handleRefund(payment)}
                    title="Request Refund"
                  >
                    💰 Refund
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <div className="payment-summary">
          <div className="summary-item">
            <span>Total Payments:</span>
            <span>{payments.length}</span>
          </div>
          <div className="summary-item">
            <span>Total Amount:</span>
            <span>₹{payments.reduce((sum, payment) => sum + payment.amount, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 