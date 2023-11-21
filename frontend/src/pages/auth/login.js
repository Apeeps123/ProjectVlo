import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../../Asset/wp.png";
import "../../components/Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
        window.location.reload();
      } else {
        console.error("Gagal login: Token tidak diterima");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error("Gagal login: Kata sandi atau username salah");
      } else {
        console.error("Gagal login:", error);
      }
    }
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="centered-form">
        <div className="text-center text-white fs-4 mb-4">Login</div>
        <form>
          <div className="mb-3">
            <div className="form-group">
              <label>Username:</label>
              <input
                className="form-control"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Password :</label>
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handlelogin}>
            Login
          </button>{" "}
          <p className="mt-2">
            Belum punya akun? <a href="/register">Daftar</a>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;
