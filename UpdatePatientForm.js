import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPatients, updatePatient } from "./patientSlice";

const UpdatePatientForm = ({ patient, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);
  const [address, setAddress] = useState(patient.address);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updatePatient({
        id: patient.id,
        name,
        age,
        address,
      })
    ).then(() => {
      dispatch(fetchPatients());
      onClose();
    });
  };

  return (
    <div className="update-container">
      <h3>Edit Patient</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />

        <button type="submit" className="update-btn">
          Update
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdatePatientForm;
