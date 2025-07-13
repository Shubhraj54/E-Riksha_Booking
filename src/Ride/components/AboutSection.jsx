'use client'

const milestones = [
  {
    year: '2015',
    title: 'Founded',
    description: 'Started with a vision to revolutionize urban transportation'
  },
  {
    year: '2017',
    title: '10 Cities',
    description: 'Expanded to 10 major cities across India'
  },
  {
    year: '2019',
    title: '1M Users',
    description: 'Reached 1 million happy customers'
  },
  {
    year: '2021',
    title: '100 Cities',
    description: 'Present in 100+ cities across India'
  },
  {
    year: '2023',
    title: '10M Users',
    description: 'Serving 10 million+ customers nationwide'
  }
]

const values = [
  {
    iconClass: 'ride_icon-heart',
    title: 'Customer First',
    description: 'We put our customers at the heart of everything we do'
  },
  {
    iconClass: 'ride_icon-shield',
    title: 'Safety & Trust',
    description: 'Building trust through safety and reliability'
  },
  {
    iconClass: 'ride_icon-trending',
    title: 'Innovation',
    description: 'Continuously innovating to improve user experience'
  },
  {
    iconClass: 'ride_icon-users',
    title: 'Community',
    description: 'Supporting local communities and creating opportunities'
  }
]

const AboutSection = () => {
  return (
    <section id="about" className="ride_about-section">
      <div className="ride_about-container">
        {/* Section Header */}
        <div className="ride_about-header">
          <h2 className="ride_about-title">
            About <span className="ride_gradient-text">Rapido</span>
          </h2>
          <p className="ride_about-subtitle">
            India's leading bike taxi platform, revolutionizing urban transportation 
            with technology-driven solutions and customer-centric approach.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="ride_about-mission-vision">
          <div className="ride_about-mission">
            <div className="ride_about-card">
              <div className="ride_about-icon-bg">
                <div className="ride_about-icon ride_icon-target"></div>
              </div>
              <h3 className="ride_about-card-title">Our Mission</h3>
              <p className="ride_about-card-desc">
                To provide affordable, safe, and reliable transportation solutions that connect people 
                and communities while creating economic opportunities for millions of riders across India.
              </p>
              <ul className="ride_about-list">
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Affordable transportation for all</span>
                </li>
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Safe and reliable rides</span>
                </li>
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Economic empowerment</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="ride_about-vision">
            <div className="ride_about-card">
              <div className="ride_about-icon-bg">
                <div className="ride_about-icon ride_icon-globe"></div>
              </div>
              <h3 className="ride_about-card-title">Our Vision</h3>
              <p className="ride_about-card-desc">
                To become the most trusted and preferred mobility platform in India, 
                transforming the way people travel and creating a sustainable future for urban transportation.
              </p>
              <ul className="ride_about-list">
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Leading mobility platform</span>
                </li>
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Sustainable transportation</span>
                </li>
                <li className="ride_about-list-item">
                  <div className="ride_about-dot"></div>
                  <span>Technology innovation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="ride_about-values-section">
          <div className="ride_about-values-header">
            <h3 className="ride_about-values-title">
              Our <span className="ride_gradient-text">Values</span>
            </h3>
            <p className="ride_about-values-desc">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>
          <div className="ride_about-values-grid">
            {values.map((value, index) => (
              <div className="ride_about-value-card" key={index}>
                <div className="ride_about-value-icon-bg">
                  <div className={`ride_about-value-icon ${value.iconClass}`}></div>
                </div>
                <h4 className="ride_about-value-title">{value.title}</h4>
                <p className="ride_about-value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="ride_about-journey-section">
          <div className="ride_about-journey-header">
            <h3 className="ride_about-journey-title">
              Our <span className="ride_gradient-text">Journey</span>
            </h3>
            <p className="ride_about-journey-desc">
              From a small startup to India's leading bike taxi platform - our growth story.
            </p>
          </div>
          <div className="ride_about-journey-timeline">
            <div className="ride_about-journey-line"></div>
            <div className="ride_about-journey-list">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`ride_about-journey-item ${index % 2 === 0 ? 'ride_about-journey-row' : 'ride_about-journey-row-reverse'}`}
                >
                  <div className={`ride_about-journey-content ${index % 2 === 0 ? 'ride_about-journey-content-right' : 'ride_about-journey-content-left'}`}>
                    <div className="ride_about-card ride_about-journey-card">
                      <div className="ride_about-journey-year ride_gradient-text">{milestone.year}</div>
                      <h4 className="ride_about-journey-title">{milestone.title}</h4>
                      <p className="ride_about-journey-desc">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="ride_about-journey-dot-wrap">
                    <div className="ride_about-journey-dot"></div>
                  </div>
                  <div className="ride_about-journey-empty"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="ride_about-awards-section">
          <div className="ride_about-awards-header">
            <h3 className="ride_about-awards-title">
              Awards & <span className="ride_gradient-text">Recognition</span>
            </h3>
            <p className="ride_about-awards-desc">
              Recognized for our innovation, safety standards, and contribution to the mobility sector.
            </p>
          </div>

          <div className="ride_about-awards-grid">
            <div className="ride_about-award-card">
              <div className="ride_about-award-icon-bg">
                <div className="ride_about-award-icon ride_icon-award"></div>
              </div>
              <h4 className="ride_about-award-title">Best Mobility Platform</h4>
              <p className="ride_about-award-desc">Awarded by Startup India 2023</p>
            </div>
            <div className="ride_about-award-card">
              <div className="ride_about-award-icon-bg">
                <div className="ride_about-award-icon ride_icon-shield"></div>
              </div>
              <h4 className="ride_about-award-title">Safety Excellence</h4>
              <p className="ride_about-award-desc">Recognized by Transport Ministry</p>
            </div>
            <div className="ride_about-award-card">
              <div className="ride_about-award-icon-bg">
                <div className="ride_about-award-icon ride_icon-users"></div>
              </div>
              <h4 className="ride_about-award-title">Customer Choice</h4>
              <p className="ride_about-award-desc">Most Trusted Brand 2023</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 