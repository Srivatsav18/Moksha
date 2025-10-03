import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-gradient"></div>
      <div className="header-content">
        <Link to="/" className="logo-container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <div className="logo-text">
              <h1>MOKSHA</h1>
              <h2>Dental Experts</h2>
              <span className="tagline">Crafting Smiles</span>
            </div>
          </div>
        </Link>
        
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <strong>Visit Us</strong>
              <a
                href="https://maps.app.goo.gl/qZjQaGZkr8sUT9SEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                  color: '#1E293B',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'block'
                }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline';
                    e.target.style.color = '#0284c7';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none';
                    e.target.style.color = '#1E293B';
                  }}
                >
              Kotipalli Bus Stand backside, Rajahmundry
              </a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <strong>Call Us</strong>
              <p>63024 03471</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">⏰</span>
            <div>
              <strong>Hours</strong>
              <p>Mon-Sat: 9AM-6PM</p>
            </div>
          </div>
        </div>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/appointment" className="nav-link nav-cta">Book Now</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header