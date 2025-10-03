import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RescheduleAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment; // Get appointment from navigation state

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
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Failed to reschedule. Please try again or call us.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return null;
  }

  if (success) {
    return (
      <div className="appointment-page">
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Appointment Rescheduled Successfully!</h2>
            <p>Your appointment has been updated to the new date and time.</p>
            <p>A confirmation email has been sent to {appointment.email}</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Reschedule Your Appointment</h1>
        <p>Choose a new date and time for your appointment</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Current Appointment Details */}
        <div className="appointment-form" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Current Appointment</h3>
          <div className="success-details">
            <p><strong>Patient:</strong> {appointment.patientName}</p>
            <p><strong>Current Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Current Time:</strong> {appointment.time}</p>
            <p><strong>Doctor:</strong> {appointment.doctor}</p>
          </div>
        </div>

        {/* Reschedule Form */}
        <div className="appointment-form" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>New Date & Time</h3>
          
          {error && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleReschedule}>
            <div className="form-group">
              <label htmlFor="newDate">New Date *</label>
              <input
                type="date"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newTime">New Time *</label>
              {availableTimes.length > 0 ? (
                <select
                  id="newTime"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
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
                  {newDate
                    ? 'No available times for selected date'
                    : 'Select a date to see available times'}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !newDate || !newTime}
                style={{ flex: 1 }}
              >
                {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--primary)',
                  border: '2px solid var(--primary)',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </form>

          <p style={{ 
            textAlign: 'center',
            marginTop: '1.5rem',
            color: 'var(--gray)',
            fontSize: '0.9rem'
          }}>
            Need help? Call us at <strong>63024 03471</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RescheduleAppointment;