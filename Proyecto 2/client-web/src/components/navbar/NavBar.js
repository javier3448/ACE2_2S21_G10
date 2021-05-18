import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

const NavBar = () => {
  const auth = useAuth();

  return (
    <nav className="navbar border-bottom navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          WristSmart
        </Link>
        <button
          className="navbar-toggler" type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                type="button"
                id="toDashboard" to="/dashboard"
                className="nav-link" aria-current="page">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                type="button"
                id="toProfile" to="/profile"
                className="nav-link">
                Perfil
              </NavLink>
            </li>
          </ul>
          <div className="d-flex">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => auth.signOut()}>
              <i className="fa fa-sign-out-alt"></i>{" "}
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;