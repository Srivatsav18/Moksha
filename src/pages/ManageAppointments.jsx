import { useNavigate } from 'react-router-dom';

function ManageAppointments() {
  const navigate = useNavigate();

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Manage Your Appointments</h1>
        <p>Book a new appointment or manage an existing one</p>
      </div>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '2rem'
      }}>
        
        {/* Book Appointment Card */}
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '2px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onClick={() => navigate('/appointment')}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '2.5rem'
          }}>
            📅
          </div>
          
          <h2 style={{ 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            color: 'var(--dark)'
          }}>
            Book New Appointment
          </h2>
          
          <p style={{ 
            color: 'var(--gray)',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Schedule a consultation with our expert Dentist
          </p>
          
          <button style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%'
          }}>
            Book Now
          </button>
        </div>

        {/* Cancel Appointment Card */}
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '2px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          e.currentTarget.style.borderColor = '#dc2626';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onClick={() => navigate('/cancel-appointment')}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '2.5rem'
          }}>
            ❌
          </div>
          
          <h2 style={{ 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            color: 'var(--dark)'
          }}>
            Manage Appointment
          </h2>
          
          <p style={{ 
            color: 'var(--gray)',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Cancel or reschedule your existing appointment
          </p>
          
          <button style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: '#dc2626',
            border: '2px solid #dc2626',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%'
          }}>
            Mange Appointment
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '1.5rem',
        background: '#f8fafc',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: 'var(--gray)',
          marginBottom: '0.5rem',
          fontSize: '0.95rem'
        }}>
          Need assistance?
        </p>
        <p style={{ 
          color: 'var(--dark)',
          fontWeight: '600',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Call us at 63024 03471
        </p>
      </div>
    </div>
  );
}

export default ManageAppointments;