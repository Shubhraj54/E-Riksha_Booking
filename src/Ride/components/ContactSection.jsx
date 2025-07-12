'use client'

import { useState } from 'react'

const ContactSection = () => {
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
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <h2 className="contact-title">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="contact-subtitle">
            Have questions or need assistance? We're here to help you 24/7. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <div className="icon-mail"></div>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Email Us</h3>
                <p className="contact-info-desc">support@rapido.com</p>
                <p className="contact-info-desc">business@rapido.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <div className="icon-phone"></div>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Call Us</h3>
                <p className="contact-info-desc">+91 1800-123-4567</p>
                <p className="contact-info-desc">24/7 Customer Support</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <div className="icon-map-pin"></div>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Visit Us</h3>
                <p className="contact-info-desc">Rapido Headquarters</p>
                <p className="contact-info-desc">Bangalore, Karnataka, India</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <div className="icon-clock"></div>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Business Hours</h3>
                <p className="contact-info-desc">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="contact-info-desc">Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3 className="contact-form-title">Send us a Message</h3>
              
              <div className="contact-form-group">
                <label className="contact-form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-form-textarea"
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-form-button">
                <div className="icon-send"></div>
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="contact-map">
          <div className="contact-map-placeholder">
            <div className="contact-map-content">
              <div className="icon-map-pin-large"></div>
              <h3>Our Location</h3>
              <p>Interactive map showing our office location</p>
              <button className="contact-map-button">View on Google Maps</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 