import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAthletes } from "../../services/coachInfo";
import TimeView from "./TimeView";

export default function UserInfo() {
  const params = useParams()
  const [nombreCompleto, setNombreCompleto] = useState("Cargando...");
  const [tipoUsuario, setTipoUsuario] = useState("Cargando...");
  const [atleta, setAtleta] = useState(null);
  const [viewAllow, setViewAllow] = useState(false);
  // Carga la información del usuario logeado
  // o del atleta al que se accedió su información
  useEffect(async() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // if (params.id === undefined) {
      // No viene con params, se debe mostrar la información del
      // usuario logeado
      setNombreCompleto(userInfo.nombre + " " + userInfo.apellidos);
      setTipoUsuario(userInfo.tipo.toUpperCase());
      setViewAllow(true);
    // }
    // } else {
    //   // Si viene con params, es la información de un atleta a cargo
    //   // de un coach
    //   const infoUser = JSON.parse(localStorage.getItem("userInfo"));
    //   // Se recupera el listado del atletas
    //   const listAthletes = await getAthletes(infoUser.username);
    //   if (listAthletes) {
    //     // Busca una coincidencia
    //     const athlete = listAthletes.find((e) => e.IdUser === params.id);
    //     if (athlete) {
    //       setNombreCompleto(athlete.nombre + " " + athlete.apellidos);
    //       setTipoUsuario(athlete.tipo.toUpperCase());
    //       setAtleta(athlete.IdUser);
    //       setViewAllow(true);
    //     }
    //   } else {
    //     setNombreCompleto(userInfo.nombre + " " + userInfo.apellidos);
    //     setTipoUsuario(userInfo.tipo.toUpperCase());
    //     setViewAllow(true);
    //   }
    // }
  },[])

  // Determina si colocar o no un link en el nombre del usuario
  // Colocará el linke si la propiedad está especificada
  // La propiedad se especificará si se desea visualizar la
  // información de un atleta
  const setLinkToProfile = () => {
    if(atleta) {
      return (
        <Link to={`/athlete/info-user/${atleta}`} className="btn btn-lg btn-outline-dark">
          <span>Ver perfil{" "}<i className="fa fa-eye"></i></span>
        </Link>)
    }
  }

  return (
    <div className="row">
      <div className="col-lg-10 col-xs-12 col-sm-12">
        {
          !viewAllow ? "Cargando..." :
          (<>
            <h1>
              {nombreCompleto} {"  "} 
              {setLinkToProfile()}
            </h1>
            <h6>{tipoUsuario}</h6>
          </>)
        }
      </div>
      <TimeView />
    </div>
  );
}
