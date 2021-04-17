import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAthletes } from "../../services/coachInfo";
import ErrorView from "../error-page/Error";
import UserInfo from "../nav-bar/UserInfoView";
import CardTest from "./CardTest";

export default function Dashboard() {
  const params = useParams();
  // Indica si ya se puede mostrar la vista
  const [viewAllow, seViewAllowed] = useState(false);
  // Indica si tiene permiso para renderizar al vista
  const [hasAuth, setHasAuth] = useState(false);
  // Almacena el id del athleta que existe en params
  const [atleta, setAtleta] = useState(JSON.parse(localStorage.getItem('userInfo')).IdUser);
  // Verifica si existen params, si sí existen quiere decir 
  // que se redirigió para mostrar la información de un atleta
  // Se debe establecer si el usuario logeado es un coach
  // Si es coach, se debe establecer que el usuario esté
  // asignado al coach logeado
  // Si no es coach, se deberá mostrar error 401
  useEffect(async () => {
    // Se recuperan la información del usuario
    const infoUser = JSON.parse(localStorage.getItem("userInfo"));
    if (params.id !== undefined) {
      // Existen params
      // Se recupera el listado del atletas
      const listAthletes = await getAthletes(infoUser.username);
      // Busca una coincidencia
      const athlete = listAthletes.find((e) => e.IdUser === params.id);
      if (!athlete) {
        // Si no existe coincidencia, el coach no tiene permiso
        // para ver la información de ese atleta en particular
        seViewAllowed(true);
        setHasAuth(false);
      } else {
        seViewAllowed(true);
        setHasAuth(true);
        setAtleta(athlete.IdUser);
      }
      // Existe coincidencia, el coach tiene permiso
      // para ver la información de este atleta
    } else {
      seViewAllowed(true);
      setHasAuth(true);
    }
  }, []);

  return !viewAllow ? (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">          
          <div className="row">
            <div className="col">
              <h1>Cargando...</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : !hasAuth ? (
    <ErrorView data={{ error: "401 - No autorizado" }} />
  ) : (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <hr />
          <div className="row my-2">
            <div className="col-lg-3 col-md-12 my-3">
              <CardTest key={"stats/heart"} data={{
                testName: "Ritmo cardiaco",
                textIcon: "fa-heartbeat",
                link: `heart/${atleta}`
              }} />
            </div>
            <div className="col-lg-3 col-md-12 my-3">
              <CardTest key={"stats/oxygen"} data={{
                testName: "Nivel de oxígeno",
                textIcon: "fa-lungs",
                link: `oxygen/${atleta}`
              }} />
            </div>
            <div className="col-lg-3 col-md-12 my-3">
              <CardTest key={"stats/temp"} data={{
                testName: "Temperatura corporal",
                textIcon: "fa-thermometer-empty",
                link: `temp/${atleta}`
              }} />
            </div>
            <div className="col-lg-3 col-md-12 my-3">
              <CardTest key={"stats/temp"} data={{
                testName: "Test Course-Navette",
                textIcon: "fa-running",
                link: `course-navette/${atleta}`
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
