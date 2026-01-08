import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "./appointmentSlice";
import ViewAppointment from "./ViewAppointment";
import { deleteAppointment } from "./appointmentSlice";
import { updateAppointment } from "./appointmentSlice";
const AppointmentList = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(
    (state) => state.appointments.list
  );

  const [viewAppointment, setViewAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteAppointment(id))
      .then(() => dispatch(fetchAppointments()));
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateAppointment({ id, status }))
      .then(() => dispatch(fetchAppointments()));
  };

  return (
    <div>
      <h2>Appointments</h2>

      {viewAppointment && (
        <ViewAppointment
          appointment={viewAppointment}
          onClose={() => setViewAppointment(null)}
        />
      )}

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} className="list">
            <div>
              <p>
                <strong>{a.patient_name}</strong> →{" "}
                <strong>{a.doctor_name}</strong>
              </p>
              <p>
                {a.appointment_date} | {a.appointment_time}
              </p>
            </div>

            {/* STATUS DROPDOWN */}
            <select
              value={a.status}
              onChange={(e) =>
                handleStatusChange(a.id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div>
              <button
                className="view-btn"
                onClick={() => setViewAppointment(a)}
              >
                View
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(a.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;