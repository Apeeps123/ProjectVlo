import React, { useState, useEffect } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/viper.mp4";
import "../components/Roles.css";
const url = "http://localhost:3000/static/";
const token = localStorage.getItem("token");
const isLoggedIn = !!token;

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
            Authorization: `Bearer ${token}`,
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
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (window.confirm("Are you sure you want to delete this role?")) {
      axios
        .delete(`http://localhost:3000/roles/delete/${id}`, { headers })
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
              {isLoggedIn && <th scope="col">Actions</th>}
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
                  {isLoggedIn && (
                    <svg
                      onClick={() => handleShowEditModal(role.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="yellow"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                      style={{ marginRight: "20px", cursor: "pointer" }}
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  )}
                  {isLoggedIn && (
                    <svg
                      onClick={() => handleDelete(role.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="red"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  )}
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
