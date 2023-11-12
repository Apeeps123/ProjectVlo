import React, { useState, useEffect } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoSource from "../Asset/viper3.mp4";
import "../../src/components/Weapon.css";

const url = "http://localhost:3000/static/";

function Skin() {
  const [skinList, setSkinlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/skin");
      const data = response.data.data;
      setSkinlist(data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
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
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Container>
        <Row>
          <div className="gallery">
            {skinList.map((skin, index) => (
              <div className="gallery-item" key={skin.id}>
                <img
                  src={url + skin.gambarSkin}
                  alt={skin.id + "gambarWpn"}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <div>{skin.nama}</div>
                  <div>{skin.skin}</div>
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Skin;
