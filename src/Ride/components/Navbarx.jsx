'use client'

import { useState } from 'react';
import { Outlet } from 'react-router-dom'; 

const Navbarx = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
          <a href="#home" className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Home</span>
          </a>
          <a href="#services" className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Services</span>
          </a>
          <a href="#safety" className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Safety</span>
          </a>
          <a href="#about" className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">About</span>
          </a>
          <a href="#contact" className="ride_navbar-menu-item">
            <span className="ride_navbar-menu-link">Contact</span>
          </a>
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
          <a href="#home" className="ride_navbar-mobile-item" onClick={toggleMenu}>
            Home
          </a>
          <a href="#services" className="ride_navbar-mobile-item" onClick={toggleMenu}>
            Services
          </a>
          <a href="#safety" className="ride_navbar-mobile-item" onClick={toggleMenu}>
            Safety
          </a>
          <a href="#about" className="ride_navbar-mobile-item" onClick={toggleMenu}>
            About
          </a>
          <a href="#contact" className="ride_navbar-mobile-item" onClick={toggleMenu}>
            Contact
          </a>
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
    <Outlet /></>
    
  )
}

export default Navbarx 