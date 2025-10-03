import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DoctorProfile from './pages/DoctorProfile'
import Appointment from './pages/Appointment'
import SelfServiceCancel from './pages/SelfServiceCancel'
import ManageAppointments from './pages/ManageAppointments'
import RescheduleAppointment from './pages/RescheduleAppointment'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="doctor/:name" element={<DoctorProfile />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="cancel-appointment" element={<SelfServiceCancel />} />
        <Route path="manage-appointments" element={<ManageAppointments />} />
        <Route path="reschedule-appointment" element={<RescheduleAppointment />} />
      </Route>
    </Routes>
  )
}

export default App