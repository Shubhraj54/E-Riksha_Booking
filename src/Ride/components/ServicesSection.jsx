'use client'

const services = [
  {
    id: 1,
    title: 'Bike Taxi',
    description: 'Quick and affordable bike rides for short distances. Beat traffic and reach your destination faster.',
    iconClass: 'ride_icon-bike',
    features: ['Starting from ₹25', '5 min pickup time', '100% verified riders'],
    color: 'blue',
    popular: true
  },
  {
    id: 2,
    title: 'Auto Taxi',
    description: 'Comfortable auto rides for medium distances. Perfect for family trips and luggage.',
    iconClass: 'ride_icon-car',
    features: ['Starting from ₹40', '7 min pickup time', 'Spacious seating'],
    color: 'green',
    popular: false
  },
  {
    id: 3,
    title: 'Delivery',
    description: 'Fast and reliable delivery services. From food to packages, we deliver everything.',
    iconClass: 'ride_icon-package',
    features: ['Starting from ₹30', '30 min delivery', 'Real-time tracking'],
    color: 'purple',
    popular: false
  }
]

const features = [
  {
    iconClass: 'ride_icon-clock',
    title: 'Quick Pickup',
    description: 'Average pickup time of 5-7 minutes'
  },
  {
    iconClass: 'ride_icon-shield',
    title: 'Safe Rides',
    description: 'All riders are verified and insured'
  },
  {
    iconClass: 'ride_icon-dollar',
    title: 'Affordable',
    description: 'Best prices guaranteed with no hidden charges'
  },
  {
    iconClass: 'ride_icon-map-pin',
    title: 'Wide Coverage',
    description: 'Available in 100+ cities across India'
  }
]

const ServicesSection = () => {
  return (
    <section id="services" className="ride_services-section">
      <div className="ride_services-container">
        {/* Section Header */}
        <div className="ride_services-header">
          <h2 className="ride_services-title">
            Our <span className="ride_gradient-text">Services</span>
          </h2>
          <p className="ride_services-subtitle">
            Choose from our wide range of transportation and delivery services. 
            Fast, safe, and affordable options for every need.
          </p>
        </div>

        {/* Services Grid */}
        <div className="ride_services-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`ride_service-card ride_service-card-${service.color}`}
            >
              {service.popular && (
                <div className="ride_service-popular">
                  <span className="ride_service-popular-badge">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`ride_service-icon-bg ride_service-icon-bg-${service.color}`}>
                <div className={`ride_service-icon ${service.iconClass}`}></div>
              </div>

              <h3 className="ride_service-title">{service.title}</h3>
              <p className="ride_service-desc">{service.description}</p>

              <ul className="ride_service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="ride_service-feature">
                    <div className={`ride_service-dot ride_service-dot-${service.color}`}></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`ride_service-button ride_service-button-${service.color}`}>
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="ride_features-section">
          <div className="ride_features-header">
            <h3 className="ride_features-title">
              Why Choose <span className="ride_gradient-text">Rapido</span>?
            </h3>
            <p className="ride_features-desc">
              We provide the best transportation experience with safety, speed, and affordability at the core.
            </p>
          </div>

          <div className="ride_features-grid">
            {features.map((feature, index) => (
              <div key={index} className="ride_feature-card">
                <div className="ride_feature-icon-bg">
                  <div className={`ride_feature-icon ${feature.iconClass}`}></div>
                </div>
                <h4 className="ride_feature-title">{feature.title}</h4>
                <p className="ride_feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="ride_stats-section">
          <div className="ride_stats-grid">
            <div className="ride_stat-item">
              <div className="ride_stat-number">10M+</div>
              <div className="ride_stat-label">Happy Customers</div>
            </div>
            <div className="ride_stat-item">
              <div className="ride_stat-number">100+</div>
              <div className="ride_stat-label">Cities Covered</div>
            </div>
            <div className="ride_stat-item">
              <div className="ride_stat-number">4.5★</div>
              <div className="ride_stat-label">Customer Rating</div>
            </div>
            <div className="ride_stat-item">
              <div className="ride_stat-number">24/7</div>
              <div className="ride_stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection 