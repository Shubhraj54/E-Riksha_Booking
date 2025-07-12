'use client'

const DownloadSection = () => {
  return (
    <section id="download" className="download-section">
      <div className="download-container">
        <div className="download-content">
          {/* Left Content */}
          <div className="download-text">
            <h2 className="download-title">
              Download <span className="gradient-text">Rapido App</span>
            </h2>
            <p className="download-subtitle">
              Get the Rapido app and experience the fastest, safest, and most affordable 
              bike taxi service in India. Available on iOS and Android.
            </p>

            {/* Features */}
            <div className="download-features">
              <div className="download-feature">
                <div className="download-feature-icon">
                  <div className="icon-zap"></div>
                </div>
                <div className="download-feature-text">
                  <h4>Lightning Fast</h4>
                  <p>Book rides in seconds</p>
                </div>
              </div>

              <div className="download-feature">
                <div className="download-feature-icon">
                  <div className="icon-shield"></div>
                </div>
                <div className="download-feature-text">
                  <h4>100% Safe</h4>
                  <p>Verified riders & insurance</p>
                </div>
              </div>

              <div className="download-feature">
                <div className="download-feature-icon">
                  <div className="icon-star"></div>
                </div>
                <div className="download-feature-text">
                  <h4>Best Prices</h4>
                  <p>No surge pricing</p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="download-apps">
              <button className="download-app-button">
                <div className="download-app-icon">
                  <div className="icon-smartphone"></div>
                </div>
                <div className="download-app-info">
                  <div className="download-app-title">Download on App Store</div>
                  <div className="download-app-subtitle">Available on iOS</div>
                  <div className="download-app-rating">★★★★★ 4.8</div>
                </div>
              </button>

              <button className="download-app-button">
                <div className="download-app-icon">
                  <div className="icon-smartphone"></div>
                </div>
                <div className="download-app-info">
                  <div className="download-app-title">Get it on Google Play</div>
                  <div className="download-app-subtitle">Available on Android</div>
                  <div className="download-app-rating">★★★★★ 4.7</div>
                </div>
              </button>
            </div>

            {/* QR Code */}
            <div className="download-qr">
              <div className="download-qr-code">
                <div className="qr-placeholder">📱</div>
              </div>
              <p className="download-qr-text">Scan to download</p>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="download-image">
            <div className="download-phone">
              <div className="download-phone-screen">
                <div className="app-preview-header">
                  <div className="app-preview-logo">R</div>
                  <div className="app-preview-title">Rapido</div>
                </div>
                <div className="app-preview-content">
                  <div className="app-preview-location">
                    <div className="location-dot pickup"></div>
                    <input type="text" placeholder="Pickup location" disabled />
                  </div>
                  <div className="app-preview-location">
                    <div className="location-dot drop"></div>
                    <input type="text" placeholder="Drop location" disabled />
                  </div>
                  <div className="app-preview-services">
                    <div className="app-preview-service">
                      <div className="service-icon bike">🚗</div>
                      <div className="service-name">Bike</div>
                      <div className="service-price">₹25</div>
                    </div>
                    <div className="app-preview-service">
                      <div className="service-icon auto">🚙</div>
                      <div className="service-name">Auto</div>
                      <div className="service-price">₹40</div>
                    </div>
                    <div className="app-preview-service">
                      <div className="service-icon delivery">📦</div>
                      <div className="service-name">Delivery</div>
                      <div className="service-price">₹30</div>
                    </div>
                  </div>
                  <button className="app-preview-button">Book Now</button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="download-floating-elements">
              <div className="download-floating-element download-floating-top">
                <div className="floating-icon-bg floating-green">
                  <div className="icon-download"></div>
                </div>
              </div>

              <div className="download-floating-element download-floating-bottom">
                <div className="floating-icon-bg floating-blue">
                  <div className="icon-star"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadSection 