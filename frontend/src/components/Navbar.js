// Dashboard.js

import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

function CustomNavbar() {
  return (
    <Navbar bg="transparent" expand="lg" variant="light">
      <div className="container d-flex justify-content-between">
        <Navbar.Brand href="/">Vlo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav>
            <NavDropdown title="Agent" id="agent-dropdown" alignRight>
              <NavDropdown.Item href="/agent">Agent</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/agent/add">Add</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Roles" id="roles-dropdown" alignRight>
              <NavDropdown.Item href="/roles">Roles</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/roles/add">Add</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Weapon" id="weapon-dropdown" alignRight>
              <NavDropdown.Item href="/weapon/">Weapon</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/weapon/add">Add</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/skin/">Skin</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/skin/add">Add</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
