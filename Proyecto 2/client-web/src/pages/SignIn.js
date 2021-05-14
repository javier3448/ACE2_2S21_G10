import Alert from 'components/alerts/Alert';
import { useAuth } from 'hooks/useAuth';
import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

const SignIn = () => {
  const auth = useAuth();
  /// Hooks para guardar las credenciales
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  /// Hook para mostrar un alerta
  const [alert, setAlert] = useState();
  /// Esta función se pasa al componente
  /// alerta para "esconder" la alerta
  const handleClick = () => {
    setAlert();
  }
  /// Maneja la acción de onSubmit
  /// para el formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await auth.signIn({
      username,
      password
    });
    if (!user) {
      setAlert(
        <Alert 
          title={"No se pudo iniciar sesión"} 
          variant={"danger"}
          message={"Verifique sus credenciales"}
          onStateChange={handleClick}
        />
      )
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
      {alert}
      <form onSubmit={handleSubmit} >
        <div className="row">
          <div className="col my-2">
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
          <div className="col my-2">
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