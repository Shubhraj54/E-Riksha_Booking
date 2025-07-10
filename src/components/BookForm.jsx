import React, { useState, useEffect } from 'react';
import '../CSS/BookForm.css';

const getCurrentDate = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};
const getCurrentTime = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

const BookForm = ({ riksha, onBack, onSubmit }) => {
  const [bookingType, setBookingType] = useState('hourly');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: getCurrentDate(),
    time: getCurrentTime(),
    hours: '',
    days: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setForm(f => ({ ...f, time: getCurrentTime() }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookingType = (e) => {
    setBookingType(e.target.value);
    setForm({ ...form, hours: '', days: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) onSubmit(form, bookingType);
  };

  if (submitted) {
    return (
      <div style={{textAlign: 'center', marginTop: 20}}>
        <h3>Thank you for booking!</h3>
        <p>We have received your booking details for <b>{riksha.name}</b> ({bookingType === 'hourly' ? `${form.hours} hour(s)` : `${form.days} day(s)`}).</p>
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
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="booking-type-group">
          <label>
            <input
              type="radio"
              name="bookingType"
              value="hourly"
              checked={bookingType === 'hourly'}
              onChange={handleBookingType}
            />
            Hourly
          </label>
          <label>
            <input
              type="radio"
              name="bookingType"
              value="day"
              checked={bookingType === 'day'}
              onChange={handleBookingType}
            />
            Day Wise
          </label>
        </div>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required type="tel" />
        <input name="date" value={form.date} onChange={handleChange} required type="date" min={getCurrentDate()} max={getCurrentDate()} />
        <input name="time" value={form.time} onChange={handleChange} required type="time" />
        {bookingType === 'hourly' ? (
          <input name="hours" value={form.hours} onChange={handleChange} placeholder="Number of Hours" required type="number" min="1" max="24" />
        ) : (
          <input name="days" value={form.days} onChange={handleChange} placeholder="Number of Days" required type="number" min="1" max="30" />
        )}
        <button type="submit" className="book-now-button">Book Now</button>
      </form>
    </div>
  );
};

export default BookForm;
