import axios from "axios";
import { urlServer } from "config";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const SignUp = () => {
  const history = useHistory();
  /// Datos para crear un nuevo usuario
  const [nombre, setNombre] = useState();
  const [apellidos, setApellido] = useState();
  const [altura, setAltura] = useState();
  const [peso, setPeso] = useState();
  const [username, setUsername] = useState();
  const [password0, setPassword0] = useState();
  const [password1, setPassword1] = useState();
  const [sexo, setSexo] = useState();
  const [edad, setEdad] = useState();
  /// Manejará la acción a realizar cuando
  /// se "suba" el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password0 !== password1) {
      alert("Contraseñas no coinciden");
      return;
    }
    const user = {
      nombre,
      apellidos,
      carnet: "",
      altura,
      peso,
      username,
      password: password0,
      tipo: "atleta",
      sexo,
      edad,
    };
    console.info(user);
    // Solicita al servidor registrar un nuevo usuario
    const endpoint = urlServer + "users";
    axios.post(endpoint, user)
      .then((response) => {
        if (response.status === 200) {
          alert("Usuario creado exitosamente");
          history.push("/signin");
        }
      }).catch(() => {
        alert("No se pudo crear el usuario");
      });
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12 align-center text-center">
          <h3>Crear cuenta</h3>
          ¿Ya tienes cuenta?{" "}
          <Link className="text-dark" to="/signin">
            inicia sesión
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col mb-2">
            <label>Usuario</label>
            <input
              className="form-control shadow-sm"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-2">
            <label>Contraseña</label>
            <input
              className="form-control shadow-sm"
              type="password"
              value={password0}
              onChange={(e) => setPassword0(e.target.value)}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-2">
            <label>Confirme su contraseña</label>
            <input
              className="form-control shadow-sm"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-2">
            <label>Nombre</label>
            <input
              className="form-control shadow-sm"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-2">
            <label>Apellido</label>
            <input
              className="form-control shadow-sm"
              type="text"
              value={apellidos}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2 col-md-3 col-sm-6 col-xs-12 mb-2">
            <label>Edad</label>
            <input
              className="form-control shadow-sm"
              type="number" min="1"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required />
          </div>
          <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12 mb-2">
            <label>Sexo</label>
            <div className="btn-group d-flex" role="group" aria-label="sex-group">
              <input
                type="radio"
                name="radio-sex-group"
                className="btn-check"
                id="btnXX"
                onChange={() => setSexo('F')}
                required
                autoComplete="off" />
              <label className="btn btn-outline-dark shadow-sm" htmlFor="btnXX">Mujer</label>
              <input
                type="radio"
                name="radio-sex-group"
                className="btn-check"
                id="btnXY"
                required
                onChange={() => setSexo('M')}
                autoComplete="off" />
              <label className="btn btn-outline-dark shadow-sm" htmlFor="btnXY">Hombre</label>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
            <label>Peso</label>
            <input
              className="form-control shadow-sm"
              type="number" min="1" step="0.001"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              required />
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
            <label>Altura</label>
            <input
              className="form-control shadow-sm"
              type="number" min="1" step="0.001"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              required />
          </div>
        </div>
        <div className="d-flex justify-content-center mt-2">
          <button type="submit" className="btn btn-outline-dark shadow">
            Registrar usuario
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUp;


