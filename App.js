import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchPatients, deletePatient } from "./patientSlice";
import LogoutButton from "./LogoutButton";
import Login from "./Login";
import AddPatient from "./AddPatient";
import UpdatePatientForm from "./UpdatePatientForm";
import ViewPatient from "./ViewPatient";

import AddAppointment from "./AddAppointment";
import AppointmentList from "./AppointmentList";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // ✅ SAFE selectors
  const isAuth = useSelector((state) => state.auth?.isAuth);
  const patients = useSelector((state) => state.patients?.list || []);

  const [editingPatient, setEditingPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);

  // ✅ Fetch data ONLY after login
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchPatients());
    }
  }, [dispatch, isAuth]);

  const handleDelete = (id) => {
    dispatch(deletePatient(id))
      .then(() => dispatch(fetchPatients()));
  };

  // 🔐 AUTH GUARD
  if (!isAuth) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <h1>Hospital Management System</h1>
          <LogoutButton />
      {/* ADD PATIENT */}
      <AddPatient />

      {/* VIEW PATIENT MODAL */}
      {viewPatient && (
        <ViewPatient
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
        />
      )}

      {/* UPDATE PATIENT MODAL */}
      {editingPatient && (
        <UpdatePatientForm
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
        />
      )}

      {/* PATIENT LIST */}
      <h2>Patients</h2>

      {patients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        patients.map((p) => (
          <div key={p.id} className="list">
            <p>
              {p.name} - {p.address}
            </p>

            <div>
              <button
                className="view-btn"
                onClick={() => setViewPatient(p)}
              >
                View
              </button>

              <button
                className="edit-btn"
                onClick={() => setEditingPatient(p)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* APPOINTMENT MODULE */}
      <hr />

      <h2>Book Appointment</h2>
      <AddAppointment />

      <h2>Appointments</h2>
      <AppointmentList />
    </div>
  );
}

export default App;
