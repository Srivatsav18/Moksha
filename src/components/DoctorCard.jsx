import { Link } from 'react-router-dom'
import { useState } from 'react'

function DoctorCard({ doctor }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // convert doctor name to url-friendly format
  const doctorUrlName = doctor.name
    .replace(/^Dr\.\s*/, '')  // Remove "Dr. " prefix
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .toLowerCase()            // Convert to lowercase

  // Fallback image URL
  const fallbackImage = "https://via.placeholder.com/300x250/e2e8f0/64748b?text=Doctor+Photo"
  
  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true) // Consider fallback as "loaded"
  }

  return (
    <div className="doctor-card">
      <div className="doctor-card-glow"></div>
      <div className="doctor-image-container">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        
        <img 
          src={imageError ? fallbackImage : doctor.photo} 
          alt={doctor.name} 
          className={`doctor-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
        <div className="doctor-overlay">
          <span className="experience-badge">{doctor.experience} Years</span>
        </div>
      </div>
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p className="specialty">{doctor.specialty}</p>
        <div className="rating">
          {'⭐'.repeat(5)} <span>(4.9)</span>
        </div>
        <Link to={`/doctor/${doctorUrlName}`} className="view-profile-btn">
          View Profile <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  )
}

export default DoctorCard