const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "hospital_db",
});

/* ================= JWT SECRET ================= */
const JWT_SECRET = "hospital_secret_key";

/* ================= JWT VERIFY ================= */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
};

/* ================= ROLE CHECK ================= */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

/* ================= AUTH ================= */

/* REGISTER */
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [name, email, hashedPassword, role || "staff"],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered successfully" });
    }
  );
});

/* LOGIN */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
});

/* ================= PATIENTS ================= */

/* View Patients (admin, staff) */
app.get(
  "/patients",
  verifyToken,
  checkRole("admin", "staff"),
  (req, res) => {
    db.query("SELECT * FROM patients", (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  }
);

/* Add Patient (admin, staff) */
app.post(
  "/patients",
  verifyToken,
  checkRole("admin", "staff"),
  (req, res) => {
    const { name, age, address } = req.body;

    db.query(
      "INSERT INTO patients (name, age, address) VALUES (?,?,?)",
      [name, age, address],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Patient added successfully" });
      }
    );
  }
);

/* Update Patient (admin only) */
app.put(
  "/patients/:id",
  verifyToken,
  checkRole("admin"),
  (req, res) => {
    const { id } = req.params;
    const { name, age, address } = req.body;

    db.query(
      "UPDATE patients SET name=?, age=?, address=? WHERE id=?",
      [name, age, address, id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Patient updated successfully" });
      }
    );
  }
);

/* Delete Patient (admin only) */
app.delete(
  "/patients/:id",
  verifyToken,
  checkRole("admin"),
  (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM patients WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Patient deleted successfully" });
    });
  }
);

/* ================= DOCTORS ================= */

/* View Doctors (admin only) */
app.get(
  "/doctors",
  verifyToken,
  checkRole("admin"),
  (req, res) => {
    db.query("SELECT * FROM doctors", (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  }
);

/* ================= APPOINTMENTS ================= */

/* Add Appointment (admin, staff) */
app.post(
  "/appointments",
  verifyToken,
  checkRole("admin", "staff"),
  (req, res) => {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
    } = req.body;

    const query = `
      INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, appointment_time, reason)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        reason,
      ],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Appointment added successfully" });
      }
    );
  }
);

/* View Appointments (admin, staff, doctor) */
app.get(
  "/appointments",
  verifyToken,
  checkRole("admin", "staff", "doctor"),
  (req, res) => {
    const query = `
      SELECT 
        a.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        d.specialization,
        a.appointment_date,
        a.appointment_time,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
    `;

    db.query(query, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  }
);

/* Delete Appointment (admin only) */
app.delete(
  "/appointments/:id",
  verifyToken,
  checkRole("admin"),
  (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM appointments WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Appointment deleted successfully" });
    });
  }
);

/* Update Status (doctor, admin) */
app.put(
  "/appointments/status/:id",
  verifyToken,
  checkRole("doctor", "admin"),
  (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
      "UPDATE appointments SET status=? WHERE id=?",
      [status, id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Appointment status updated" });
      }
    );
  }
);

/* ================= SERVER ================= */
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
