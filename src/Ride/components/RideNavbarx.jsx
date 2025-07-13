'use client'

import { useState } from 'react';
import '../Style/navbar.css';
import '../Style/icons.css'; 

const RideNavbarx = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }

  return (<>
    <nav className="ride_navbar">
      <div className="ride_navbar-container">
        {/* Logo */}
        <div className="ride_navbar-logo">
          <span className="ride_navbar-logo-text">RideX</span>
        </div>

        {/* Desktop Menu */}
        <div className="ride_navbar-menu">
          <button onClick={() => scrollToSection('home')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Home</span>
          </button>
          <button onClick={() => scrollToSection('services')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Services</span>
          </button>
          <button onClick={() => scrollToSection('safety')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Safety</span>
          </button>
          <button onClick={() => scrollToSection('about')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">About</span>
          </button>
          <button onClick={() => scrollToSection('contact')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Contact</span>
          </button>
          <button onClick={() => scrollToSection('download')} className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Download</span>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="ride_navbar-cta">
          <button className="ride_navbar-cta-button ride_navbar-cta-secondary">
            Login
          </button>
          <button className="ride_navbar-cta-button ride_navbar-cta-primary">
            Download App
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="ride_navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <div className="ride_icon-close"></div>
          ) : (
            <div className="ride_icon-menu"></div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="ride_navbar-mobile-menu">
          <button onClick={() => scrollToSection('home')} className="ride_navbar-mobile-item">
            Home
          </button>
          <button onClick={() => scrollToSection('services')} className="ride_navbar-mobile-item">
            Services
          </button>
          <button onClick={() => scrollToSection('safety')} className="ride_navbar-mobile-item">
            Safety
          </button>
          <button onClick={() => scrollToSection('about')} className="ride_navbar-mobile-item">
            About
          </button>
          <button onClick={() => scrollToSection('contact')} className="ride_navbar-mobile-item">
            Contact
          </button>
          <button onClick={() => scrollToSection('download')} className="ride_navbar-mobile-item">
            Download
          </button>
          <div className="ride_navbar-mobile-cta">
            <button className="ride_navbar-mobile-button ride_navbar-mobile-button-secondary">
              Login
            </button>
            <button className="ride_navbar-mobile-button ride_navbar-mobile-button-primary">
              Download App
            </button>
          </div>
        </div>
        
      )}
    </nav>
    </>
    
  )
}

export default RideNavbarx 