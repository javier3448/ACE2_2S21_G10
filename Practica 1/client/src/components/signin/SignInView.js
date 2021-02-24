import React, { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../../services/useInfo";
import TimeView from "../nav-bar/TimeView";

export default function SignIn() {
  // Sirve para acceder a la función signIn de useInfo
  const auth = useAuth();
  const {state} = useLocation();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [alert, setAlert] = useState();

  /**
   * Solicita al servidor la autenticación del usuario
   * Si el usuario existe, almacena su información en localStorage
   * Si no existe informa, muestra una alerta indicando que las credenciales son erróneas
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoUser = await auth.signIn({
      username,
      password,
    });
    if (!infoUser) {
      // Coloca una alerta indicando que las credenciales no funcionan
      setAlert(
        <div className="row">
          <div className="col">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" >
              <strong>No se pudo iniciar sesión</strong>{" "}
              Verifique sus credenciales
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={setAlert()}
              ></button>
            </div>
          </div>
        </div>
      );
    } else {
      // Redirige la navegación al dashboard
      <Redirect to='/dashboard' />
    }
  };

  if (auth.user === true) {
    return <Redirect to={state?.from || '/'} />
  }

  return (
    <div className="container vh-100">
      <div className="row align-items-center h-100">
        <div className="col-1"></div>
        <form
          className="col-10 border border-info rounded"
          onSubmit={handleSubmit}
        >
          <div className="row mt-4">
            <span className="col-lg-2 col-xs-0 col-sm-0"></span>
            <h3 className="col-lg-8 col-xs-12 col-sm-12 text-center">
              Iniciar sesión
            </h3>
            <TimeView />
          </div>
          {alert}
          <div className="form-group">
            <label htmlFor="username"></label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="form-control"
              id="username"
              name="username"
              required
              placeholder="Usuario"
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="password"></label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              id="password"
              name="password"
              required
              placeholder="Contraseña"
            ></input>
          </div>
          <div className="d-grid gap-2 my-4">
            <button type="submit" className="btn btn-outline-primary">
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}