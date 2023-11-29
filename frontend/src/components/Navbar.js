import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./Navbar.css";

function CustomNavbar() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("berhasil Logout");
    window.location.reload();
  };
  return (
    <Navbar bg="transparent" expand="lg" variant="light">
      <div className="container d-flex justify-content-between">
        <Navbar.Brand href="/">Vlo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav>
            <NavDropdown
              title="Agent"
              id="agent-dropdown"
              alignRight
              className="transparent-dropdown"
            >
              <NavDropdown.Item href="/agent">Agent</NavDropdown.Item>
              {isLoggedIn && (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/agent/add">Add</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            <NavDropdown
              title="Roles"
              id="agent-dropdown"
              alignRight
              className="transparent-dropdown"
            >
              <NavDropdown.Item href="/roles">Roles</NavDropdown.Item>
              {isLoggedIn && (
                <>
                  {" "}
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/roles/add">Add</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            <NavDropdown
              title="Weapon"
              id="agent-dropdown"
              alignRight
              className="transparent-dropdown"
            >
              <NavDropdown.Item href="/weapon/">Weapon</NavDropdown.Item>
              {isLoggedIn && (
                <>
                  <NavDropdown.Item href="/weapon/add">Add</NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item href="/skin/">Skin</NavDropdown.Item>
              {isLoggedIn && (
                <>
                  <NavDropdown.Item href="/skin/add">Add</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
export default CustomNavbar;
