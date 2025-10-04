import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

function Appointment() {
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showSuccess]);

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
      const payload = { ...formData, doctor_id: parseInt(formData.doctor_id) };
      await api.createAppointment(payload);
      setShowSuccess(true);
      setTimeout(() => navigate("/"), 8000);
    } catch (err) {
      setError(err.message || "Failed to book appointment. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleBookAnother = () => {
    setFormData({ patientName: "", email: "", phone: "", date: "", time: "", doctor_id: "", message: "" });
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="appointment-page">
      {showSuccess ? (
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Appointment Booked!</h2>
            <p>We'll contact you shortly to confirm. A confirmation has also been sent to your email.</p>
            <div className="success-details">
              <p><strong>Patient:</strong> {formData.patientName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              {formData.message && <p><strong>Notes:</strong> {formData.message}</p>}
            </div>
            <p className="redirect-text">Redirecting to home page in 8 seconds...</p>
            <div className="cancellation-notice">
              <p className="cancellation-notice__title">Need to cancel or reschedule?</p>
              <p className="cancellation-notice__text">Please call us at <strong>63024 03471</strong></p>
            </div>
            <div className="success-actions">
              <button onClick={() => navigate("/")} className="btn-primary">Go to Home</button>
              <button onClick={handleBookAnother} className="btn-secondary">Book Another</button>
            </div>
          </div>
        </div>
      ) : (
        // === THE FORM CODE IS NOW RESTORED HERE ===
        <>
          <div className="appointment-header">
            <h1>Book Your Appointment</h1>
            <p>Take the first step towards a healthier, brighter smile.</p>
          </div>

          <div className="appointment-content">
            <form className="appointment-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="Enter your full name" disabled={loading} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData({ ...formData, phone: value }); if (error) setError(null); }} required placeholder="9876543210" disabled={loading} maxLength={10} pattern="[0-9]{10}" title="Please enter exactly 10 digits" className="input-monospace" />
                  {formData.phone && formData.phone.length < 10 && <small className="form-hint-error">Please enter 10 digits ({formData.phone.length}/10)</small>}
                  {formData.phone && formData.phone.length === 10 && <small className="form-hint-success">✓ Valid phone number</small>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="doctor">{preSelectedDoctorName ? "Selected Doctor" : "Preferred Doctor"}</label>
                {preSelectedDoctorName ? (
                  <div className="selected-doctor-display">
                    <span className="doctor-name">{preSelectedDoctorName}</span>
                    <button type="button" onClick={() => { setFormData({ ...formData, doctor_id: "" }); navigate("/appointment", { replace: true }); }} className="change-doctor-btn">Change</button>
                  </div>
                ) : (
                  <select id="doctor" name="doctor_id" value={formData.doctor_id} onChange={handleChange} disabled={loading} required>
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (<option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialty})</option>))}
                  </select>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date *</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Preferred Time *</label>
                  {availableTimes.length > 0 ? (
                    <select id="time" name="time" value={formData.time} onChange={handleChange} required disabled={loading}>
                      <option value="">Select a time</option>
                      {availableTimes.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
                    </select>
                  ) : (
                    <p className="no-times-message">
                      {formData.date && formData.doctor_id ? "No available times for this date" : "Select doctor and date to see times"}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Information (Optional)</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Please describe your symptoms or any special requirements..." disabled={loading} />
              </div>

              <button type="submit" className="submit-btn" disabled={loading || !formData.time}>
                {loading ? "Booking..." : "Book Appointment"}
              </button>
              <button 
                type="button" 
                className="cancel-btn mobile-only" 
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>

            </form>

            <aside className="appointment-sidebar">
              <div className="info-card">
                <h3>📍 Clinic Location</h3>
                <p>Kotipalli Bus Stand backside, Rajahmundry</p>
                <a href="https://maps.app.goo.gl/Gv5Ca1RmpwVixFyH6" target="_blank" rel="noopener noreferrer" className="map-link">Get Directions</a>
              </div>
              <div className="info-card">
                <h3>⏰ Working Hours</h3>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM<br />Sunday: Closed</p>
              </div>
              <div className="info-card highlight-card">
                <h3>💡 First Visit?</h3>
                <p>Please arrive 15 minutes early to complete paperwork. Remember to bring your insurance card and a list of any current medications.</p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default Appointment;