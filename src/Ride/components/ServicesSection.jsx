'use client'

const services = [
  {
    id: 1,
    title: 'Bike Taxi',
    description: 'Quick and affordable bike rides for short distances. Beat traffic and reach your destination faster.',
    iconClass: 'icon-bike',
    features: ['Starting from ₹25', '5 min pickup time', '100% verified riders'],
    color: 'blue',
    popular: true
  },
  {
    id: 2,
    title: 'Auto Taxi',
    description: 'Comfortable auto rides for medium distances. Perfect for family trips and luggage.',
    iconClass: 'icon-car',
    features: ['Starting from ₹40', '7 min pickup time', 'Spacious seating'],
    color: 'green',
    popular: false
  },
  {
    id: 3,
    title: 'Delivery',
    description: 'Fast and reliable delivery services. From food to packages, we deliver everything.',
    iconClass: 'icon-package',
    features: ['Starting from ₹30', '30 min delivery', 'Real-time tracking'],
    color: 'purple',
    popular: false
  }
]

const features = [
  {
    iconClass: 'icon-clock',
    title: 'Quick Pickup',
    description: 'Average pickup time of 5-7 minutes'
  },
  {
    iconClass: 'icon-shield',
    title: 'Safe Rides',
    description: 'All riders are verified and insured'
  },
  {
    iconClass: 'icon-dollar',
    title: 'Affordable',
    description: 'Best prices guaranteed with no hidden charges'
  },
  {
    iconClass: 'icon-map-pin',
    title: 'Wide Coverage',
    description: 'Available in 100+ cities across India'
  }
]

const ServicesSection = () => {
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        {/* Section Header */}
        <div className="services-header">
          <h2 className="services-title">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="services-subtitle">
            Choose from our wide range of transportation and delivery services. 
            Fast, safe, and affordable options for every need.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card service-card-${service.color}`}
            >
              {service.popular && (
                <div className="service-popular">
                  <span className="service-popular-badge">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`service-icon-bg service-icon-bg-${service.color}`}>
                <div className={`service-icon ${service.iconClass}`}></div>
              </div>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>

              <ul className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="service-feature">
                    <div className={`service-dot service-dot-${service.color}`}></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`service-button service-button-${service.color}`}>
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-header">
            <h3 className="features-title">
              Why Choose <span className="gradient-text">Rapido</span>?
            </h3>
            <p className="features-desc">
              We provide the best transportation experience with safety, speed, and affordability at the core.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-bg">
                  <div className={`feature-icon ${feature.iconClass}`}></div>
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.5★</div>
              <div className="stat-label">Customer Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection 