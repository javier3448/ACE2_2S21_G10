import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getAthletes } from "../../services/coachInfo";
import ErrorView from "../error-page/Error";
import UserInfo from "../nav-bar/UserInfoView";

export default function Profile() {
  const params = useParams();
  const [viewAllow, setViewAllow] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState(0);
  const [sexo, setSexo] = useState('');
  //const [atleta, setAtleta] = useState(null);
  useEffect(async () => {
    const infoUser = JSON.parse(localStorage.getItem("userInfo"));
    if (params.id !== undefined) {
      const listAthletes = await getAthletes(infoUser.username);
      const athlete = listAthletes.find((e) => e.IdUser === params.id);
      if (!athlete) {
        setViewAllow(true);
        setHasAuth(false);
      } else {
        setViewAllow(true);
        setHasAuth(true);
        setPeso(athlete.peso);
        setAltura(athlete.altura);
        setNombre(athlete.nombre);
        setApellido(athlete.apellidos);
        setEdad(athlete.edad ? athlete.edad : '');
        setSexo( athlete.sexo ? (athlete.sexo  === 'M' ? 'Hombre' : 'Mujer') : '');
      }
    } else {
      setViewAllow(true);
      setHasAuth(true);
      setPeso(infoUser.peso);
      setAltura(infoUser.altura);
      setNombre(infoUser.nombre);
      setApellido(infoUser.apellidos);
      setEdad(infoUser.edad ? infoUser.edad : '');
      setSexo(infoUser.sexo ? (infoUser.sexo === 'M' ? 'Hombre' : 'Mujer') : '');
    }
  });
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
          <div className="card card-body">
            <div className="row">
              <div className="from-group col-md-6">
                <label>Nombres</label>
                <input className="form-control" readOnly value={nombre} />
              </div>
              <div className="from-group col-md-6">
                <label>Apellidos</label>
                <input className="form-control" readOnly value={apellido} />
              </div>
            </div>
            <div className="row">
              <div className="from-group col-md-6 col-xs-12">
                <label>Edad</label>
                <input className="form-control" readOnly value={edad} />
              </div>
              <div className="from-group col-md-6 col-xs-12">
                <label>Sexo</label>
                <input className="form-control" readOnly value={sexo} />
              </div>
            </div>
            <div className="row">
              <div className="from-group col-md-6 col-xs-12">
                <label>Peso</label>
                <input
                  className="form-control"
                  readOnly
                  value={peso + " lbs."}
                />
              </div>
              <div className="from-group col-md-6 col-xs-12">
                <label>Estatura</label>
                <input
                  className="form-control"
                  readOnly
                  value={altura + " m."}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
