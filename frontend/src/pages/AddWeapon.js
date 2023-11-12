import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/viper2.mp4";
import "../components/AddWeapon.css";

function AddWeapon() {
  const [nama, setNama] = useState("");
  const [type, setType] = useState("Sidearms");
  const [gambarWpn, setGambarWpn] = useState(null);
  const navigate = useNavigate();
  const [validation, setValidation] = useState({ errors: [] });

  const handleNama = (e) => {
    setNama(e.target.value);
  };

  const handleGambarSkin = (e) => {
    const file = e.target.files[0];
    setGambarWpn(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !type || !gambarWpn) {
      setValidation({ errors: ["All fields are required."] });
      return;
    }

    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("type", type);
    formData.append("gambarWpn", gambarWpn);

    try {
      const response = await axios.post(
        "http://localhost:3000/weapon/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Berhasil Ditambahkan!");

      navigate("/weapon");
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleType = (e) => {
    setType(e.target.value);
    // Reset nama to default value based on selected type
    setNama(getDefaultWeaponName(e.target.value));
  };

  const getDefaultWeaponName = (selectedType) => {
    switch (selectedType) {
      case "Rifles":
        return "Vandal";
      case "Sidearms":
        return "Classic";
      case "SMGs":
        return "Stinger";
      case "Shotguns":
        return "Bucky";
      case "Sniper Rifles":
        return "Marshal";
      case "Machine Guns":
        return "Ares";
      case "Melee":
        return "Tactical Knife";
      default:
        return "";
    }
  };

  const getWeaponOptionsByType = (selectedType) => {
    switch (selectedType) {
      case "Sidearms":
        return ["Classic", "Shorty", "Frenzy", "Ghost", "Sheriff"];
      case "SMGs":
        return ["Stinger", "Spectre"];
      case "Shotguns":
        return ["Bucky", "Judge"];
      case "Rifles":
        return ["Bulldog", "Guardian", "Phantom", "Vandal"];
      case "Sniper Rifles":
        return ["Marshal", "Operator"];
      case "Machine Guns":
        return ["Ares", "Odin"];
      case "Melee":
        return ["Tactical Knife"];
      default:
        return [];
    }
  };

  return (
    <div className="background-container" style={{ position: "relative" }}>
      <video autoPlay loop muted className="video-background">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="centered-form">
        <div className="text-center text-white fs-4 mb-4">Tambahkan Weapon</div>
        <form onSubmit={handleSubmit}>
          {validation.errors.length > 0 && (
            <div className="alert alert-danger">
              {validation.errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label text-white">Type:</label>
            <select className="form-select" value={type} onChange={handleType}>
              {[
                "Sidearms",
                "SMGs",
                "Shotguns",
                "Rifles",
                "Sniper Rifles",
                "Machine Guns",
                "Melee",
              ].map((weaponType) => (
                <option key={weaponType} value={weaponType}>
                  {weaponType}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Nama:</label>
            <select className="form-select" value={nama} onChange={handleNama}>
              {getWeaponOptionsByType(type).map((weapon) => (
                <option key={weapon} value={weapon}>
                  {weapon}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Gambar:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleGambarSkin}
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
export default AddWeapon;
