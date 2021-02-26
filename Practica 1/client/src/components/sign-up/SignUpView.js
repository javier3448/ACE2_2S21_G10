import axios from "axios";
import React from "react";
import { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { urlServer } from "../../config";
import { useAuth } from "../../services/useInfo";
import TimeView from "../nav-bar/TimeView";

export default function SignUp() {
  const history = useHistory();
  const auth = useAuth();
  const { state } = useLocation();
  /// Hooks para constatemente actualizar
  /// los campos del usuario
  const [nombre, setNombre] = useState();
  const [apellidos, setApellido] = useState();
  const [altura, setAltura] = useState();
  const [peso, setPeso] = useState();
  const [carnet, setCarnet] = useState();
  const [username, setUsernamne] = useState();
  const [password0, setPassword0] = useState();
  const [password1, setPassword1] = useState();
  const [tipo, setTipo] = useState();
  const [asignacion, setAsignacion] = useState();
  const [sexo, setSexo] = useState();
  const [edad, setEdad] = useState();
  const [coacHTML, setCoach] = useState();
  const [isDisabled, setDisabled] = useState(true);
  /// Solicita al servidor crear un nuevo usuario
  /// Si el servidor devuelve un OK redirigirá a singin
  /// Si el servidor no devuelve un OK, mostrará una alerta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password0 !== password1) {
      alert('Contraseñas no coinciden');
      return;
    }
    const user = {
      nombre,
      apellidos,
      carnet,
      altura,
      peso,
      username,
      password: password0,
      tipo,
      asignacion,
      sexo,
      edad,
    };
    /// Solicita al servidor registrar un nuevo usuario
    const response = await axios.post(urlServer + `users`, user);
    console.log(response)
    if (response.status === 200) {
      /// El servidor está OK
      alert('Usuario creado exitosamente');
      history.push('/signin');
    } else {
      /// El servidor no está OK
      alert('Nose pudo crear el usuario')
    }
  };

  const onChangeValue = (e) => {
    switch (e.target.id) {
      case "btnAtleta":
        setTipo("atleta");
        setCoach(
          <option key="nullValue" value="none">
            Cargando...
          </option>
        );
        axios.get(urlServer + `users/get-atletas`)
          .then((response) => {
            if (response.status === 200) {
              const data = response.data;
              /// Verifica que el servidor haya respondido algo
              /// luego que la respuesta sea un arreglo
              /// y que contenga al menos un elemento
              if (data !== null) {
                if (typeof data == typeof []) {
                  if (data.length > 0) {
                    setCoach(
                      <>
                        {data.map((item) => {
                          return (
                            <option
                              key={item.IdUser.substring(0, 8)}
                              value={item.username}
                            >{`${item.nombre} ${item.apellidos}`}</option>
                          );
                        })}
                      </>
                    );
                    setDisabled(false);
                    return;
                  }
                }
              }
              setCoach();
            }
          })
          .catch((err) => console.log(err));
        setCoach("");
        setDisabled(true);
        break;
      case "btnCoach":
        setTipo("coach");
        setDisabled(true);
        setCoach();
        setAsignacion("");
        break;
      case "btnXX":
        setSexo("F");
        break;
      case "btnXY":
        setSexo("M");
        break;
    }
  };

  /// Si hay un usuario logeado,
  /// se dirigirá al dashboard
  if (auth.user === true) {
    return <Redirect to={state?.from || "/"} />;
  }

  return (
    <div className="container vh-100">
      <div className="row align-items-center h-100">
        <form
          className="col border border-info rounded"
          onSubmit={handleSubmit}
        >
          <div className="row mt-4">
            <span className="col-lg-2 col-xs-0 col-sm-0"></span>
            <h3 className="col-lg-8 col-xs-12 col-sm-12 text-center">
              Registrar usuario
            </h3>
            <TimeView />
          </div>
          <div className="row">
            <div className="col">
              <label className="form-label">Rol</label>
              <div className="input-grop mb-3">
                <div className="btn-group d-flex" role="group" aria-label="Rol">
                  <input
                    type="radio"
                    className="btn-check"
                    name="rol"
                    id="btnAtleta"
                    onChange={onChangeValue}
                    value="atleta"
                    required
                    autoComplete="off"
                  />
                  <label className="btn btn-outline-dark" htmlFor="btnAtleta">
                    <span className="text-center">Atleta</span>
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="rol"
                    id="btnCoach"
                    onChange={onChangeValue}
                    value="coach"
                    autoComplete="off"
                  />
                  <label className="btn btn-outline-dark" htmlFor="btnCoach">
                    <span className="text-center">Coach</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtCarne" className="form-label">
                No. Carnet
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconCarne">
                  <i className="fa fa-id-card"></i>
                </span>
                <input
                  id="txtCarne"
                  required
                  type="number"
                  onChange={(e) => setCarnet(parseInt(e.target.value))}
                  className="form-control"
                  placeholder="200000000"
                  aria-label="No. Carnet"
                  aria-describedby="IconCarne"
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtNombre" className="form-label">
                Nombre
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconNombre">
                  <i className="fa fa-id-card"></i>
                </span>
                <input
                  id="txtNombre"
                  required
                  type="text"
                  onChange={(e) => setNombre(e.target.value)}
                  className="form-control"
                  placeholder="Juan"
                  aria-label="Nombre"
                  aria-describedby="IconNombre"
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtApellido" className="form-label">
                Apellidos
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconApellido">
                  <i className="fa fa-id-card"></i>
                </span>
                <input
                  id="txtApellido"
                  required
                  type="text"
                  onChange={(e) => setApellido(e.target.value)}
                  className="form-control"
                  placeholder="Pérez"
                  aria-label="Apellido"
                  aria-describedby="IconApellido"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtUsuario" className="form-label">
                Usuario
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconUsuario">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  id="txtUsuario"
                  required
                  type="text"
                  onChange={(e) => setUsernamne(e.target.value)}
                  className="form-control"
                  placeholder="juanPerez01"
                  aria-label="Usuario"
                  aria-describedby="IconUsuario"
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtPassword0" className="form-label">
                Contraseña
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconPassword0">
                  <i className="fa fa-asterisk"></i>
                </span>
                <input
                  id="txtPassword0"
                  required
                  type="password"
                  onChange={(e) => setPassword0(e.target.value)}
                  className="form-control"
                  aria-label="Contraseña"
                  aria-describedby="IconPassword0"
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <label htmlFor="txtPassword1" className="form-label">
                Confirme contraseña
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconPassword1">
                  <i className="fa fa-asterisk"></i>
                </span>
                <input
                  id="txtPassword1"
                  required
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword1(e.target.value)}
                  aria-label="Confirme contraseña"
                  aria-describedby="IconPassword1"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <label htmlFor="txtFechaNacimiento" className="form-label">
                Edad
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconNacimiento">
                  <i className="fa fa-calendar-alt"></i>
                </span>
                <input
                  id="txtFechaNacimiento"
                  required
                  type="number"
                  min="0"
                  step="0"
                  onChange={(e) => setEdad(parseInt(e.target.value))}
                  className="form-control"
                  aria-label="Fecha nacimiento"
                  aria-describedby="IconNacimiento"
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <label className="form-label">Sexo</label>
              <div className="input-grop mb-3">
                <div
                  className="btn-group d-flex"
                  role="group"
                  aria-label="Sexo"
                >
                  <input
                    type="radio"
                    className="btn-check"
                    onChange={onChangeValue}
                    value="F"
                    name="sex"
                    id="btnXX"
                    required
                    autoComplete="off"
                  />
                  <label className="btn btn-outline-dark" htmlFor="btnXX">
                    <span className="text-center">Mujer</span>
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    onChange={onChangeValue}
                    value="M"
                    name="sex"
                    id="btnXY"
                    autoComplete="off"
                  />
                  <label className="btn btn-outline-dark" htmlFor="btnXY">
                    <span className="text-center">Hombre</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <label htmlFor="txtPeso" className="form-label">
                Peso (lbs.)
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconPeso">
                  <i className="fa fa-weight"></i>
                </span>
                <input
                  id="txtPeso"
                  required
                  type="number"
                  min="0"
                  onChange={(e) => setPeso(parseFloat(e.target.value))}
                  step="any"
                  className="form-control"
                  aria-label="Peso (lbs.)"
                  aria-describedby="IconPeso"
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <label htmlFor="txtAltura" className="form-label">
                Altura (mts.)
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text" id="IconAltura">
                  <i className="fa fa-ruler-vertical"></i>
                </span>
                <input
                  id="txtAltura"
                  required
                  type="number"
                  min="0"
                  onChange={(e) => setAltura(parseFloat(e.target.value))}
                  step="any"
                  className="form-control"
                  aria-label="Altura (mts.)"
                  aria-describedby="IconAltura"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label className="form-label">Coach disponibles</label>
              <br />
              <select
                required={!isDisabled}
                onChange={(e) => setAsignacion(e.target.value)}
                className="form-select"
                size="3"
                disabled={isDisabled}
                aria-label="Lista de entrenadores"
              >
                {coacHTML}
              </select>
            </div>
          </div>
          <div className="d-grip gap-2 my-2">
            <button type="submit" className="btn btn-outline-primary">
              Registrar usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
