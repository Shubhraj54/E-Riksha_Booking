import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../utils/sessionManager";
import '../CSS/Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    recentBookings: [],
    totalRickshaws: 0
  });

  useEffect(() => {
    // Get current user using session manager
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load statistics
    const loadStats = () => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const rikshaList = JSON.parse(localStorage.getItem('rikshaList') || '[]');
      
      let userBookings = [];
      if (currentUser) {
        userBookings = bookings.filter(b => b.userId === currentUser.id);
      }

      setStats({
        totalBookings: userBookings.length,
        recentBookings: userBookings.slice(-3).reverse(), // Last 3 bookings
        totalRickshaws: rikshaList.length
      });
    };

    loadStats();
  }, []);

  return (
    <>
    {/* <Navbar /> */}
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <h1>Rent E-Rickshaw Easily!</h1>
        <p>Affordable, Eco-Friendly, and Available in Your Area.</p>
        <div className="btn-group">
          <Link to="/book" className="btn primary">📅 Book Now</Link>
          <Link to="/rickshaws" className="btn secondary">🛺 Browse Rickshaws</Link>
        </div>
      </section>

      {/* Dashboard Section for Logged-in Users */}
      {user && (
        <section className="dashboard-section">
          <h2>Welcome back, {user.name}! 👋</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛺</div>
              <div className="stat-content">
                <h3>{stats.totalRickshaws}</h3>
                <p>Available Rickshaws</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>4.8</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          {stats.recentBookings.length > 0 && (
            <div className="recent-bookings">
              <h3>Recent Bookings</h3>
              <div className="bookings-list">
                {stats.recentBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <h4>Booking #{booking.id}</h4>
                      <p>Date: {booking.date} at {booking.time}</p>
                      <p>Duration: {booking.bookingType === 'hourly' ? `${booking.hours} hour(s)` : `${booking.days} day(s)`}</p>
                    </div>
                    <div className="booking-status">
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/profile" className="view-all-btn">View All Bookings</Link>
            </div>
          )}
        </section>
      )}

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Find Rickshaw</h3>
            <p>Browse electric rickshaws in your city or nearby.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Book Instantly</h3>
            <p>Choose date & time and confirm your ride.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Enjoy Ride</h3>
            <p>Pay & ride with comfort and safety.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose E-Riksha?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Eco-Friendly</h3>
            <p>Zero emissions, helping protect our environment</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable</h3>
            <p>Cost-effective transportation solution</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Booking</h3>
            <p>Instant booking with real-time availability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Secure</h3>
            <p>Verified drivers and secure payment system</p>
          </div>
        </div>
      </section>
    </div>
    </>
    
  );
}

export default Home;
