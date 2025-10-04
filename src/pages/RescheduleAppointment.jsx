import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RescheduleAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!appointment) {
      navigate('/manage-appointments');
    }
  }, [appointment, navigate]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!newDate || !appointment) return;
      try {
        const response = await fetch(
          `https://docbook-backend-aqcx.onrender.com/api/appointments/available-times?doctor_id=${appointment.doctor_id || 1}&date=${newDate}`
        );
        const data = await response.json();
        setAvailableTimes(data.available_times || []);
      } catch (err) {
        console.error('Error fetching times:', err);
        setAvailableTimes([]);
      }
    };
    fetchAvailableTimes();
  }, [newDate, appointment]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://docbook-backend-aqcx.onrender.com/api/appointments/${appointment.id}?date=${newDate}&time=${newTime}`,
        {
          method: 'PUT',
        }
      );
      if (!response.ok) throw new Error('Failed to reschedule appointment');
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to reschedule. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  if (success) {
    return (
      <div className="appointment-page">
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Appointment Rescheduled!</h2>
            <p>Your appointment has been updated. A confirmation email has been sent to {appointment.email}</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="appointment-header">
        <h1>Reschedule Your Appointment</h1>
        <p>Choose a new date and time for your visit.</p>
      </div>

      <div className="reschedule-grid">
        <div className="appointment-details-card">
          <h3>Current Appointment</h3>
          <div className="success-details">
            <p><strong>Patient:</strong> {appointment.patientName}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Doctor:</strong> {appointment.doctor}</p>
          </div>
        </div>

        <div className="appointment-form">
          <h3>New Date & Time</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleReschedule}>
            <div className="form-group">
              <label htmlFor="newDate">New Date *</label>
              <input type="date" id="newDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="newTime">New Time *</label>
              {availableTimes.length > 0 ? (
                <select id="newTime" value={newTime} onChange={(e) => setNewTime(e.target.value)} required disabled={loading}>
                  <option value="">Select a time</option>
                  {availableTimes.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
                </select>
              ) : (
                <p className="no-times-message">
                  {newDate ? 'No available times for this date' : 'Select a date to see available times'}
                </p>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading || !newDate || !newTime}>
                {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
              <button type="button" onClick={() => navigate(-1)} disabled={loading} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RescheduleAppointment;