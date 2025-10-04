import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Check if the current page is the homepage
  const isHomePage = location.pathname === '/';

  // Effect to close the mobile menu on route change
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // Conditionally add a 'home-header' class
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isHomePage ? 'home-header' : ''}`}>
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src="/images/Moksha_Logo.png" alt="Moksha Dental Experts Logo" className="site-logo" />
        </Link>
        
        <nav 
          className={`navbar ${isNavOpen ? 'active' : ''}`}
          onClick={() => setIsNavOpen(false)}
        >
          <ul>
            <li><a href="/#hero">Home</a></li>
            <li><Link to="/manage-appointments">Manage</Link></li>
            <li><Link to="/appointment" className="btn-primary">Book Now</Link></li>
            <li><ThemeToggle /></li>
          </ul>
        </nav>

        <label className="burger" htmlFor="burger-checkbox">
          <input 
            type="checkbox" 
            id="burger-checkbox"
            checked={isNavOpen}
            onChange={() => setIsNavOpen(!isNavOpen)} 
          />
          <span></span>
          <span></span>
          <span></span>
        </label>
        
      </div>
    </header>
  );
}

export default Header;