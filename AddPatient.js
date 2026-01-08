import { useDispatch } from "react-redux";
import { useState } from "react";
import { addPatient, fetchPatients } from "./patientSlice";

const AddPatient = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addPatient({ name, age, address }))
      .then(() => dispatch(fetchPatients()));

    setName("");
    setAge("");
    setAddress("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          value={age}
          placeholder="Enter age"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          value={address}
          placeholder="Enter address"
          onChange={(e) => setAddress(e.target.value)}
        />

        <button type="submit" className="add-btn">
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default AddPatient;
