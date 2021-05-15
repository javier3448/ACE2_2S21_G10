import { useInterval } from 'hooks/useInterval';
import React, { useState, useEffect } from 'react';

const InfoUser = () => {
  const [user, setUser] = useState('');
  const [date, setDate] = useState('Cargando...');
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo.nombre + " " + userInfo.apellidos);
  }, []);

  useInterval(() => {
    const date = new Date();
    const str = date.toLocaleString('en-US', { timeZone: 'America/Guatemala' });
    setDate(str);
  }, 1000);

  return (
    <div className="text-center">
      <h4>{user}</h4>
      <span className="badge rounded-pill bg-dark">
        {date}
      </span>
    </div>
  );
}

export default InfoUser;