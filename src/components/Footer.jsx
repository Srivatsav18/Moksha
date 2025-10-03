import { Link } from 'react-router-dom'
import SocialMediaIcons from './SocialMediaIcons'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Moksha Dental Experts</h3>
          <p>Crafting Smiles.</p>
          <a
            href="https://maps.app.goo.gl/5f1nLQpMimeZGaSZ9"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'left',
              width: '0px',
              height: '0px',
              marginTop: '1.5rem',
              background: '#ffffff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50%',
              fontSize: '2rem',
              transition: 'all 0.3s ease',
              
            }}
            onMouseEnter={(e) => {
              
              e.currentTarget.style.transform = 'scale(1.5)';
              
            }}
            onMouseLeave={(e) => {
              
              e.currentTarget.style.transform = 'scale(1)';
              
            }}
            title="View on Google Maps"
          >
            <img
              src="images/google-maps.png"
              alt="Google Maps"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '0px'
              }}
            />
          </a>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/manage-appointments">Manage Appointments</Link>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <SocialMediaIcons />
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; Copyright © 2025 Webora. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer