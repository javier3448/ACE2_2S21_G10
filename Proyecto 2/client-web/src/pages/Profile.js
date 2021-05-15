import InfoUser from 'components/info-user/InfoUser';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const Profile = () => {
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState(0);
  const [sexo, setSexo] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const infoUser = JSON.parse(localStorage.getItem('userInfo'));
    setPeso(infoUser.peso);
    setAltura(infoUser.altura);
    setNombre(infoUser.nombre);
    setApellido(infoUser.apellidos);
    setUsername(infoUser.username);
    setEdad(infoUser.edad);
    setSexo(infoUser.sexo === "M" ? "Hombre" : "Mujer");
  }, []);

  return (
    <div className="pt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>
          Perfil
        </h1>
        <InfoUser />
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row">
            <div className="col mb-2">
              <label>Usuario</label>
              <input className="form-control" readOnly value={username} />
            </div>
            <div className="col mb-2">
              <label>Nombre</label>
              <input className="form-control" readOnly value={nombre} />
            </div>
            <div className="col mb-2">
              <label>Apellido</label>
              <input className="form-control" readOnly value={apellido} />
            </div>
          </div>
          <div className="row">
            <div className="col mb-2">
              <label>Edad</label>
              <input className="form-control" readOnly value={edad} />
            </div>
            <div className="col mb-2">
              <label>Sexo</label>
              <input className="form-control" readOnly value={sexo} />
            </div>
            <div className="col mb-2">
              <label>Altura</label>
              <input className="form-control" readOnly value={altura + ' m.'} />
            </div>
            <div className="col mb-2">
              <label>Peso</label>
              <input className="form-control" readOnly value={peso +' kg.'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;