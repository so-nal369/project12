import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH PATIENTS ================= */
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= ADD PATIENT ================= */
export const addPatient = createAsyncThunk(
  "patients/addPatient",
  async (patientData, { dispatch }) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= DELETE PATIENT ================= */
export const deletePatient = createAsyncThunk(
  "patients/deletePatient",
  async (id, { dispatch }) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= UPDATE PATIENT ================= */
export const updatePatient = createAsyncThunk(
  "patients/updatePatient",
  async ({ id, name, age, address }, { dispatch }) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/patients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, age, address }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= SLICE ================= */
const patientSlice = createSlice({
  name: "patients", // ✅ FIXED
  initialState: {
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default patientSlice.reducer;
