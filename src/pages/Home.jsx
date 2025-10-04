import { useState, useEffect } from 'react'
import DoctorCard from '../components/DoctorCard'
import { api } from '../api'
import { useImagePreloader } from '../hooks/useImagePreloader'

function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    if (!loading && imagesLoaded) {
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
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Bright Smiles, <span className="highlight">Expert Care</span>
            </h1>
            <p className="hero-subtitle">
              Welcome to Moksha Dental, where we combine modern technology with a gentle touch to provide exceptional care for your family.
            </p>
            {/* The hero-actions div has been removed */}
          </div>
          <div className="hero-visual"></div>
        </div>
      </section>

      <section className="doctors-section" id="doctors-section">
        <div className="section-header">
          <h2>Meet Our Expert Dentists</h2>
          <p>Our highly-skilled team is dedicated to providing you with the highest quality of care.</p>
        </div>
        <div className={`doctors-grid ${isLoaded ? 'fade-in' : ''}`}>
          {doctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className="doctor-card-wrapper"
              style={{ 
                animationDelay: `${index * 500}ms`
              }}
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </section>

      <section className="features-section" id="services">
        <div className="section-header">
            <h2>Why Choose Moksha Dental?</h2>
            <p>We are committed to providing a comfortable, high-quality dental experience.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3>Personalized Care</h3>
            <p>Every treatment plan is tailored specifically to your individual needs and goals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            </div>
            <h3>Modern Technology</h3>
            <p>We use state-of-the-art equipment to ensure the best possible results.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3>Proven Results</h3>
            <p>Our focus on evidence-based techniques ensures effective and lasting outcomes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Comfortable Experience</h3>
            <p>Our compassionate team is dedicated to making your visit as relaxed as possible.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;