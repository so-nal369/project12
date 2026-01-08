import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH DOCTORS ================= */
export const fetchDoctors = createAsyncThunk(
  "appointments/fetchDoctors",
  async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/doctors", {
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

/* ================= ADD APPOINTMENT ================= */
export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (data) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= FETCH APPOINTMENTS ================= */
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/appointments", {
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

/* ================= DELETE APPOINTMENT ================= */
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/appointments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= UPDATE APPOINTMENT STATUS ================= */
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ id, status }) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/appointments/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }

    return res.json();
  }
);

/* ================= SLICE ================= */
const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    doctors: [],
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDoctors.fulfilled, (state, action) => {
      state.doctors = action.payload;
    });

    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default appointmentSlice.reducer;
