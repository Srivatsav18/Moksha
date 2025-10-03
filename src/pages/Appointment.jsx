import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

function Appointment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL parameters manually
  const urlParams = new URLSearchParams(location.search);
  const preSelectedDoctorId = urlParams.get("doctorId");
  const preSelectedDoctorName = urlParams.get("doctorName");

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctor_id: preSelectedDoctorId || "",
    message: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scroll to top when success page shows
  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [showSuccess]);

  // Fetch doctors using the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await api.getDoctors();
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again.");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available times using the API
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!formData.doctor_id || !formData.date) return;
      
      try {
        const response = await api.getAvailableTimes(formData.doctor_id, formData.date);
        setAvailableTimes(response.available_times || []);
      } catch (err) {
        console.error("Error fetching available times:", err);
        setAvailableTimes([]);
      }
    };
    fetchAvailableTimes();
  }, [formData.doctor_id, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        doctor_id: parseInt(formData.doctor_id),
      };
      
      await api.createAppointment(payload);
      setShowSuccess(true);
      // Auto-redirect after 8 seconds for better UX with multiple buttons
      setTimeout(() => navigate("/"), 8000);
    } catch (err) {
      setError(err.message || "Failed to book appointment. Please try again.");
      console.error(err);
      // Scroll to error message
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookAnother = () => {
    // Reset form and show booking page again
    setFormData({
      patientName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      doctor_id: "",
      message: "",
    });
    setShowSuccess(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="appointment-page">
      {showSuccess ? (
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Appointment Booked Successfully!</h2>
            <p>We'll contact you shortly to confirm your appointment.</p>
            
            <div className="success-details">
              <p><strong>Patient:</strong> {formData.patientName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              {formData.message && (
                <p><strong>Additional Notes:</strong> {formData.message}</p>
              )}
            </div>

            <p className="redirect-text">Automatically redirecting to home page in 8 seconds...</p>
            
            <div style={{
              background: '#fef2f2',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              <p style={{ margin: '0', fontSize: '0.95rem', color: '#dc2626', fontWeight: '500' }}>
                Need to cancel or reschedule?
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                Call us at <strong>63024 03471</strong>
              </p>
              </div>

            {/* Multiple Action Buttons with Modern Styling */}
            <div className="success-actions">
              <button 
                onClick={() => navigate("/")}
                className="back-home-btn modern-gradient"
                title="Return to homepage"
              >
                <span className="btn-icon">🏠</span>
                <span className="btn-text">Go Home</span>
              </button>
              
              <button 
                onClick={handleBookAnother}
                className="book-another-btn modern-outline"
                title="Book another appointment"
              >
                <span className="btn-icon">📅</span>
                <span className="btn-text">Book Another</span>
              </button>
            </div>

            {/* Additional contact info */}
            <div className="success-footer">
              <p className="contact-reminder">
                Questions? Call us at <strong>63024 03471</strong>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="appointment-header">
            <h1>Book Your Appointment</h1>
            <p>Take the first step towards your recovery</p>
          </div>

          <div className="appointment-content">
            <form className="appointment-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: value });
                    if (error) setError(null);
                  }}
                  required
                  placeholder="9876543210"
                  disabled={loading}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  style={{
                    letterSpacing: '1px', // Makes digits easier to read
                    fontFamily: 'monospace'
                  }}
                  />
                  {formData.phone && formData.phone.length < 10 && (
                    <small style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                      Please enter exactly 10 digits ({formData.phone.length}/10)
                    </small>
                  )}
                  {formData.phone && formData.phone.length === 10 && (
                    <small style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    ✓ Valid phone number
                    </small>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="doctor">
                  {preSelectedDoctorName ? "Selected Doctor" : "Preferred Doctor"}
                </label>
                {preSelectedDoctorName ? (
              <div 
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#e0f2fe",
                  border: "2px solid #0ea5e9",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "500", color: "#0369a1" }}>
                  {preSelectedDoctorName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, doctor_id: "" });
                    navigate("/appointment", { replace: true });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0ea5e9",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    textDecoration: "underline",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: "normal"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = "#0284c7";
                    e.target.style.backgroundColor = "rgba(14, 165, 233, 0.1)";
                    e.target.style.textDecoration = "none";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = "#0ea5e9";
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.textDecoration = "underline";
                  }}
                >
                  Change Doctor
                  </button>
                </div>
              ) : (
                <select
                  id="doctor"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">Any available doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              )}
            </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time *</label>
                  {availableTimes.length > 0 ? (
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((t, idx) => (
                        <option key={idx} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="no-times-message">
                      {formData.date && formData.doctor_id
                        ? "No available times for selected date"
                        : "Select doctor and date to see available times"}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Information</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please describe your symptoms or any special requirements..."
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Booking Appointment..." : "Book Appointment"}
              </button>
            </form>

            <div className="appointment-sidebar">
              <div className="info-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3>📍 Clinic Location</h3>
                    <p style={{ marginBottom: 0 }}>
                      Kotipalli Bus Stand backside, Rajahmundry
                    </p>
                  </div>
                  <a 
                    href="https://maps.app.goo.gl/Gv5Ca1RmpwVixFyH6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    
                    onMouseEnter={(e) => {
                      
                      e.target.style.transform = 'scale(1.5)';
                      
                    }}
                    onMouseLeave={(e) => {
                      
                      e.target.style.transform = 'scale(1)';
                      
                    }}
                    title="Get Directions on Google Maps"
                  >
                    <img
              src="images/google-maps.png"
              alt="Google Maps"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '4px'
              }}
            />
                  </a>
                </div>
              </div>
              
              <div className="info-card">
                <h3>⏰ Working Hours</h3>
                <p>
                  Monday - Saturday: 9:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
              
              <div className="info-card">
                <h3>📞 Need Help?</h3>
                <p>
                  Call us at <strong>63024 03471</strong><br />
                  or email <strong>mokshadentalexperts@gmail.com</strong>
                </p>
              </div>
              
              <div className="info-card highlight-card">
                <h3>💡 First Visit?</h3>
                <p>
                  Please arrive 15 minutes early to complete paperwork. Bring your insurance card and a list of current medications.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Appointment;