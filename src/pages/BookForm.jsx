import React from 'react';
import '../CSS/BookForm.css';

function BookForm({ riksha, onBack }) {
  return (
    <div className="bookform-2col-container">
      <div className="bookform-left">
        {riksha && riksha.image && (
          <img src={riksha.image} alt={riksha.name} className="riksha-image" />
        )}
        <h2>{riksha ? riksha.name : 'E-Rickshaw'}</h2>
        {riksha && <p className="riksha-desc">{riksha.desc}</p>}
      </div>
      <div className="bookform-right">
        <form className="booking-form">
          <input type="text" placeholder="Your Name" required />
          <input type="text" placeholder="Pickup Location" required />
          <input type="text" placeholder="Drop Location" required />
          <input type="date" required />
          <button type="submit">Confirm Booking</button>
        </form>
        <button className="btn secondary" style={{marginTop: 16}} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

export default BookForm;
