import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

function DoctorProfile() {
  const { name } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorByName = async () => {
      try {
        setLoading(true);
        const doctors = await api.getDoctors();
        const foundDoctor = doctors.find(d => {
          const doctorUrlName = d.name
            .replace(/^Dr\.\s*/, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
          return doctorUrlName === name;
        });

        if (foundDoctor) {
          setDoctor(foundDoctor);
          document.title = `${foundDoctor.name} - Moksha Dental`;
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        setError('Failed to load doctor profile.');
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchDoctorByName();
    }

    return () => {
      document.title = "Moksha Dental";
    };
  }, [name]);

  if (loading) {
    return (
      <div className="profile-page-status">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Doctor Profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="profile-page-status">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <Link to="/" className="btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
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
              <strong>{doctor.experience}+</strong>
              <span>Years Experience</span>
            </div>
            <div className="profile-stat">
              <strong>500+</strong>
              <span>Happy Patients</span>
            </div>
            <div className="profile-stat">
              <strong>4.9 ★</strong>
              <span>Rating</span>
            </div>
          </div>
          
          <div className="profile-content-section">
            <h3>About Dr. {doctor.name.replace(/^Dr\.\s*/, '')}</h3>
            <p>{doctor.bio}</p>
          </div>
          
          <div className="profile-content-section">
            <h3>Qualifications</h3>
            <ul>
              {doctor.qualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>
          
          <div className="profile-content-section">
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
              className="btn-primary"
            >
              Book Appointment
            </Link>
            <Link to="/" className="btn-secondary">
              ← Back to Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;