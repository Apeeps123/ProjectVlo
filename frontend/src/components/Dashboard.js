import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import videoSource from "../Asset/vlo.mp4";

function Dashboard() {
  return (
    <Container fluid className="video-container">
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
      </video>
    </Container>
  );
}

export default Dashboard;
