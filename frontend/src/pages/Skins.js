import React, { useState, useEffect } from "react";
import { Container, Row, Modal, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../components/Skins.css";
import videoSource from "../Asset/cypher.mp4";
const url = "http://localhost:3000/static/";
const token = localStorage.getItem("token");
const isLoggedIn = !!token;

function Skins() {
  const [skins, setSkins] = useState([]);
  const [weaponNames, setWeaponNames] = useState([]);
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [selectedWeaponData, setSelectedWeaponData] = useState(null);
  const [deletingid, setDeletingid] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    skin: "",
    nama: "",
    skins: "",
    gambarSkin: null,
    gambarSkinPreview: null,
  });

  const navigate = useNavigate();
  const { nama } = useParams();

  useEffect(() => {
    fetchData();
  }, [nama]);

  const fetchData = async () => {
    try {
      const [skinResponse, weaponResponse] = await Promise.all([
        axios.get(`http://localhost:3000/skin/detail/${nama}`),
        axios.get("http://localhost:3000/weapon"),
      ]);

      const skinData = skinResponse.data.data;
      const weaponData = weaponResponse.data.data;

      console.log("Fetched Skin Data:", skinData);
      console.log("Fetched Weapon Data:", weaponData);

      setSkins(skinData);
      setWeaponNames(weaponData);

      // Set the first weapon as the selected weapon by default
      if (weaponData.length > 0) {
        handleWeaponChange(weaponData[0].nama);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShowEditModal = (id) => {
    const roleUpdate = skins.find((skin) => skin.id === id);
    if (roleUpdate) {
      setEditData(roleUpdate);

      const correspondingWeapon = weaponNames.find(
        (weapon) => weapon.nama === roleUpdate.nama
      );

      setSelectedWeapon(correspondingWeapon?.nama || "");
      setSelectedWeaponData(correspondingWeapon || null);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id: null,
      skin: "",
      skins: "",
      gambarSkin: null,
      gambarSkinPreview: null,
    });
  };

  const handleEditDataChange = (field, value) => {
    if (field === "gambar") {
      handleEditDataChange("gambarSkin", value);
      setEditData((prevData) => ({
        ...prevData,
        gambarSkinPreview: URL.createObjectURL(value),
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handleWeaponChange = (newWeapon) => {
    const newWeaponData = weaponNames.find(
      (weapon) => weapon.nama === newWeapon
    );
    setSelectedWeapon(newWeapon);
    setSelectedWeaponData(newWeaponData || null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editData.skin || !selectedWeaponData) {
      console.error("Nama Skin dan Nama Weapon harus diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("skin", editData.skin);
    formData.append("nama", selectedWeaponData?.nama || "");
    formData.append("skins", editData.skins);

    if (editData.gambarSkin) {
      formData.append("gambarSkin", editData.gambarSkin);
    }

    try {
      console.log("Sending data:", formData);
      const response = await axios.patch(
        `http://localhost:3000/skin/update/${editData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,     
          },
        }
      );

      console.log("API Response:", response.data);

      navigate("/skin");
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
    }
  };

  const handleDelete = (id) => {
    console.log("Trying to delete data with ID:", id);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (window.confirm("Are you sure you want to delete this weapon?")) {
      axios
        .delete(`http://localhost:3000/skin/delete/${id}`, { headers })
        .then((response) => {
          console.log("Data berhasil dihapus");
          const updateSkin = skins.filter((skin) => skin.id !== id);
          setSkins(updateSkin);
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

  return (
    <div className="skins-container">
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
            {skins.map((skin, index) => (
              <div className="gallery-item" key={skin.id}>
                <img
                  src={url + skin.gambarSkin}
                  alt={skin.id + "gambarSkin"}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <div>{skin.skin}</div>
                  <div>
                    {
                      weaponNames.find((weapon) => weapon.nama === skin.nama)
                        ?.nama
                    }
                  </div>
                  <div className="button-container">
                    {isLoggedIn && (
                      <button
                        className="gallery-button edit-button"
                        style={{ marginRight: "5px" }}
                        onClick={() => handleShowEditModal(skin.id)}
                      >
                        Edit
                      </button>
                    )}
                    {isLoggedIn && (
                      <button
                        onClick={() => handleDelete(skin.id)}
                        className="gallery-button delete-button"
                      >
                        Delete
                      </button>
                    )}
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
                <label className="form-label">Nama Weapon:</label>
                <select
                  className="form-control"
                  value={selectedWeapon}
                  onChange={(e) => handleWeaponChange(e.target.value)}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                  }}
                >
                  {weaponNames.map((weapon) => (
                    <option key={weapon.id} value={weapon.nama}>
                      {weapon.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nama Skin:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.skin}
                  onChange={(e) => handleEditDataChange("skin", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">gambar:</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    handleEditDataChange("gambar", e.target.files[0])
                  }
                />
                {editData.gambarSkinPreview && (
                  <Image
                    src={editData.gambarSkinPreview}
                    alt="Preview"
                    fluid
                    className="mt-2"
                  />
                )}
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

export default Skins;
