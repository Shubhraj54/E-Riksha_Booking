'use client'

import { useState } from 'react';
import { Outlet } from 'react-router-dom'; 

const Navbarx = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (<>
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="navbar-logo-text">RideX</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <a href="#home" className="navbar-menu-item">
            <span className="navbar-menu-link">Home</span>
          </a>
          <a href="#services" className="navbar-menu-item">
            <span className="navbar-menu-link">Services</span>
          </a>
          <a href="#safety" className="navbar-menu-item">
            <span className="navbar-menu-link">Safety</span>
          </a>
          <a href="#about" className="navbar-menu-item">
            <span className="navbar-menu-link">About</span>
          </a>
          <a href="#contact" className="navbar-menu-item">
            <span className="navbar-menu-link">Contact</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="navbar-cta">
          <button className="navbar-cta-button navbar-cta-secondary">
            Login
          </button>
          <button className="navbar-cta-button navbar-cta-primary">
            Download App
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <div className="icon-close"></div>
          ) : (
            <div className="icon-menu"></div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <a href="#home" className="navbar-mobile-item" onClick={toggleMenu}>
            Home
          </a>
          <a href="#services" className="navbar-mobile-item" onClick={toggleMenu}>
            Services
          </a>
          <a href="#safety" className="navbar-mobile-item" onClick={toggleMenu}>
            Safety
          </a>
          <a href="#about" className="navbar-mobile-item" onClick={toggleMenu}>
            About
          </a>
          <a href="#contact" className="navbar-mobile-item" onClick={toggleMenu}>
            Contact
          </a>
          <div className="navbar-mobile-cta">
            <button className="navbar-mobile-button navbar-mobile-button-secondary">
              Login
            </button>
            <button className="navbar-mobile-button navbar-mobile-button-primary">
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