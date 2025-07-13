'use client'

const safetyFeatures = [
  {
    iconClass: 'ride_icon-user-check',
    title: 'Verified Riders',
    description: 'All our riders go through strict background verification and training programs.',
    color: 'green'
  },
  {
    iconClass: 'ride_icon-shield',
    title: 'Ride Insurance',
    description: 'Every ride is insured for your safety and peace of mind.',
    color: 'blue'
  },
  {
    iconClass: 'ride_icon-phone',
    title: '24/7 Support',
    description: 'Round-the-clock customer support for any emergency or assistance.',
    color: 'purple'
  },
  {
    iconClass: 'ride_icon-map-pin',
    title: 'Live Tracking',
    description: 'Share your ride details with family and track your journey in real-time.',
    color: 'green'
  }
]

const safetyStats = [
  { number: '100%', label: 'Verified Riders' },
  { number: '24/7', label: 'Support Available' },
  { number: '4.8★', label: 'Safety Rating' },
  { number: '0', label: 'Major Incidents' }
]

const SafetySection = () => {
  return (
    <section id="safety" className="ride_safety-section">
      <div className="ride_safety-container">
        {/* Section Header */}
        <div className="ride_safety-header">
          <h2 className="ride_safety-title">
            Your <span className="ride_gradient-text">Safety</span> is Our Priority
          </h2>
          <p className="ride_safety-subtitle">
            We take your safety seriously. Every ride is designed to be secure, 
            comfortable, and reliable with multiple safety measures in place.
          </p>
        </div>

        {/* Safety Features Grid */}
        <div className="ride_safety-features-grid">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="ride_safety-feature-card">
              <div className={`ride_safety-feature-icon-bg ride_safety-feature-icon-bg-${feature.color}`}>
                <div className={`ride_safety-feature-icon ${feature.iconClass}`}></div>
              </div>
              <h3 className="ride_safety-feature-title">{feature.title}</h3>
              <p className="ride_safety-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Safety Stats */}
        <div className="ride_safety-stats-section">
          <div className="ride_safety-stats-grid">
            {safetyStats.map((stat, index) => (
              <div key={index} className="ride_safety-stat-item">
                <div className="ride_safety-stat-number">{stat.number}</div>
                <div className="ride_safety-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Process */}
        <div className="ride_safety-process">
          {/* Left Content */}
          <div className="ride_safety-process-content">
            <h3 className="ride_safety-process-title">
              How We Ensure <span className="ride_gradient-text">Your Safety</span>
            </h3>
            
            <div className="ride_safety-process-steps">
              <div className="ride_safety-process-step">
                <div className="ride_safety-step-number">
                  <span>1</span>
                </div>
                <div className="ride_safety-step-content">
                  <h4 className="ride_safety-step-title">Rigorous Background Checks</h4>
                  <p className="ride_safety-step-desc">Every rider undergoes comprehensive background verification including criminal record checks and driving history.</p>
                </div>
              </div>

              <div className="ride_safety-process-step">
                <div className="ride_safety-step-number">
                  <span>2</span>
                </div>
                <div className="ride_safety-step-content">
                  <h4 className="ride_safety-step-title">Training & Certification</h4>
                  <p className="ride_safety-step-desc">All riders complete safety training programs and are certified before joining our platform.</p>
                </div>
              </div>

              <div className="ride_safety-process-step">
                <div className="ride_safety-step-number">
                  <span>3</span>
                </div>
                <div className="ride_safety-step-content">
                  <h4 className="ride_safety-step-title">Real-time Monitoring</h4>
                  <p className="ride_safety-step-desc">Advanced GPS tracking and monitoring systems ensure every ride is tracked and recorded.</p>
                </div>
              </div>

              <div className="ride_safety-process-step">
                <div className="ride_safety-step-number">
                  <span>4</span>
                </div>
                <div className="ride_safety-step-content">
                  <h4 className="ride_safety-step-title">Emergency Support</h4>
                  <p className="ride_safety-step-desc">24/7 emergency support team ready to assist you in any situation during your ride.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Safety Visual */}
          <div className="ride_safety-dashboard">
            <div className="ride_safety-dashboard-bg">
              <div className="ride_safety-dashboard-card">
                <div className="ride_safety-dashboard-header">
                  <div className="ride_safety-dashboard-icon-bg">
                    <div className="ride_safety-dashboard-icon ride_icon-shield"></div>
                  </div>
                  <h4 className="ride_safety-dashboard-title">Safety Dashboard</h4>
                  <p className="ride_safety-dashboard-subtitle">Real-time safety monitoring</p>
                </div>

                <div className="ride_safety-status-list">
                  <div className="ride_safety-status-item ride_safety-status-green">
                    <div className="ride_safety-status-content">
                      <div className="ride_safety-status-icon ride_icon-check-circle"></div>
                      <span className="ride_safety-status-text">Rider Verified</span>
                    </div>
                    <span className="ride_safety-status-indicator">✓</span>
                  </div>

                  <div className="ride_safety-status-item ride_safety-status-blue">
                    <div className="ride_safety-status-content">
                      <div className="ride_safety-status-icon ride_icon-map-pin"></div>
                      <span className="ride_safety-status-text">Live Tracking</span>
                    </div>
                    <span className="ride_safety-status-indicator">Active</span>
                  </div>

                  <div className="ride_safety-status-item ride_safety-status-purple">
                    <div className="ride_safety-status-content">
                      <div className="ride_safety-status-icon ride_icon-phone"></div>
                      <span className="ride_safety-status-text">SOS Available</span>
                    </div>
                    <span className="ride_safety-status-indicator">Ready</span>
                  </div>

                  <div className="ride_safety-status-item ride_safety-status-green">
                    <div className="ride_safety-status-content">
                      <div className="ride_safety-status-icon ride_icon-alert-triangle"></div>
                      <span className="ride_safety-status-text">Insurance Active</span>
                    </div>
                    <span className="ride_safety-status-indicator">✓</span>
                  </div>
                </div>

                <button className="ride_safety-learn-button">
                  Learn More About Safety
                </button>
              </div>
            </div>

            {/* Floating Safety Elements */}
            <div className="ride_safety-floating-elements">
              <div className="ride_safety-floating-element ride_safety-floating-top">
                <div className="ride_safety-floating-icon-bg ride_safety-floating-green">
                  <div className="ride_safety-floating-icon ride_icon-check-circle"></div>
                </div>
              </div>

              <div className="ride_safety-floating-element ride_safety-floating-bottom">
                <div className="ride_safety-floating-icon-bg ride_safety-floating-blue">
                  <div className="ride_safety-floating-icon ride_icon-shield"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SafetySection 