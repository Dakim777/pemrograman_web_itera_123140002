import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">BUMH</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Produk</Link></li>
        <li><Link to="/cart">Keranjang</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
