'use client'

import '../Style/hero.css';
import { brandConfig } from '../config/brandConfig';

const RideHeroSection = () => {
  return (
    <section id="home" className="ride_hero">
      {/* Background Elements */}
      <div className="ride_hero-bg"></div>
      <div className="ride_hero-bg-2"></div>

      <div className="ride_hero-content">
        {/* Left Content */}
        <div className="ride_hero-text">
          <h1>
            <span>India's #1</span>
            <br />
            <span className="ride_gradient-text">Bike Taxi</span>
            <br />
            <span>Service</span>
          </h1>

          <p>
            Book bike rides, auto rides, and delivery services at affordable prices. 
            Fast, safe, and reliable transportation across India.
          </p>

          {/* Stats */}
          <div className="ride_hero-stats">
            <div className="ride_stat-item">
              <span>👥</span>
              <span>10M+ Users</span>
            </div>
            <div className="ride_stat-item">
              <span>📍</span>
              <span>100+ Cities</span>
            </div>
            <div className="ride_stat-item">
              <span>⭐</span>
              <span>4.5★ Rating</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="ride_hero-buttons">
            <button className="ride_btn ride_btn-primary ride_btn-lg">
              <span>📱</span>
              <span>Download App</span>
              <span>→</span>
            </button>
            <button className="ride_btn ride_btn-outline ride_btn-lg">
              <span>📞</span>
              <span>Book Now</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="ride_trust-indicators">
            <div className="ride_trust-item">
              <div className="ride_trust-dot green"></div>
              <span>100% Safe</span>
            </div>
            <div className="ride_trust-item">
              <div className="ride_trust-dot blue"></div>
              <span>24/7 Support</span>
            </div>
            <div className="ride_trust-item">
              <div className="ride_trust-dot purple"></div>
              <span>Instant Booking</span>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="ride_hero-image">
          <div className="ride_phone-mockup">
            <div className="ride_phone-screen">
              <div className="ride_app-header">
                <div className="ride_app-logo">R</div>
                <div className="ride_app-title">{brandConfig.app.name}</div>
              </div>
              <div className="ride_app-content">
                <div className="ride_location-input">
                  <div className="ride_location-dot pickup"></div>
                  <input type="text" placeholder="Pickup location" disabled />
                </div>
                <div className="ride_location-input">
                  <div className="ride_location-dot drop"></div>
                  <input type="text" placeholder="Drop location" disabled />
                </div>
                <div className="ride_service-options">
                  <div className="ride_service-option">
                    <div className="ride_service-icon bike">🚗</div>
                    <div className="ride_service-name">Bike</div>
                    <div className="ride_service-price">₹25</div>
                  </div>
                  <div className="ride_service-option">
                    <div className="ride_service-icon auto">🚙</div>
                    <div className="ride_service-name">Auto</div>
                    <div className="ride_service-price">₹40</div>
                  </div>
                  <div className="ride_service-option">
                    <div className="ride_service-icon delivery">📦</div>
                    <div className="ride_service-name">Delivery</div>
                    <div className="ride_service-price">₹30</div>
                  </div>
                </div>
                <button className="ride_book-button">Book Now</button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="ride_floating-element success">✅</div>
          <div className="ride_floating-element speed">⚡</div>
          <div className="ride_floating-element fire">🔥</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="ride_scroll-indicator">
        <div className="ride_scroll-dot"></div>
      </div>
    </section>
  )
}

export default RideHeroSection 