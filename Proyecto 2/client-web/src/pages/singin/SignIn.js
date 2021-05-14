import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import '../auth.css';
import About from 'components/About';

const SignIn = () => {
  const auth = useAuth();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
  }
  return (
    <div className="border rounded shadow-lg bg-mesh">
      <div className="d-flex bd-highlight align-items-center">
        <div className="p-2 w-75 bd-highlight">
          <About />
        </div>
        <div className="p-2 bd-highlight px-4">
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
            <div className="mb-2">
              <label htmlFor="username"></label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="form-control"
                id="username"
                name="username"
                required
                placeholder="Usuario"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password"></label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                className="form-control"
                id="password"
                name="password"
                required
                placeholder="Contraseña"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default SignIn;