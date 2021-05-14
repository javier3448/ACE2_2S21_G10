import { useAuth } from 'hooks/useAuth';
import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

const SignIn = () => {
  const auth = useAuth();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  /// Maneja la acción de onSubmit
  /// para el formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await auth.signIn({
      username,
      password
    });
    if (!user) {
      alert('no se pudo iniciar sesión. Verifique sus credenciales')
    } else {
      <Redirect to='/dashboard' />
    }
  }
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <h3>Iniciar sesión</h3>
              ¿No tienes cuenta?{" "}
          <Link className="text-dark" to="/signup">
            crea una
            </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} >
        <div className="row">
          <div className="col">
            <label htmlFor="username"></label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              value={username}
              className="form-control shadow-sm"
              id="username"
              name="username"
              required
              placeholder="Usuario"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label htmlFor="password"></label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              className="form-control shadow-sm"
              id="password"
              name="password"
              required
              placeholder="Contraseña"
            />
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-outline-dark shadow">
            Iniciar sesión
          </button>
        </div>
      </form>
    </>
  );
}


export default SignIn;