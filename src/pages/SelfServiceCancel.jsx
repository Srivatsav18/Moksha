import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SelfServiceCancel() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Select appointment
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://docbook-backend-aqcx.onrender.com/api/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const allAppointments = await response.json();
      
      // Filter appointments by phone number
      const userAppointments = allAppointments.filter(
        apt => apt.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
      );

      if (userAppointments.length === 0) {
        setError('No appointments found with this phone number');
        return;
      }

      setAppointments(userAppointments);
      setStep(2);
    } catch (err) {
      setError('Failed to search for appointments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(`https://docbook-backend-aqcx.onrender.com/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      setCancelled(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Failed to cancel appointment. Please try again or call us.');
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleAppointment = async (appointmentId) => {
    // Find the appointment to pass to reschedule page
    const appointmentToReschedule = appointments.find(apt => apt.id === appointmentId);
    
    // Navigate to reschedule page with appointment data
    navigate('/reschedule-appointment', { 
      state: { appointment: appointmentToReschedule } 
    });
  };

  if (cancelled) {
    return (
      <div className="appointment-page">
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Appointment Cancelled Successfully</h2>
            <p>A cancellation confirmation has been sent to your email.</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Manage Your Appointment</h1>
        <p>Enter your phone number to find and cancel your appointment</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {step === 1 ? (
          <div className="appointment-form">
            <form onSubmit={handlePhoneSearch}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(value);
                    setError(null);
                  }}
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  disabled={loading}
                  style={{
                    letterSpacing: '1px',
                    fontFamily: 'monospace'
                  }}
                />
                {phone && phone.length < 10 && (
                  <small style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    Please enter exactly 10 digits ({phone.length}/10)
                  </small>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || phone.length !== 10}
              >
                {loading ? 'Searching...' : 'Find My Appointments'}
              </button>

              <p style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem',
                color: 'var(--gray)',
                fontSize: '0.95rem'
              }}>
                Need help? Call us at <strong>63024 03471</strong>
              </p>
            </form>
          </div>
        ) : (
          <div className="appointment-form">
            <h3 style={{ marginBottom: '1rem' }}>Your Appointments</h3>
            
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                style={{
                  background: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div className="success-details" style={{ marginBottom: '1rem' }}>
                  <p><strong>Patient:</strong> {apt.patientName}</p>
                  <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p><strong>Time:</strong> {apt.time}</p>
                  <p><strong>Doctor:</strong> {apt.doctor}</p>
                  <p><strong>Status:</strong> {apt.status}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleRescheduleAppointment(apt.id)}
                    disabled={cancelling}
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      opacity: cancelling ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cancelling ? 'Processing...' : 'Reschedule'}
                  </button>

                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    disabled={cancelling}
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      padding: '0.75rem 1.5rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      opacity: cancelling ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setStep(1);
                setPhone('');
                setAppointments([]);
                setError(null);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--primary)',
                border: '2px solid var(--primary)',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                width: '100%',
                marginTop: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelfServiceCancel;