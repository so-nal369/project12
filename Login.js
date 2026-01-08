import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginUser } from "./authSlice";
import Register from "./Register";

const Login = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // 👉 SWITCH TO REGISTER PAGE
  if (showRegister) {
    return <Register goToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setShowRegister(true)}
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
