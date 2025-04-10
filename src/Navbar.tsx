import React from "react";
import "./Navbar.css";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="src/logo.png" alt="RxReader Logo" className="logo" />
        <div className="navbar-logo">RxReader</div>
      </div>
      <ul className="navbar-links">
        <li>Home</li>
        <li>Product</li>
        <li>About</li>
        <li>Contact</li>
        <li className="navbar-search"></li>
      </ul>
    </nav>
  );
};

export default NavBar;
