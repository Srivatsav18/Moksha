// API configuration with environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://docbook-backend-aqcx.onrender.com';

// Helper function for making API requests with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        errorData?.message || 
        `HTTP error! status: ${response.status}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API service functions
export const api = {
  // Get all doctors
  getDoctors: async () => {
    return await apiRequest('/api/doctors');
  },

  // Get single doctor by ID
  getDoctor: async (id) => {
    return await apiRequest(`/api/doctors/${id}`);
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    return await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get all appointments
  getAppointments: async () => {
    return await apiRequest('/api/appointments');
  },

  // Get available appointment times
  getAvailableTimes: async (doctorId, date) => {
    return await apiRequest(
      `/api/appointments/available-times?doctor_id=${doctorId}&date=${date}`
    );
  },
};

// Export API base URL for any components that might need it directly
export { API_BASE_URL };