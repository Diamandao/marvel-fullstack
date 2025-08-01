// src/components/Header.jsx
import { Link } from "react-router-dom";
import "./Header.css";
import logoMarvel from "../assets/logo-marvel.png";

function Header() {
  return (
    <header style={{ padding: "1rem", background: "#202020", color: "#fff" }}>
      <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <img src={logoMarvel} alt="Marvel" style={{ height: "40px" }} />
        <Link to="/" style={{ color: "white" }}>
          Personnages
        </Link>
        <Link to="/comics" style={{ color: "white" }}>
          Comics
        </Link>
        <Link to="/favorites" style={{ color: "white" }}>
          Favoris
        </Link>
      </nav>
    </header>
  );
}

export default Header;
