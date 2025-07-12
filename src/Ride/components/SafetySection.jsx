'use client'

const safetyFeatures = [
  {
    iconClass: 'icon-user-check',
    title: 'Verified Riders',
    description: 'All our riders go through strict background verification and training programs.',
    color: 'green'
  },
  {
    iconClass: 'icon-shield',
    title: 'Ride Insurance',
    description: 'Every ride is insured for your safety and peace of mind.',
    color: 'blue'
  },
  {
    iconClass: 'icon-phone',
    title: '24/7 Support',
    description: 'Round-the-clock customer support for any emergency or assistance.',
    color: 'purple'
  },
  {
    iconClass: 'icon-map-pin',
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
    <section id="safety" className="safety-section">
      <div className="safety-container">
        {/* Section Header */}
        <div className="safety-header">
          <h2 className="safety-title">
            Your <span className="gradient-text">Safety</span> is Our Priority
          </h2>
          <p className="safety-subtitle">
            We take your safety seriously. Every ride is designed to be secure, 
            comfortable, and reliable with multiple safety measures in place.
          </p>
        </div>

        {/* Safety Features Grid */}
        <div className="safety-features-grid">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="safety-feature-card">
              <div className={`safety-feature-icon-bg safety-feature-icon-bg-${feature.color}`}>
                <div className={`safety-feature-icon ${feature.iconClass}`}></div>
              </div>
              <h3 className="safety-feature-title">{feature.title}</h3>
              <p className="safety-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Safety Stats */}
        <div className="safety-stats-section">
          <div className="safety-stats-grid">
            {safetyStats.map((stat, index) => (
              <div key={index} className="safety-stat-item">
                <div className="safety-stat-number">{stat.number}</div>
                <div className="safety-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Process */}
        <div className="safety-process">
          {/* Left Content */}
          <div className="safety-process-content">
            <h3 className="safety-process-title">
              How We Ensure <span className="gradient-text">Your Safety</span>
            </h3>
            
            <div className="safety-process-steps">
              <div className="safety-process-step">
                <div className="safety-step-number">
                  <span>1</span>
                </div>
                <div className="safety-step-content">
                  <h4 className="safety-step-title">Rigorous Background Checks</h4>
                  <p className="safety-step-desc">Every rider undergoes comprehensive background verification including criminal record checks and driving history.</p>
                </div>
              </div>

              <div className="safety-process-step">
                <div className="safety-step-number">
                  <span>2</span>
                </div>
                <div className="safety-step-content">
                  <h4 className="safety-step-title">Training & Certification</h4>
                  <p className="safety-step-desc">All riders complete safety training programs and are certified before joining our platform.</p>
                </div>
              </div>

              <div className="safety-process-step">
                <div className="safety-step-number">
                  <span>3</span>
                </div>
                <div className="safety-step-content">
                  <h4 className="safety-step-title">Real-time Monitoring</h4>
                  <p className="safety-step-desc">Advanced GPS tracking and monitoring systems ensure every ride is tracked and recorded.</p>
                </div>
              </div>

              <div className="safety-process-step">
                <div className="safety-step-number">
                  <span>4</span>
                </div>
                <div className="safety-step-content">
                  <h4 className="safety-step-title">Emergency Support</h4>
                  <p className="safety-step-desc">24/7 emergency support team ready to assist you in any situation during your ride.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Safety Visual */}
          <div className="safety-dashboard">
            <div className="safety-dashboard-bg">
              <div className="safety-dashboard-card">
                <div className="safety-dashboard-header">
                  <div className="safety-dashboard-icon-bg">
                    <div className="safety-dashboard-icon icon-shield"></div>
                  </div>
                  <h4 className="safety-dashboard-title">Safety Dashboard</h4>
                  <p className="safety-dashboard-subtitle">Real-time safety monitoring</p>
                </div>

                <div className="safety-status-list">
                  <div className="safety-status-item safety-status-green">
                    <div className="safety-status-content">
                      <div className="safety-status-icon icon-check-circle"></div>
                      <span className="safety-status-text">Rider Verified</span>
                    </div>
                    <span className="safety-status-indicator">✓</span>
                  </div>

                  <div className="safety-status-item safety-status-blue">
                    <div className="safety-status-content">
                      <div className="safety-status-icon icon-map-pin"></div>
                      <span className="safety-status-text">Live Tracking</span>
                    </div>
                    <span className="safety-status-indicator">Active</span>
                  </div>

                  <div className="safety-status-item safety-status-purple">
                    <div className="safety-status-content">
                      <div className="safety-status-icon icon-phone"></div>
                      <span className="safety-status-text">SOS Available</span>
                    </div>
                    <span className="safety-status-indicator">Ready</span>
                  </div>

                  <div className="safety-status-item safety-status-green">
                    <div className="safety-status-content">
                      <div className="safety-status-icon icon-alert-triangle"></div>
                      <span className="safety-status-text">Insurance Active</span>
                    </div>
                    <span className="safety-status-indicator">✓</span>
                  </div>
                </div>

                <button className="safety-learn-button">
                  Learn More About Safety
                </button>
              </div>
            </div>

            {/* Floating Safety Elements */}
            <div className="safety-floating-elements">
              <div className="safety-floating-element safety-floating-top">
                <div className="safety-floating-icon-bg safety-floating-green">
                  <div className="safety-floating-icon icon-check-circle"></div>
                </div>
              </div>

              <div className="safety-floating-element safety-floating-bottom">
                <div className="safety-floating-icon-bg safety-floating-blue">
                  <div className="safety-floating-icon icon-shield"></div>
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