import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

function DoctorProfile() {
  const { name } = useParams() // Get name from URL instead of id
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoctorByName = async () => {
      try {
        setLoading(true)
        // Fetch all doctors and find the one matching the URL name
        const doctors = await api.getDoctors()
        
        const foundDoctor = doctors.find(d => {
          // Convert doctor name to same URL format for comparison
          const doctorUrlName = d.name
            .replace(/^Dr\.\s*/, '') // Remove "Dr." prefix
            .replace(/\s+/g, '-')    // Replace spaces with hyphens
            .toLowerCase()           // Convert to lowercase
          
          return doctorUrlName === name
        })
        
        if (foundDoctor) {
          setDoctor(foundDoctor)
          // Set page title to doctor's name
          document.title = `${foundDoctor.name} - Moksha Dental Experts`
        } else {
          setError('Doctor not found')
        }
      } catch (err) {
        setError('Failed to load doctor profile.')
        console.error('Error fetching doctor:', err)
      } finally {
        setLoading(false)
      }
    }

    if (name) {
      fetchDoctorByName()
    }

    // Cleanup: Reset page title when component unmounts
    return () => {
      document.title = "Moksha Dental Experts"
    }
  }, [name])

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '1.2rem'
        }}>
          Loading doctor profile...
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="profile-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '1.2rem',
          color: '#e53e3e',
          textAlign: 'center'
        }}>
          <p>{error}</p>
          <Link to="/" style={{ 
            marginTop: '1rem', 
            color: '#3182ce',
            textDecoration: 'underline'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-image-section">
          <img src={doctor.photo} alt={doctor.name} className="profile-image" /> 
        </div>
        
        <div className="profile-info-section">
          <h1>{doctor.name}</h1>
          <p className="profile-specialty">{doctor.specialty}</p>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{doctor.experience}</strong>
              <span>Years Experience</span>
            </div>
            <div className="profile-stat">
              <strong>500+</strong>
              <span>Patients Treated</span>
            </div>
            <div className="profile-stat">
              <strong>4.9</strong>
              <span>Rating</span>
            </div>
          </div>
          
          <div className="profile-bio">
            <h3>About</h3>
            <p>{doctor.bio}</p>
          </div>
          
          <div className="profile-qualifications">
            <h3>Qualifications</h3>
            <ul>
              {doctor.qualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>
          
          <div className="profile-specializations">
            <h3>Specializations</h3>
            <div className="specialization-tags">
              {doctor.specializations.map((spec, index) => (
                <span key={index} className="spec-tag">{spec}</span>
              ))}
            </div>
          </div>
          
          <div className="profile-actions">
            <Link 
              to={`/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}`} 
              className="book-appointment-btn"
            >
              Book Appointment
            </Link>
            <Link to="/" className="back-btn">
              ← Back to Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile