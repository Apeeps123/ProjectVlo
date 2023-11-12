import React, { useState, useEffect } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/viper.mp4";
import "../components/Roles.css";
const url = "http://localhost:3000/static/";

function Roles() {
  const [Roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [deletingRoleId, setDeletingRoleId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/roles");
      const data = response.data.data;
      setRoles(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    role: "",
    icon: null,
  });

  const handleShowEditModal = (id) => {
    const roleUpdate = Roles.find((role) => role.id === id);
    if (roleUpdate) {
      setEditData(roleUpdate);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id: null,
      role: "",
      icon: null,
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

    if (!editData.role) {
      console.error("Nama Role harus diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("role", editData.role);

    if (editData.icon) {
      formData.append("icon", editData.icon);
    }

    try {
      await axios.patch(
        `http://localhost:3000/roles/update/${editData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/roles");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
    }
  };

  const handleDelete = (id) => {
    console.log("Trying to delete data with ID:", id);

    if (window.confirm("Are you sure you want to delete this role?")) {
      axios
        .delete(`http://localhost:3000/roles/delete/${id}`)
        .then((response) => {
          console.log("Data berhasil dihapus");
          const updateRoles = Roles.filter((role) => role.id !== id);
          setRoles(updateRoles);
          setDeletingRoleId(null);
          alert("Berhasil di delete!!");
        })
        .catch((error) => {
          console.error("Gagal menghapus data:", error);
          alert(
            "Gagal menghapus data. Silakan coba lagi atau hubungi administrator."
          );
          setDeletingRoleId(null);
        });
    } else {
      setDeletingRoleId(null);
    }
  };

  return (
    <div className="roles-container">
      <video autoPlay loop muted className="video-background">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Row className="justify-content-center">
        <table style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama Role</th>
              <th scope="col">Icon</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td>{role.role}</td>
                <td>
                  <img
                    src={url + role.icon}
                    style={{
                      width: "80px",
                      height: "80px",
                      marginTop: "15px",
                    }}
                    alt={role.id + " gambar"}
                  />
                  <br />
                </td>{" "}
                <td>
                  <button
                    onClick={() => handleShowEditModal(role.id)}
                    className="btn btn-sm btn-info"
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(role.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama Role:</label>
              <input
                type="text"
                className="form-control"
                value={editData.role}
                onChange={(e) => handleEditDataChange("role", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">icon:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  handleEditDataChange("icon", e.target.files[0])
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Roles;
