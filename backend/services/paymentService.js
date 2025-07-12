exports.processPayment = async (paymentData) => {
  // TODO: Integrate with Razorpay or other gateway
  return { status: 'success', transactionId: 'demo123' };
};

exports.refundPayment = async (paymentId, reason) => {
  // TODO: Integrate refund logic
  return { status: 'refunded', paymentId, reason };
}; 