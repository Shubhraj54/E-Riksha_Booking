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
    iconClass: 'icon-heart',
    title: 'Customer First',
    description: 'We put our customers at the heart of everything we do'
  },
  {
    iconClass: 'icon-shield',
    title: 'Safety & Trust',
    description: 'Building trust through safety and reliability'
  },
  {
    iconClass: 'icon-trending',
    title: 'Innovation',
    description: 'Continuously innovating to improve user experience'
  },
  {
    iconClass: 'icon-users',
    title: 'Community',
    description: 'Supporting local communities and creating opportunities'
  }
]

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <h2 className="about-title">
            About <span className="gradient-text">Rapido</span>
          </h2>
          <p className="about-subtitle">
            India's leading bike taxi platform, revolutionizing urban transportation 
            with technology-driven solutions and customer-centric approach.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="about-mission-vision">
          <div className="about-mission">
            <div className="about-card">
              <div className="about-icon-bg">
                <div className="about-icon icon-target"></div>
              </div>
              <h3 className="about-card-title">Our Mission</h3>
              <p className="about-card-desc">
                To provide affordable, safe, and reliable transportation solutions that connect people 
                and communities while creating economic opportunities for millions of riders across India.
              </p>
              <ul className="about-list">
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Affordable transportation for all</span>
                </li>
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Safe and reliable rides</span>
                </li>
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Economic empowerment</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="about-vision">
            <div className="about-card">
              <div className="about-icon-bg">
                <div className="about-icon icon-globe"></div>
              </div>
              <h3 className="about-card-title">Our Vision</h3>
              <p className="about-card-desc">
                To become the most trusted and preferred mobility platform in India, 
                transforming the way people travel and creating a sustainable future for urban transportation.
              </p>
              <ul className="about-list">
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Leading mobility platform</span>
                </li>
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Sustainable transportation</span>
                </li>
                <li className="about-list-item">
                  <div className="about-dot"></div>
                  <span>Technology innovation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="about-values-section">
          <div className="about-values-header">
            <h3 className="about-values-title">
              Our <span className="gradient-text">Values</span>
            </h3>
            <p className="about-values-desc">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>
          <div className="about-values-grid">
            {values.map((value, index) => (
              <div className="about-value-card" key={index}>
                <div className="about-value-icon-bg">
                  <div className={`about-value-icon ${value.iconClass}`}></div>
                </div>
                <h4 className="about-value-title">{value.title}</h4>
                <p className="about-value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="about-journey-section">
          <div className="about-journey-header">
            <h3 className="about-journey-title">
              Our <span className="gradient-text">Journey</span>
            </h3>
            <p className="about-journey-desc">
              From a small startup to India's leading bike taxi platform - our growth story.
            </p>
          </div>
          <div className="about-journey-timeline">
            <div className="about-journey-line"></div>
            <div className="about-journey-list">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`about-journey-item ${index % 2 === 0 ? 'about-journey-row' : 'about-journey-row-reverse'}`}
                >
                  <div className={`about-journey-content ${index % 2 === 0 ? 'about-journey-content-right' : 'about-journey-content-left'}`}>
                    <div className="about-card about-journey-card">
                      <div className="about-journey-year gradient-text">{milestone.year}</div>
                      <h4 className="about-journey-title">{milestone.title}</h4>
                      <p className="about-journey-desc">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="about-journey-dot-wrap">
                    <div className="about-journey-dot"></div>
                  </div>
                  <div className="about-journey-empty"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="about-awards-section">
          <div className="about-awards-header">
            <h3 className="about-awards-title">
              Awards & <span className="gradient-text">Recognition</span>
            </h3>
            <p className="about-awards-desc">
              Recognized for our innovation, safety standards, and contribution to the mobility sector.
            </p>
          </div>

          <div className="about-awards-grid">
            <div className="about-award-card">
              <div className="about-award-icon-bg">
                <div className="about-award-icon icon-award"></div>
              </div>
              <h4 className="about-award-title">Best Mobility Platform</h4>
              <p className="about-award-desc">Awarded by Startup India 2023</p>
            </div>
            <div className="about-award-card">
              <div className="about-award-icon-bg">
                <div className="about-award-icon icon-shield"></div>
              </div>
              <h4 className="about-award-title">Safety Excellence</h4>
              <p className="about-award-desc">Recognized by Transport Ministry</p>
            </div>
            <div className="about-award-card">
              <div className="about-award-icon-bg">
                <div className="about-award-icon icon-users"></div>
              </div>
              <h4 className="about-award-title">Customer Choice</h4>
              <p className="about-award-desc">Most Trusted Brand 2023</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 