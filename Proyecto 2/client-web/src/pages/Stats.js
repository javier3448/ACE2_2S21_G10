import axios from 'axios';
import HeartBeat from 'components/cards/stats/HeartBeat';
import Oxygen from 'components/cards/stats/Oxygen';
import Temperature from 'components/cards/stats/Temperature';
import Loader from 'components/loader/Loader';
import StatTable from 'components/tables/stats/StatTable';
import { urlServer } from 'config';
import React, { useEffect, useState } from 'react';
import { getUser } from 'services/user';

const Stats = () => {
  const [data, setData] = useState([]);
  /// Recupera el dato de las calorías
  useEffect(() => {
    const userInfo = getUser();
    axios.get(urlServer + `obtener-calorias/${userInfo.IdUser}`)
      .then((response) => {
        if (response.data.length) {
          console.info(response.data);
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
      <div className="col-lg-3 col-md-5 col-sm-12 col-xs-12">
        <Oxygen />
        <HeartBeat />
        <Temperature />
      </div>
      <div className="col-lg-9 col-md-7 col-sm-12 col-xs-12 ">
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
    </div>
  );
}

export default Stats;