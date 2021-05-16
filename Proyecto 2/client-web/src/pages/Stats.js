import axios from 'axios';
import StatTable from 'components/tables/stats/StatTable';
import { urlServer } from 'config';
import React, { useEffect, useState } from 'react';
import { getUser } from 'services/user';

const Stats = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const userInfo = getUser();
    const endpoint = urlServer + `obtener-calorias/${userInfo.IdUser}`;
    axios.get(endpoint)
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
    <div className="row">
      <div className="col-lg-6 col-md-6 col-sm-4 col-xs-12">
        
      </div>
      <div className="col-lg-6 col-md-6 col-sm-8 col-xs-12">
        {data ?
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
            } /> : <div className="loader"></div>}
      </div>
    </div>
  );
}

export default Stats;