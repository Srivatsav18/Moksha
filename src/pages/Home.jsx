import { useState, useEffect } from 'react'
import DoctorCard from '../components/DoctorCard'
import { api } from '../api'
import { useImagePreloader } from '../hooks/useImagePreloader'

function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Extract image URLs for preloading
  const imageUrls = doctors.map(doctor => doctor.photo)
  const { imagesLoaded } = useImagePreloader(imageUrls)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const doctorsData = await api.getDoctors()
        setDoctors(doctorsData)
        setError(null)
      } catch (err) {
        setError('Failed to load doctors. Please try again later.')
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Only show content when both data and images are loaded
  useEffect(() => {
    if (!loading && imagesLoaded) {
      // Add a small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [loading, imagesLoaded])

  if (loading || (!imagesLoaded && doctors.length > 0)) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            {loading ? 'Loading doctors...' : 'Preparing images...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`home-page ${isLoaded ? 'loaded' : ''}`}>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Restoring <span className="highlight">confidence</span>,
            <br />
            one <span className="highlight">smile</span> at a time
          </h1>
          <p className="hero-subtitle">
            Expert Root Canal & Restorative Care, crafting healthy smiles with comfort
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">9+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Patients</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      <section className="doctors-section">
        <div className="section-header">
          <h2>Meet Our Doctor</h2>
          <p>Dedicated professional committed to your recovery</p>
        </div>
        <div className={`doctors-grid ${isLoaded ? 'fade-in' : ''}`}>
          {doctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className="doctor-card-wrapper"
              style={{ 
                animationDelay: `${index * 500}ms` // Stagger animation
              }}
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Moksha Dental Experts?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Care</h3>
            <p>Tailored treatment designed specifically for your needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Modern Equipment</h3>
            <p>State-of-the-art facilities with the latest therapy technology</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Proven Results</h3>
            <p>Evidence-based techniques with trackable progress</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💙</div>
            <h3>Compassionate Team</h3>
            <p>Caring professionals who understand your journey</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home