import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:3000/static/";

function Agent() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [show, setShow] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/agent");
      const data = response.data.data;
      setAgents(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
    try {
      const response2 = await axios.get("http://localhost:3000/roles");
      const data2 = response2.data.data;
      setRoles(data2);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
  };

  const videoSrc =
    "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt29d7c4f6bc077e9e/5eb26f54402b8b4d13a56656/agent-background-generic.mp4";

  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    role: "",
    bio: "",
    gambar: null,
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowEditModal = (id) => {
    const agentToEdit = agents.find((agent) => agent.id === id);
    if (agentToEdit) {
      setEditData(agentToEdit);
      setShowEditModal(true);
      setShow(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id: null,
      nama: "",
      role: "",
      bio: "",
      gambar: null,
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
    formData.append("bio", editData.bio);
    formData.append("role", editData.role);

    if (editData.gambar) {
      formData.append("gambar", editData.gambar);
    }

    try {
      await axios.patch(
        `http://localhost:3000/agent/update/${editData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/agent");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = (id) => {
    console.log("Trying to delete data with ID:", id);

    axios
      .delete(`http://localhost:3000/agent/delete/${id}`)
      .then((response) => {
        console.log("Data berhasil dihapus");
        const updatedAgents = agents.filter((agent) => agent.id !== id);
        setAgents(updatedAgents);
        alert("Berhasil dihapus!..");
      })
      .catch((error) => {
        console.error("Gagal menghapus data:", error);
        alert(
          "Gagal menghapus data. Silakan coba lagi atau hubungi administrator."
        );
      });
  };

  return (
    <div>
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
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="row" style={{ color: "white", paddingTop: "20px" }}>
        <div className="col-md-1">
          <div>
            <ul>
              {agents.map((agent, index) => (
                <li
                  key={agent.id}
                  onClick={() => handleAgentClick(agent)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}.
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: "60px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {agent.nama}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          {selectedAgent && (
            <div>
              <img
                src={url + selectedAgent.gambar}
                style={{
                  width: "120%",
                  height: "110%",
                  justifyContent: "center",
                }}
                alt={selectedAgent.nama}
              />
            </div>
          )}
        </div>
        <div className="col-md-4" style={{ marginLeft: "20px" }}>
          {selectedAgent && (
            <div>
              <p>
                Role <br /> {selectedAgent.role}
                <img
                  src={url + selectedAgent.icon}
                  style={{ width: "20px", marginLeft: "4px" }}
                  alt="Role Icon"
                />
              </p>
              <p>
                Biografi <br />
                {selectedAgent.bio}
              </p>
            </div>
          )}
          {selectedAgent && (
            <div style={{ textAlign: "end" }}>
              <Button
                onClick={() => handleShowEditModal(selectedAgent.id)}
                variant="primary"
                style={{ marginRight: "10px" }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(selectedAgent.id)}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama Agent:</label>
              <input
                type="text"
                className="form-control"
                value={editData.nama}
                onChange={(e) => handleEditDataChange("nama", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role Agent:</label>
              <select
                className="form-control"
                value={editData.role}
                onChange={(e) => handleEditDataChange("role", e.target.value)}
              >
                <option value="">Pilih Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Bio Agent:</label>
              <input
                type="text"
                className="form-control"
                value={editData.bio}
                onChange={(e) => handleEditDataChange("bio", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  handleEditDataChange("gambar", e.target.files[0])
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

export default Agent;
