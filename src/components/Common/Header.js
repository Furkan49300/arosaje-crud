import React from "react";
import { Link } from "react-router-dom";
import "./Common.css";
export default function Header() {
  return (
    <div>
      <nav className="navbar navbar-expand-sm ">
        <div className="container-fluid">
          <Link to="authentification" className="navbar-brand" href="#">
            <span className="navbar-text">Connexion / Inscription</span>
          </Link>
          <div className="collapse navbar-collapse" id="mynavbar">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="create-plante">
                  Creer une plante
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="show-plante">
                  Voir mes plantes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
