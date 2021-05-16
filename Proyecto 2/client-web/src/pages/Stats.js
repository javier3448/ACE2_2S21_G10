import axios from 'axios';
import Alert from 'components/alerts/Alert';
import HeartBeat from 'components/cards/stats/HeartBeat';
import Oxygen from 'components/cards/stats/Oxygen';
import Temperature from 'components/cards/stats/Temperature';
import Loader from 'components/loader/Loader';
import StatTable from 'components/tables/stats/StatTable';
import { urlServer } from 'config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from 'services/user';

const Stats = () => {
  const [data, setData] = useState([]);
  /// Hook para mostrar un alerta
  const [alert, setAlert] = useState(
    <Alert
      onStateChange={() => { setAlert() }}
      title="¿Cómo funciona?"
      variant="info"
      message={<ul className="m-0 fs-6">
        <li>Selecciona una fila de la tabla</li>
        <li>Visualiza las estadística para ese entrenamiento en las tarjetas</li>
        <li>Limpia la selección presionando <strong>Deshacer selección</strong></li>
      </ul>}
    />
  );
  /// Recupera el dato de las calorías
  useEffect(() => {
    const userInfo = getUser();
    axios.get(urlServer + `obtener-calorias/${userInfo.IdUser}`)
      .then((response) => {
        if (response.data.length) {
          const dataMap = response.data.map((value) => {
            const arrCal = value.arrayCaloriasPorSegundo;
            return {
              lap: arrCal[0].repeticion,
              totalCal: value.calperminute,
            };
          });
          setData(dataMap);
        }
      })
      .catch((e) => console.error(e));

  }, []);

  return (
    <div className="row mb-2">
      <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12">
        <div className="card mb-2">
          <div className="card-body">
            {alert}
            <div className="d-grid gap-2">
              <Link to="/stats" className="btn btn-outline-dark">
                <i className="fa fa-undo"></i>{' '}
                Deshacer selección
              </Link>
            </div>
          </div>
        </div>
        {data.length ?
          <StatTable
            data={data}
            columns={
              [
                {
                  Header: 'Entrenamiento No.',
                  accessor: 'lap'
                },
                {
                  Header: 'Calorías quemadas',
                  accessor: 'totalCal'
                }
              ]
            } /> : <Loader />}

      </div>
      <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12 ">
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <Oxygen />
          </div>
          <div className="col-lg-6 col-md-12">
            <HeartBeat />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <Temperature />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;