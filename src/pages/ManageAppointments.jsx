import { useNavigate } from 'react-router-dom';

function ManageAppointments() {
  const navigate = useNavigate();

  return (
    <div className="management-page">
      <div className="appointment-header">
        <h1>Manage Your Appointments</h1>
        <p>Book a new appointment or manage an existing one.</p>
      </div>

      <div className="management-grid">
        
        {/* Book Appointment Card */}
        <div className="management-card" onClick={() => navigate('/appointment')}>
          <div className="management-card__icon book">
            📅
          </div>
          <h2 className="management-card__title">
            Book New Appointment
          </h2>
          <p className="management-card__text">
            Schedule a consultation with one of our expert dentists.
          </p>
          <button className="btn-primary">Book Now</button>
        </div>

        {/* Manage Appointment Card */}
        <div className="management-card" onClick={() => navigate('/cancel-appointment')}>
          <div className="management-card__icon manage">
            ❌
          </div>
          <h2 className="management-card__title">
            Manage Existing Appointment
          </h2>
          <p className="management-card__text">
            Cancel or reschedule your upcoming appointment with ease.
          </p>
          <button className="btn-secondary">Manage Now</button>
        </div>

      </div>

      <div className="contact-reminder-card">
        <p>Need assistance?</p>
        <strong>Call us at 63024 03471</strong>
      </div>
    </div>
  );
}

export default ManageAppointments;