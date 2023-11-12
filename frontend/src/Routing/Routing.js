import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Agent from "../pages/agent";
import AddAgent from "../pages/AddAgent";
import CustomNavbar from "../components/Navbar";
import Dashbord from "../components/Dashboard";
import AddRoles from "../pages/AddRoles";
import Roles from "../pages/Roles";
import Weapon from "../pages/Weapon";
import AddWeapon from "../pages/AddWeapon";
import Skins from "../pages/Skins";
import AddSkin from "../pages/AddSkin";
import Skin from "../pages/skin";

function Routing() {
  return (
    <Router>
      <div>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Dashbord />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/agent/add" element={<AddAgent />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/add" element={<AddRoles />} />
          <Route path="/weapon" element={<Weapon />} />
          <Route path="/weapon/add" element={<AddWeapon />} />
          <Route path="/skin/detail/:nama" element={<Skins />} />
          <Route path="/skin/add" element={<AddSkin />} />
          <Route path="/skin" element={<Skin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Routing;
