'use client'

const HeroSection = () => {
  return (
    <section id="home" className="hero">
      {/* Background Elements */}
      <div className="hero-bg"></div>
      <div className="hero-bg-2"></div>

      <div className="hero-content">
        {/* Left Content */}
        <div className="hero-text">
          <h1>
            <span>India's #1</span>
            <br />
            <span className="gradient-text">Bike Taxi</span>
            <br />
            <span>Service</span>
          </h1>

          <p>
            Book bike rides, auto rides, and delivery services at affordable prices. 
            Fast, safe, and reliable transportation across India.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span>👥</span>
              <span>10M+ Users</span>
            </div>
            <div className="stat-item">
              <span>📍</span>
              <span>100+ Cities</span>
            </div>
            <div className="stat-item">
              <span>⭐</span>
              <span>4.5★ Rating</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg">
              <span>📱</span>
              <span>Download App</span>
              <span>→</span>
            </button>
            <button className="btn btn-outline btn-lg">
              <span>📞</span>
              <span>Book Now</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <div className="trust-dot green"></div>
              <span>100% Safe</span>
            </div>
            <div className="trust-item">
              <div className="trust-dot blue"></div>
              <span>24/7 Support</span>
            </div>
            <div className="trust-item">
              <div className="trust-dot purple"></div>
              <span>Instant Booking</span>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="hero-image">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="app-header">
                <div className="app-logo">R</div>
                <div className="app-title">Rapido</div>
              </div>
              <div className="app-content">
                <div className="location-input">
                  <div className="location-dot pickup"></div>
                  <input type="text" placeholder="Pickup location" disabled />
                </div>
                <div className="location-input">
                  <div className="location-dot drop"></div>
                  <input type="text" placeholder="Drop location" disabled />
                </div>
                <div className="service-options">
                  <div className="service-option">
                    <div className="service-icon bike">🚗</div>
                    <div className="service-name">Bike</div>
                    <div className="service-price">₹25</div>
                  </div>
                  <div className="service-option">
                    <div className="service-icon auto">🚙</div>
                    <div className="service-name">Auto</div>
                    <div className="service-price">₹40</div>
                  </div>
                  <div className="service-option">
                    <div className="service-icon delivery">📦</div>
                    <div className="service-name">Delivery</div>
                    <div className="service-price">₹30</div>
                  </div>
                </div>
                <button className="book-button">Book Now</button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="floating-element success">✅</div>
          <div className="floating-element speed">⚡</div>
          <div className="floating-element fire">🔥</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
      </div>
    </section>
  )
}

export default HeroSection 