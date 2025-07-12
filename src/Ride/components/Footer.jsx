'use client'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-text">Rapido</span>
            </div>
            <p className="footer-description">
              India's leading bike taxi platform, revolutionizing urban transportation 
              with technology-driven solutions and customer-centric approach.
            </p>
            <div className="footer-social">
              <button className="footer-social-button">
                <div className="icon-facebook"></div>
              </button>
              <button className="footer-social-button">
                <div className="icon-twitter"></div>
              </button>
              <button className="footer-social-button">
                <div className="icon-instagram"></div>
              </button>
              <button className="footer-social-button">
                <div className="icon-youtube"></div>
              </button>
              <button className="footer-social-button">
                <div className="icon-linkedin"></div>
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-section-title">Services</h3>
            <div className="footer-section-links">
              <a href="#services" className="footer-section-link">Bike Taxi</a>
              <a href="#services" className="footer-section-link">Auto Taxi</a>
              <a href="#services" className="footer-section-link">Delivery</a>
              <a href="#services" className="footer-section-link">Corporate</a>
              <a href="#services" className="footer-section-link">Rentals</a>
            </div>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h3 className="footer-section-title">Company</h3>
            <div className="footer-section-links">
              <a href="#about" className="footer-section-link">About Us</a>
              <a href="#safety" className="footer-section-link">Safety</a>
              <a href="#careers" className="footer-section-link">Careers</a>
              <a href="#press" className="footer-section-link">Press</a>
              <a href="#partners" className="footer-section-link">Partners</a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-section-title">Support</h3>
            <div className="footer-section-links">
              <a href="#help" className="footer-section-link">Help Center</a>
              <a href="#contact" className="footer-section-link">Contact Us</a>
              <a href="#safety" className="footer-section-link">Safety Center</a>
              <a href="#community" className="footer-section-link">Community</a>
              <a href="#feedback" className="footer-section-link">Feedback</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-section-title">Contact</h3>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <div className="icon-mail-small"></div>
                <span>support@rapido.com</span>
              </div>
              <div className="footer-contact-item">
                <div className="icon-phone-small"></div>
                <span>+91 1800-123-4567</span>
              </div>
              <div className="footer-contact-item">
                <div className="icon-map-pin-small"></div>
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 Rapido. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#privacy" className="footer-bottom-link">Privacy Policy</a>
              <a href="#terms" className="footer-bottom-link">Terms of Service</a>
              <a href="#cookies" className="footer-bottom-link">Cookie Policy</a>
              <a href="#accessibility" className="footer-bottom-link">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 