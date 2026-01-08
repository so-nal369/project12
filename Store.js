import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import appointmentReducer from "./appointmentSlice";
import authReducer from "./authSlice";
const Store = configureStore({
  reducer: {
    patients: patientReducer,
    appointments:appointmentReducer,
      auth: authReducer,
  },
});

export default Store;
