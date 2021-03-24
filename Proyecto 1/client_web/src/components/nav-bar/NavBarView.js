import React from "react";
import { useAuth } from "../../services/useInfo";

export default function NavBar() {
  const auth = useAuth();
  // Determina si el usuario logeado es un coach
  // Si lo es, pintará el botón de vista de coach
  // Si no lo es, no lo pintará
  const isCoach = () => {
    // Recupera la info del usuario
    const infoUser = JSON.parse(localStorage.getItem("userInfo"));
    // Determina si es o no un coach
    const isCoach = infoUser.tipo.toLowerCase() === "coach";
    if (isCoach) {
      return (
        <a href="/coach" className=" btn btn-outline-light col">
          <i className="fa fa-users"></i>
          <span> Atletas</span>
        </a>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
      <div className="container gap-1 p-2">
        <a href="/dashboard" className="btn btn-outline-light col">
          <i className="fa fa-heartbeat"></i>
          <span> Dashboard</span>
        </a>
        <a href="/info-user" className=" btn btn-outline-light col">
          <i className="fa fa-user"></i>
          <span> Perfil</span>
        </a>
        {isCoach()}
        <button
          className=" btn btn-outline-light col"
          type="button"
          onClick={() => auth.signOut()}
        >
          <i className="fa fa-sign-out-alt"></i>
          <span> Salir</span>
        </button>
      </div>
    </nav>
  );
}
