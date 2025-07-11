import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../utils/sessionManager';
import { useNotifications } from '../contexts/NotificationContext';
import PaymentModal from './PaymentModal';
import LocationPicker from './LocationPicker';
import locationService from '../services/locationService';
import '../CSS/BookForm.css';

const getCurrentDate = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getCurrentTime = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

// Validation schema
const createValidationSchema = (bookingType) => {
  return yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    phone: yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    date: yup.date()
      .required('Date is required')
      .min(new Date(), 'Date must be today or in the future'),
    time: yup.string().required('Time is required'),
    hours: bookingType === 'hourly' 
      ? yup.number()
          .required('Number of hours is required')
          .min(1, 'Minimum 1 hour')
          .max(24, 'Maximum 24 hours')
      : yup.number().notRequired(),
    days: bookingType === 'day'
      ? yup.number()
          .required('Number of days is required')
          .min(1, 'Minimum 1 day')
          .max(30, 'Maximum 30 days')
      : yup.number().notRequired(),
  });
};

const BookForm = ({ riksha, onBack, onSubmit }) => {
  const [bookingType, setBookingType] = useState('hourly');
  const [submitted, setSubmitted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const { addNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(createValidationSchema(bookingType)),
    defaultValues: {
      name: '',
      phone: '',
      date: getCurrentDate(),
      time: getCurrentTime(),
      hours: '',
      days: '',
    }
  });

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setValue('time', getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, [setValue]);

  // Reset form when booking type changes
  useEffect(() => {
    reset({
      ...watch(),
      hours: '',
      days: ''
    });
  }, [bookingType, reset, watch]);

  const handleBookingType = (e) => {
    setBookingType(e.target.value);
  };

  const onFormSubmit = async (data) => {
    try {
      // Check if user is logged in
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to make a booking');
        return;
      }

      // Simulate API call with loading toast
      const loadingToast = toast.loading('Processing your booking...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save booking to localStorage (temporary solution)
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        id: Date.now(),
        userId: currentUser.id,
        rikshaId: riksha.id,
        ...data,
        bookingType,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Set current booking and show payment modal
      setCurrentBooking({ ...data, bookingType, id: newBooking.id });
      setShowPaymentModal(true);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Add booking notification
    addNotification({
      title: 'Booking Confirmed!',
      message: `Your booking for ${riksha.name} has been confirmed. Payment of ₹${paymentResult.amount} received.`,
      type: 'success',
      category: 'booking',
      actionUrl: '/profile'
    });
    
    setSubmitted(true);
    setShowPaymentModal(false);
    if (onSubmit) onSubmit(currentBooking, currentBooking.bookingType);
  };

  const handleLocationSelect = (pickupPoint) => {
    setSelectedPickupPoint(pickupPoint);
    setShowLocationPicker(false);
    
    // Calculate location-based pricing
    if (pickupPoint) {
      const basePrice = riksha.price;
      const locationPrice = locationService.calculateLocationPricing(
        basePrice, 
        null, // Will be updated when user location is available
        pickupPoint
      );
      
      // Update form with pickup point info
      setValue('pickupPoint', pickupPoint.name);
      setValue('pickupAddress', pickupPoint.address);
      
      toast.success(`Selected pickup point: ${pickupPoint.name}`);
    }
  };

  if (submitted) {
    const formData = watch();
    return (
      <div style={{textAlign: 'center', marginTop: 20}}>
        <h3>Thank you for booking!</h3>
        <p>We have received your booking details for <b>{riksha.name}</b> ({bookingType === 'hourly' ? `${formData.hours} hour(s)` : `${formData.days} day(s)`}).</p>
        <p>Payment has been processed successfully. You can collect your vehicle from our location.</p>
        <button className="back-btn" onClick={onBack}>Book Another</button>
      </div>
    );
  }

  return (
    <div className="bookform-flex">
      <div className="selected-riksha">
        <img src={riksha.image} alt={riksha.name} className="riksha-img" />
        <h4>{riksha.name}</h4>
        <p>{riksha.desc}</p>
        <button className="back-btn" onClick={onBack}>&larr; Back to list</button>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="booking-form">
        <div className="booking-type-group">
          <label>
            <input
              type="radio"
              value="hourly"
              checked={bookingType === 'hourly'}
              onChange={handleBookingType}
            />
            Hourly
          </label>
          <label>
            <input
              type="radio"
              value="day"
              checked={bookingType === 'day'}
              onChange={handleBookingType}
            />
            Day Wise
          </label>
        </div>
        
        <div className="form-group">
          <input 
            {...register('name')}
            placeholder="Your Name" 
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <input 
            {...register('phone')}
            placeholder="Phone Number" 
            type="tel"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <input 
            {...register('date')}
            type="date" 
            min={getCurrentDate()}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date.message}</span>}
        </div>

        <div className="form-group">
          <input 
            {...register('time')}
            type="time"
            className={errors.time ? 'error' : ''}
          />
          {errors.time && <span className="error-message">{errors.time.message}</span>}
        </div>

        {/* Pickup Point Selection */}
        <div className="form-group">
          <label className="form-label">Pickup Location</label>
          {selectedPickupPoint ? (
            <div className="selected-pickup">
              <div className="pickup-info">
                <h4>{selectedPickupPoint.name}</h4>
                <p>{selectedPickupPoint.address}</p>
                <span className="pickup-type">{selectedPickupPoint.type}</span>
              </div>
              <button 
                type="button" 
                className="change-pickup-btn"
                onClick={() => setShowLocationPicker(true)}
              >
                Change
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="select-pickup-btn"
              onClick={() => setShowLocationPicker(true)}
            >
              📍 Select Pickup Point
            </button>
          )}
        </div>

        {bookingType === 'hourly' ? (
          <div className="form-group">
            <input 
              {...register('hours')}
              placeholder="Number of Hours" 
              type="number" 
              min="1" 
              max="24"
              className={errors.hours ? 'error' : ''}
            />
            {errors.hours && <span className="error-message">{errors.hours.message}</span>}
          </div>
        ) : (
          <div className="form-group">
            <input 
              {...register('days')}
              placeholder="Number of Days" 
              type="number" 
              min="1" 
              max="30"
              className={errors.days ? 'error' : ''}
            />
            {errors.days && <span className="error-message">{errors.days.message}</span>}
          </div>
        )}
        
        <button 
          type="submit" 
          className="book-now-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
      </form>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={currentBooking}
        vehicle={riksha}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="modal-overlay">
          <div className="location-modal">
            <div className="modal-header">
              <h3>Select Pickup Location</h3>
              <button 
                className="close-btn"
                onClick={() => setShowLocationPicker(false)}
              >
                ✕
              </button>
            </div>
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedPickupPoint}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookForm;
