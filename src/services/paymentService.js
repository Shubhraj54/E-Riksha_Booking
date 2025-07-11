// Payment Service for Admin Dashboard
class PaymentService {
  // Get recent payments
  getRecentPayments(limit = 5) {
    try {
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      return payments
        .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
        .slice(0, limit)
        .map(payment => ({
          id: payment.id || payment.paymentId,
          customerName: payment.customerName || payment.userName || 'Unknown Customer',
          amount: payment.amount || 0,
          status: payment.status || 'pending',
          date: payment.date || payment.timestamp,
          method: payment.method || 'online'
        }));
    } catch (error) {
      console.error('Error getting recent payments:', error);
      return [];
    }
  }

  // Get all payments
  getAllPayments() {
    try {
      return JSON.parse(localStorage.getItem('payments') || '[]');
    } catch (error) {
      console.error('Error getting all payments:', error);
      return [];
    }
  }

  // Get payment statistics
  getPaymentStats() {
    try {
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      const successfulPayments = payments.filter(p => p.status === 'success').length;
      const failedPayments = payments.filter(p => p.status === 'failed').length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;

      return {
        totalPayments: payments.length,
        totalAmount,
        successfulPayments,
        failedPayments,
        pendingPayments,
        successRate: payments.length > 0 ? (successfulPayments / payments.length) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      return {
        totalPayments: 0,
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        successRate: 0
      };
    }
  }
}

export default new PaymentService(); 