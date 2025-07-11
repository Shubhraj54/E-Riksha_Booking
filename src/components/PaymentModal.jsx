import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import { useNotifications } from '../contexts/NotificationContext';
import toast from 'react-hot-toast';
import '../CSS/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, bookingData, vehicle, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isOpen && bookingData && vehicle) {
      const calculatedAmount = paymentService.calculateRentalAmount(
        vehicle,
        bookingData.bookingType,
        bookingData.bookingType === 'hourly' ? bookingData.hours : bookingData.days
      );
      setAmount(calculatedAmount);
    }
  }, [isOpen, bookingData, vehicle]);

  const handlePayment = async () => {
    if (!bookingData || !vehicle) {
      toast.error('Booking data is missing');
      return;
    }

    setLoading(true);
    try {
      // Initialize payment
      const { options } = await paymentService.initializePayment(bookingData, vehicle);
      
      // Create Razorpay instance
      const rzp = new window.Razorpay(options);
      
      // Handle payment success
      rzp.on('payment.success', async (response) => {
        try {
          const result = await paymentService.handlePaymentSuccess(response, bookingData, vehicle, amount);
          
          // Add payment notification
          addNotification({
            title: 'Payment Successful!',
            message: `Payment of ₹${amount} has been processed successfully.`,
            type: 'success',
            category: 'payment',
            actionUrl: '/profile'
          });

          // Generate invoice
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amount,
            bookingData: bookingData,
            vehicle: vehicle,
            timestamp: new Date().toISOString()
          };

          const invoice = paymentService.generateInvoice(paymentData);
          setPaymentDetails({ ...result, invoice });

          toast.success('Payment successful! Invoice will be downloaded.');
          
          // Download invoice
          setTimeout(() => {
            paymentService.downloadInvoice(invoice);
          }, 1000);

          if (onPaymentSuccess) {
            onPaymentSuccess(result);
          }
        } catch (error) {
          console.error('Payment success handling error:', error);
          toast.error('Payment successful but failed to process details');
        }
      });

      // Handle payment failure
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        
        addNotification({
          title: 'Payment Failed',
          message: 'Your payment was unsuccessful. Please try again.',
          type: 'error',
          category: 'payment'
        });
      });

      // Open Razorpay modal
      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPayment = async () => {
    setLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoPaymentId = `demo_${Date.now()}`;
      const result = {
        success: true,
        paymentId: demoPaymentId,
        amount: amount,
        message: 'Demo payment successful!'
      };

      // Save demo payment
      const paymentData = {
        paymentId: demoPaymentId,
        orderId: `demo_order_${Date.now()}`,
        signature: 'demo_signature',
        amount: amount,
        bookingData: bookingData,
        vehicle: vehicle,
        timestamp: new Date().toISOString()
      };

      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push(paymentData);
      localStorage.setItem('payments', JSON.stringify(payments));

      // Add notification
      addNotification({
        title: 'Demo Payment Successful!',
        message: `Demo payment of ₹${amount} has been processed.`,
        type: 'success',
        category: 'payment',
        actionUrl: '/profile'
      });

      // Generate invoice
      const invoice = paymentService.generateInvoice(paymentData);
      setPaymentDetails({ ...result, invoice });

      toast.success('Demo payment successful! Invoice will be downloaded.');
      
      // Download invoice
      setTimeout(() => {
        paymentService.downloadInvoice(invoice);
      }, 1000);

      if (onPaymentSuccess) {
        onPaymentSuccess(result);
      }
    } catch (error) {
      console.error('Demo payment error:', error);
      toast.error('Demo payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h3>Payment Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-content">
          {!paymentDetails ? (
            <>
              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span>Vehicle:</span>
                  <span>{vehicle?.name}</span>
                </div>
                <div className="summary-item">
                  <span>Type:</span>
                  <span>{vehicle?.type}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{bookingData?.date}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{bookingData?.time}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>
                    {bookingData?.bookingType === 'hourly' 
                      ? `${bookingData?.hours} hour(s)` 
                      : `${bookingData?.days} day(s)`}
                  </span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>₹{amount}</span>
                </div>
              </div>

              <div className="payment-options">
                <h4>Payment Options</h4>
                <div className="payment-buttons">
                  <button 
                    className="payment-btn primary"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay with Razorpay'}
                  </button>
                  <button 
                    className="payment-btn demo"
                    onClick={handleDemoPayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Demo Payment'}
                  </button>
                </div>
                <p className="payment-note">
                  <strong>Note:</strong> For demo purposes, you can use the "Demo Payment" option. 
                  For real payments, you'll need to configure Razorpay with your API keys.
                </p>
              </div>
            </>
          ) : (
            <div className="payment-success">
              <div className="success-icon">✅</div>
              <h4>Payment Successful!</h4>
              <p>Your payment of ₹{amount} has been processed successfully.</p>
              
              <div className="payment-details">
                <div className="detail-item">
                  <span>Payment ID:</span>
                  <span>{paymentDetails.paymentId}</span>
                </div>
                <div className="detail-item">
                  <span>Amount:</span>
                  <span>₹{paymentDetails.amount}</span>
                </div>
                <div className="detail-item">
                  <span>Status:</span>
                  <span className="status-success">Completed</span>
                </div>
              </div>

              <div className="success-actions">
                <button 
                  className="action-btn"
                  onClick={() => paymentService.downloadInvoice(paymentDetails.invoice)}
                >
                  Download Invoice
                </button>
                <button className="action-btn secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 