import React from "react";
import { Link } from "react-router-dom";
import "./Common.css";
const handleLogout = () => {
  // Supprimer le token du localStorage
  localStorage.removeItem('token');
  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = '/authentification?message=Vous%20avez%20été%20déconnecté';
};

const isLoggedIn = localStorage.getItem('token') !== null;
const isNotLoggedIn = localStorage.getItem('token') == null;


export default function Header() {
  return (
    <div>
      <nav className="navbar navbar-expand-sm ">
        <div className="container-fluid">
          <Link to="authentification" className="navbar-brand" href="#">
            {isNotLoggedIn && <span className="navbar-text">Connexion / Inscription</span>}
          </Link>
          {isLoggedIn && <button onClick={handleLogout}>Se déconnecter</button>}
          <div className="collapse navbar-collapse" id="mynavbar">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="show-plante">
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="create-plante">
                  Creer une plante
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="show-my-plante">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
