import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/AddAgent.css";
import "react-toastify/dist/ReactToastify.css";
import videoSource from "../Asset/omen.mp4";

function AddAgent() {
  const [roles, setRoles] = useState([]);
  const [validation, setValidation] = useState({ errors: [] });
  const [nama, setNama] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [gambar, setGambar] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response2 = await axios.get("http://localhost:3000/roles");
      const data2 = await response2.data.data;
      setRoles(data2);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNama = (e) => {
    setNama(e.target.value);
  };
  const handleRole = (e) => {
    setRole(e.target.value);
  };
  const handleBio = (e) => {
    setBio(e.target.value);
  };
  const handleGambar = (e) => {
    const file = e.target.files[0];
    setGambar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("bio", bio);
    formData.append("role", role);
    formData.append("gambar", gambar);

    try {
      const response = await axios.post(
        "http://localhost:3000/agent/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Berhasil Ditambahkan!");
      navigate("/agent");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setValidation(error.response.data);
        } else {
          console.error("Kesalahan: ", error);
        }
      } else {
        console.error("Kesalahan: ", error);
      }
    }
  };

  return (
    <div className="background-container" style={{ position: "relative" }}>
      <video
        autoPlay
        loop
        muted
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="centered-form">
        <div className="label-center labelly text-white">Tambahkan Agent</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama:</label>
            <input
              type="text"
              className="form-control"
              value={nama}
              onChange={handleNama}
              placeholder="Masukkan nama Agent"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Bio:</label>
            <input
              className="form-control"
              value={bio}
              onChange={handleBio}
              placeholder="Masukkan Bio Agent"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", color: "white" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role:</label>
            <select
              className="form-select"
              value={role}
              onChange={handleRole}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", color: "white" }}
            >
              <option
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  color: "white",
                }}
                value=""
              >
                Pilih Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Gambar:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleGambar}
              placeholder="Masukkan gambar Agent"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAgent;
