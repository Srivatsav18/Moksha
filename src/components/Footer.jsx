import { Link } from 'react-router-dom';
import SocialMediaIcons from './SocialMediaIcons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section about">
          <div className="footer-logo">
            <span className="logo-main">MOKSHA</span>
            <span className="logo-sub">DENTAL EXPERTS</span>
          </div>
          <p className="footer-tagline">Crafting smiles</p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#hero">Home</a></li>
            <li><a href="/#doctors-section">Our Team</a></li>
            <li><a href="/#services">Services</a></li>
            <li><Link to="/appointment">Book Appointment</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact Us</h4>
          {/* === CONTACT ITEMS ARE NOW ON SINGLE LINES === */}
          <p>
            📍 <a href="http://googleusercontent.com/maps/google.com/4" target="_blank" rel="noopener noreferrer">
              Moksha Dental Experts
            </a>
          </p>
          <p>📞 63024 03471</p>
          <p>✉️ mokshadentalexperts@gmail.com</p>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <SocialMediaIcons />
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Moksha Dental. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;