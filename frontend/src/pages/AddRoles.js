import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/pnx.mp4";
import "../components/AddRoles.css";
const token = localStorage.getItem("token");

function AddRoles() {
  const [role, setRole] = useState("");
  const [icon, setIcon] = useState(null);
  const navigate = useNavigate();
  const [validation, setValidation] = useState({ errors: [] });

  const handleRole = (e) => {
    setRole(e.target.value);
  };
  const handleIcon = (e) => {
    const file = e.target.files[0];
    setIcon(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("role", role);
    formData.append("icon", icon);

    try {
      const response = await axios.post(
        "http://localhost:3000/roles/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Berhasil Ditambahkan!");
      navigate("/roles");
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
      <video autoPlay loop muted className="video-background">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="centered-form">
        <div className="text-center text-white fs-4 mb-4">Tambahkan Roles</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Role:</label>
            <input
              type="text"
              className="form-control"
              value={role}
              onChange={handleRole}
              placeholder="Masukkan nama Role"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">icon:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleIcon}
              placeholder="Masukkan gambar icon"
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

export default AddRoles;
