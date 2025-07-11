import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Oops! Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="suggestions">
          <h3>Here are some helpful links:</h3>
          <div className="suggestion-links">
            <Link to="/" className="suggestion-link">
              <span className="link-icon">🏠</span>
              <span>Go to Home</span>
            </Link>
            <Link to="/rickshaws" className="suggestion-link">
              <span className="link-icon">🛺</span>
              <span>Browse Rickshaws</span>
            </Link>
            <Link to="/book" className="suggestion-link">
              <span className="link-icon">📅</span>
              <span>Book a Ride</span>
            </Link>
            <Link to="/contact" className="suggestion-link">
              <span className="link-icon">📞</span>
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

        <div className="search-section">
          <h3>Or search for what you need:</h3>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search for rickshaws, booking, etc..."
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>

        <div className="back-actions">
          <button 
            onClick={() => window.history.back()} 
            className="back-btn"
          >
            ← Go Back
          </button>
          <Link to="/" className="home-btn">
            🏠 Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 