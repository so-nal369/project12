import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctors,
  addAppointment,
  fetchAppointments,
} from "./appointmentSlice";

const AddAppointment = () => {
  const dispatch = useDispatch();

  // ✅ SAFE selectors
  const doctors = useSelector(
    (state) => state.appointments?.doctors || []
  );
  const patients = useSelector(
    (state) => state.patients?.list || []
  );

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
const handleSubmit = (e) => {
  e.preventDefault();

  dispatch(addAppointment(form))
    .then(() => {
      dispatch(fetchAppointments());

      // ✅ reset form after success
      setForm({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
      });
    });
};

  return (
  <div className="appointment-form">
    <h2>Book Appointment</h2>

    <form onSubmit={handleSubmit}>
     <select
  value={form.patient_id}
  onChange={(e) =>
    setForm({ ...form, patient_id: e.target.value })
  }
>
  <option value="">Select Patient</option>
  {patients.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

<select
  value={form.doctor_id}
  onChange={(e) =>
    setForm({ ...form, doctor_id: e.target.value })
  }
>
  <option value="">Select Doctor</option>
  {doctors.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name} ({d.specialization})
    </option>
  ))}
</select>

<input
  type="date"
  value={form.appointment_date}   // ✅ ADD THIS
  onChange={(e) =>
    setForm({ ...form, appointment_date: e.target.value })
  }
/>

<input
  type="time"
  value={form.appointment_time}   // ✅ ADD THIS
  onChange={(e) =>
    setForm({ ...form, appointment_time: e.target.value })
  }
/>

<input
  type="text"
  value={form.reason}             // ✅ ADD THIS
  placeholder="Reason"
  onChange={(e) =>
    setForm({ ...form, reason: e.target.value })
  }
/>


      <button type="submit">Book Appointment</button>
    </form>
  </div>
);
}
export default AddAppointment;