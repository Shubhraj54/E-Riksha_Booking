'use client'

const Footer = () => {
  return (
    <footer className="ride_footer">
      <div className="ride_footer-container">
        <div className="ride_footer-content">
          {/* Company Info */}
          <div className="ride_footer-section">
            <div className="ride_footer-logo">
              <span className="ride_footer-logo-text">Rapido</span>
            </div>
            <p className="ride_footer-description">
              India's leading bike taxi platform, revolutionizing urban transportation 
              with technology-driven solutions and customer-centric approach.
            </p>
            <div className="ride_footer-social">
              <button className="ride_footer-social-button">
                <div className="ride_icon-facebook"></div>
              </button>
              <button className="ride_footer-social-button">
                <div className="ride_icon-twitter"></div>
              </button>
              <button className="ride_footer-social-button">
                <div className="ride_icon-instagram"></div>
              </button>
              <button className="ride_footer-social-button">
                <div className="ride_icon-youtube"></div>
              </button>
              <button className="ride_footer-social-button">
                <div className="ride_icon-linkedin"></div>
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="ride_footer-section">
            <h3 className="ride_footer-section-title">Services</h3>
            <div className="ride_footer-section-links">
              <a href="#services" className="ride_footer-section-link">Bike Taxi</a>
              <a href="#services" className="ride_footer-section-link">Auto Taxi</a>
              <a href="#services" className="ride_footer-section-link">Delivery</a>
              <a href="#services" className="ride_footer-section-link">Corporate</a>
              <a href="#services" className="ride_footer-section-link">Rentals</a>
            </div>
          </div>

          {/* Company */}
          <div className="ride_footer-section">
            <h3 className="ride_footer-section-title">Company</h3>
            <div className="ride_footer-section-links">
              <a href="#about" className="ride_footer-section-link">About Us</a>
              <a href="#safety" className="ride_footer-section-link">Safety</a>
              <a href="#careers" className="ride_footer-section-link">Careers</a>
              <a href="#press" className="ride_footer-section-link">Press</a>
              <a href="#partners" className="ride_footer-section-link">Partners</a>
            </div>
          </div>

          {/* Support */}
          <div className="ride_footer-section">
            <h3 className="ride_footer-section-title">Support</h3>
            <div className="ride_footer-section-links">
              <a href="#help" className="ride_footer-section-link">Help Center</a>
              <a href="#contact" className="ride_footer-section-link">Contact Us</a>
              <a href="#safety" className="ride_footer-section-link">Safety Center</a>
              <a href="#community" className="ride_footer-section-link">Community</a>
              <a href="#feedback" className="ride_footer-section-link">Feedback</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="ride_footer-section">
            <h3 className="ride_footer-section-title">Contact</h3>
            <div className="ride_footer-contact-info">
              <div className="ride_footer-contact-item">
                <div className="ride_icon-mail-small"></div>
                <span>support@rapido.com</span>
              </div>
              <div className="ride_footer-contact-item">
                <div className="ride_icon-phone-small"></div>
                <span>+91 1800-123-4567</span>
              </div>
              <div className="ride_footer-contact-item">
                <div className="ride_icon-map-pin-small"></div>
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="ride_footer-bottom">
          <div className="ride_footer-bottom-content">
            <div className="ride_footer-copyright">
              <p>&copy; 2024 Rapido. All rights reserved.</p>
            </div>
            <div className="ride_footer-bottom-links">
              <a href="#privacy" className="ride_footer-bottom-link">Privacy Policy</a>
              <a href="#terms" className="ride_footer-bottom-link">Terms of Service</a>
              <a href="#cookies" className="ride_footer-bottom-link">Cookie Policy</a>
              <a href="#accessibility" className="ride_footer-bottom-link">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 