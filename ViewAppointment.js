

const ViewAppointment = ({ appointment, onClose }) => {
  return (
    <div className="view-overlay">
      <div className="view-card">
        <h3>Appointment Details</h3>

        <p><strong>Patient:</strong> {appointment.patient_name}</p>
        <p><strong>Doctor:</strong> {appointment.doctor_name}</p>
        <p><strong>Specialization:</strong> {appointment.specialization}</p>
        <p><strong>Date:</strong> {appointment.appointment_date}</p>
        <p><strong>Time:</strong> {appointment.appointment_time}</p>
        <p><strong>Status:</strong> {appointment.status}</p>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewAppointment;
