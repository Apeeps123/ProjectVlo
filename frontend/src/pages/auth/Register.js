import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../../Asset/wpreg.png";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username: username,
          password: password,
        }
      );
      console.log("Pendaftaran berhasil:", response.data);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Gagal mendaftar:", error);
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
        <div className="text-center text-white fs-4 mb-4">Register</div>
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
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleRegister}>
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
