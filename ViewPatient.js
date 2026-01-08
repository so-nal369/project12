const ViewPatient = ({ patient, onClose }) => {
  return (
    <div className="view-overlay">
      <div className="view-card">
        <h3>Patient Details</h3>

        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Address:</strong> {patient.address}</p>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewPatient;