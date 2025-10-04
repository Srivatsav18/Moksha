import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SelfServiceCancel() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(true);
    try {
      const response = await fetch(`https://docbook-backend-aqcx.onrender.com/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to cancel appointment');
      setCancelled(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to cancel appointment. Please try again or call us.');
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    const appointmentToReschedule = appointments.find(apt => apt.id === appointmentId);
    navigate('/reschedule-appointment', { state: { appointment: appointmentToReschedule } });
  };

  if (cancelled) {
    return (
      <div className="appointment-page">
        <div className="success-message-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Appointment Cancelled</h2>
            <p>Your appointment has been successfully cancelled. A confirmation has been sent to your email.</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="appointment-header">
        <h1>Manage Your Appointment</h1>
        <p>{step === 1 ? 'Enter your phone number to find your appointment.' : 'Here are your upcoming appointments.'}</p>
      </div>

      <div className="management-container">
        {step === 1 ? (
          <form className="appointment-form" onSubmit={handlePhoneSearch}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(0, 10); setPhone(value); setError(null); }} required placeholder="9876543210" maxLength={10} pattern="[0-9]{10}" disabled={loading} className="input-monospace" />
              {phone && phone.length < 10 && <small className="form-hint-error">Please enter 10 digits ({phone.length}/10)</small>}
            </div>
            <button type="submit" className="submit-btn" disabled={loading || phone.length !== 10}>
              {loading ? 'Searching...' : 'Find My Appointments'}
            </button>
          </form>
        ) : (
          <div className="appointment-list-container">
            {error && <div className="error-message">{error}</div>}
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-details-card">
                <div className="success-details">
                  <p><strong>Patient:</strong> {apt.patientName}</p>
                  <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> {apt.time}</p>
                  <p><strong>Doctor:</strong> {apt.doctor}</p>
                  <p><strong>Status:</strong> <span className="status-chip">{apt.status}</span></p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleRescheduleAppointment(apt.id)} disabled={cancelling} className="btn-primary">
                    {cancelling ? 'Processing...' : 'Reschedule'}
                  </button>
                  <button onClick={() => handleCancelAppointment(apt.id)} disabled={cancelling} className="btn-danger">
                    {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => { setStep(1); setPhone(''); setAppointments([]); setError(null); }} className="btn-secondary back-btn">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelfServiceCancel;