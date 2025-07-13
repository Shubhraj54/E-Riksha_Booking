'use client'

import '../Style/download.css';
import '../Style/icons.css';
import { brandConfig } from '../config/brandConfig';

const RideDownloadSection = () => {
  return (
    <section id="download" className="ride_download-section">
      <div className="ride_download-container">
        <div className="ride_download-content">
          {/* Left Content */}
          <div className="ride_download-text">
            <h2 className="ride_download-title">
              Download <span className="ride_gradient-text">{brandConfig.app.name} App</span>
            </h2>
            <p className="ride_download-subtitle">
              Get the {brandConfig.app.name} app and experience the fastest, safest, and most affordable 
              bike taxi service in India. Available on iOS and Android.
            </p>

            {/* Features */}
            <div className="ride_download-features">
              <div className="ride_download-feature">
                <div className="ride_download-feature-icon">
                  <div className="ride_icon-zap"></div>
                </div>
                <div className="ride_download-feature-text">
                  <h4>Lightning Fast</h4>
                  <p>Book rides in seconds</p>
                </div>
              </div>

              <div className="ride_download-feature">
                <div className="ride_download-feature-icon">
                  <div className="ride_icon-shield"></div>
                </div>
                <div className="ride_download-feature-text">
                  <h4>100% Safe</h4>
                  <p>Verified riders & insurance</p>
                </div>
              </div>

              <div className="ride_download-feature">
                <div className="ride_download-feature-icon">
                  <div className="ride_icon-star"></div>
                </div>
                <div className="ride_download-feature-text">
                  <h4>Best Prices</h4>
                  <p>No surge pricing</p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="ride_download-apps">
              <button className="ride_download-app-button">
                <div className="ride_download-app-icon">
                  <div className="ride_icon-smartphone"></div>
                </div>
                <div className="ride_download-app-info">
                  <div className="ride_download-app-title">Download on App Store</div>
                  <div className="ride_download-app-subtitle">Available on iOS</div>
                  <div className="ride_download-app-rating">★★★★★ 4.8</div>
                </div>
              </button>

              <button className="ride_download-app-button">
                <div className="ride_download-app-icon">
                  <div className="ride_icon-smartphone"></div>
                </div>
                <div className="ride_download-app-info">
                  <div className="ride_download-app-title">Get it on Google Play</div>
                  <div className="ride_download-app-subtitle">Available on Android</div>
                  <div className="ride_download-app-rating">★★★★★ 4.7</div>
                </div>
              </button>
            </div>

            {/* QR Code */}
            <div className="ride_download-qr">
              <div className="ride_download-qr-code">
                <div className="ride_qr-placeholder">📱</div>
              </div>
              <p className="ride_download-qr-text">Scan to download</p>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="ride_download-image">
            <div className="ride_download-phone">
              <div className="ride_download-phone-screen">
                <div className="ride_app-preview-header">
                  <div className="ride_app-preview-logo">R</div>
                  <div className="ride_app-preview-title">{brandConfig.app.name}</div>
                </div>
                <div className="ride_app-preview-content">
                  <div className="ride_app-preview-location">
                    <div className="ride_location-dot pickup"></div>
                    <input type="text" placeholder="Pickup location" disabled />
                  </div>
                  <div className="ride_app-preview-location">
                    <div className="ride_location-dot drop"></div>
                    <input type="text" placeholder="Drop location" disabled />
                  </div>
                  <div className="ride_app-preview-services">
                    <div className="ride_app-preview-service">
                      <div className="ride_service-icon bike">🚗</div>
                      <div className="ride_service-name">Bike</div>
                      <div className="ride_service-price">₹25</div>
                    </div>
                    <div className="ride_app-preview-service">
                      <div className="ride_service-icon auto">🚙</div>
                      <div className="ride_service-name">Auto</div>
                      <div className="ride_service-price">₹40</div>
                    </div>
                    <div className="ride_app-preview-service">
                      <div className="ride_service-icon delivery">📦</div>
                      <div className="ride_service-name">Delivery</div>
                      <div className="ride_service-price">₹30</div>
                    </div>
                  </div>
                  <button className="ride_app-preview-button">Book Now</button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="ride_download-floating-elements">
              <div className="ride_download-floating-element ride_download-floating-top">
                <div className="ride_floating-icon-bg ride_floating-green">
                  <div className="ride_icon-download"></div>
                </div>
              </div>

              <div className="ride_download-floating-element ride_download-floating-bottom">
                <div className="ride_floating-icon-bg ride_floating-blue">
                  <div className="ride_icon-star"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RideDownloadSection 