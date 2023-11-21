import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/viper5.mp4";
import "../components/AddSkin.css";
const token = localStorage.getItem("token");

function AddSkin() {
  const [skin, setSkin] = useState("");
  const [nama, setNama] = useState("");
  const [weapon, setWeapon] = useState("");
  const [gambarSkin, setGambarSkin] = useState(null);
  const navigate = useNavigate();
  const [validation, setValidation] = useState({ errors: [] });
  const [weaponNames, setWeaponNames] = useState([]);

  const [selectedWeapon, setSelectedWeapon] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/weapon");
      const data = response.data.data;
      setWeaponNames(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleSkin = (e) => {
    setSkin(e.target.value);
  };
  const handleNama = (e) => {
    setSelectedWeapon(e.target.value);
  };

  const handleGambarSkin = (e) => {
    const file = e.target.files[0];
    setGambarSkin(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("skin", skin);
    formData.append("nama", selectedWeapon);
    formData.append("gambarSkin", gambarSkin);
    formData.append("weapon", weapon);

    try {
      const response = await axios.post(
        "http://localhost:3000/skin/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Berhasil Ditambahkan!");
      navigate("/skin");
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
        <div className="text-center text-white fs-4 mb-4">Tambahkan Skin</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama Weapon:</label>
            <select
              className="form-control"
              value={selectedWeapon}
              onChange={handleNama}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
            >
              {weaponNames.map((weapon) => (
                <option key={weapon.id} value={weapon.nama}>
                  {weapon.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Skin:</label>
            <input
              type="text"
              className="form-control"
              value={skin}
              onChange={handleSkin}
              placeholder="Masukkan nama Skin"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Gambar:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleGambarSkin}
              placeholder="Masukkan gambar Gambar"
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

export default AddSkin;
