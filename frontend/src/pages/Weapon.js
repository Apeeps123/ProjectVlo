import React, { useState, useEffect } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/omen2.mp4";
import "../../src/components/Weapon.css";

const url = "http://localhost:3000/static/";

function Weapon() {
  const [weaponList, setWeaponList] = useState([]);
  const navigate = useNavigate();
  const [deletingid, setDeletingid] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    type: "",
    gambarWpn: null,
  });
  const [validation, setValidation] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/weapon");
      const data = response.data.data;
      setWeaponList(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleShowEditModal = (id) => {
    const weaponToEdit = weaponList.find((wpn) => wpn.id === id);
    if (weaponToEdit) {
      setEditData(weaponToEdit);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id: null,
      nama: "",
      type: "",
      gambarWpn: null,
    });
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("id", editData.id);
    formData.append("nama", editData.nama);
    formData.append("type", editData.type);

    if (editData.gambarWpn) {
      formData.append("gambarWpn", editData.gambarWpn);
    }

    try {
      await axios.patch(
        `http://localhost:3000/weapon/update/${editData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/weapon");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = (id) => {
    console.log("Trying to delete data with ID:", id);

    if (window.confirm("Are you sure you want to delete this weapon?")) {
      axios
        .delete(`http://localhost:3000/weapon/delete/${id}`)
        .then((response) => {
          console.log("Data berhasil dihapus");
          const updateWeapon = weaponList.filter((weapon) => weapon.id !== id);
          setWeaponList(updateWeapon);
          setDeletingid(null);
          alert("Berhasil di delete!!");
        })
        .catch((error) => {
          console.error("Gagal menghapus data:", error);
          alert(
            "Gagal menghapus data. Silakan coba lagi atau hubungi administrator."
          );
          setDeletingid(null);
        });
    } else {
      setDeletingid(null);
    }
  };

  const handleNama = (e) => {
    const value = e.target.value;
    setEditData((prevData) => ({
      ...prevData,
      nama: value,
    }));
  };

  const handleType = (e) => {
    const selectedType = e.target.value;
    const defaultWeaponName = getWeaponOptionsByType(selectedType)[0];
    setEditData({
      ...editData,
      type: selectedType,
      nama: defaultWeaponName,
    });
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
    <div>
      {" "}
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
      <Container>
        <Row>
          <div className="gallery">
            {weaponList.map((weapon, index) => (
              <div className="gallery-item" key={weapon.id}>
                <img
                  src={url + weapon.gambarWpn}
                  alt={weapon.id + "gambarWpn"}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <div>{weapon.nama}</div>
                  <div>{weapon.type}</div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    <button
                      className="gallery-button"
                      onClick={() => handleShowEditModal(weapon.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="gallery-button"
                      onClick={() => {
                        navigate(`/skin/detail/${weapon.nama}`);
                      }}
                    >
                      Lihat Skin
                    </button>
                    <button
                      onClick={() => handleDelete(weapon.id)}
                      className="gallery-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Row>
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Type:</label>
                <select className="form-select" onChange={handleType}>
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
                <label className="form-label">Nama:</label>
                <select className="form-select" onChange={handleNama}>
                  {getWeaponOptionsByType(editData.type).map((weapon) => (
                    <option key={weapon} value={weapon}>
                      {weapon}
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
                  onChange={(e) =>
                    handleEditDataChange("gambarWpn", e.target.files[0])
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Simpan Perubahan
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default Weapon;
