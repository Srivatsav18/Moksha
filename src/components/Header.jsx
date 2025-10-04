import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src="/images/Moksha_Logo.png" alt="Moksha Dental Experts Logo" className="site-logo" />
        </Link>
        
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/manage-appointments">Manage</Link></li>
            <li><Link to="/appointment" className="btn-primary">Book Now</Link></li>
            {/* === TOGGLE MOVED INSIDE A LIST ITEM FOR PROPER ALIGNMENT === */}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;