'use client'

import { useState } from 'react'
import '../Style/contact.css';
import '../Style/icons.css';
import { brandConfig } from '../config/brandConfig';

const RideContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <section id="contact" className="ride_contact-section">
      <div className="ride_contact-container">
        {/* Section Header */}
        <div className="ride_contact-header">
          <h2 className="ride_contact-title">
            Get in <span className="ride_gradient-text">Touch</span>
          </h2>
          <p className="ride_contact-subtitle">
            Have questions or need assistance? We're here to help you 24/7. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="ride_contact-content">
          {/* Contact Information */}
          <div className="ride_contact-info">
            <div className="ride_contact-info-item">
              <div className="ride_contact-info-icon">
                <div className="ride_icon-mail"></div>
              </div>
              <div className="ride_contact-info-content">
                <h3 className="ride_contact-info-title">Email Us</h3>
                <p className="ride_contact-info-desc">{brandConfig.email.support}</p>
                <p className="ride_contact-info-desc">{brandConfig.email.business}</p>
              </div>
            </div>

            <div className="ride_contact-info-item">
              <div className="ride_contact-info-icon">
                <div className="ride_icon-phone"></div>
              </div>
              <div className="ride_contact-info-content">
                <h3 className="ride_contact-info-title">Call Us</h3>
                <p className="ride_contact-info-desc">{brandConfig.phone}</p>
                <p className="ride_contact-info-desc">24/7 Customer Support</p>
              </div>
            </div>

            <div className="ride_contact-info-item">
              <div className="ride_contact-info-icon">
                <div className="ride_icon-map-pin"></div>
              </div>
              <div className="ride_contact-info-content">
                <h3 className="ride_contact-info-title">Visit Us</h3>
                <p className="ride_contact-info-desc">{brandConfig.address.split(',')[0]}</p>
                <p className="ride_contact-info-desc">{brandConfig.address.split(',').slice(1).join(',').trim()}</p>
              </div>
            </div>

            <div className="ride_contact-info-item">
              <div className="ride_contact-info-icon">
                <div className="ride_icon-clock"></div>
              </div>
              <div className="ride_contact-info-content">
                <h3 className="ride_contact-info-title">Business Hours</h3>
                <p className="ride_contact-info-desc">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="ride_contact-info-desc">Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="ride_contact-form-container">
            <form className="ride_contact-form" onSubmit={handleSubmit}>
              <h3 className="ride_contact-form-title">Send us a Message</h3>
              
              <div className="ride_contact-form-group">
                <label className="ride_contact-form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ride_contact-form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="ride_contact-form-group">
                <label className="ride_contact-form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ride_contact-form-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="ride_contact-form-group">
                <label className="ride_contact-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="ride_contact-form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="ride_contact-form-group">
                <label className="ride_contact-form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="ride_contact-form-input"
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="ride_contact-form-group">
                <label className="ride_contact-form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="ride_contact-form-textarea"
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="ride_contact-form-button">
                <div className="ride_icon-send"></div>
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="ride_contact-map">
          <div className="ride_contact-map-placeholder">
            <div className="ride_contact-map-content">
              <div className="ride_icon-map-pin-large"></div>
              <h3>Our Location</h3>
              <p>Interactive map showing our office location</p>
              <button className="ride_contact-map-button">View on Google Maps</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RideContactSection 