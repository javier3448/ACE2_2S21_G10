import React, { useEffect, useState } from 'react';
import { AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts'
import axios from 'axios';
import { urlServer } from '../../../config';
import CustomToolTip from './CustomToolTip';

const Inhaled = props => {
  const [data, setData] = useState([
    {
      "max": 40,
      "min": 25,
      "avg": 32.5,
      "prueba": 1 + '#2021-04-20 11:20:21'
    },
    {
      "max": 25,
      "min": 10,
      "avg": 12.5,
      "prueba": 2 + '#2021-04-20 11:20:22'
    },
    {
      "max": 40,
      "min": 25,
      "avg": 32.5,
      "prueba": 3 + '#2021-04-20 11:20:23',
    }
  ]);

  useEffect(() => {
    axios.get(urlServer + `get-all-reports-p2/${props.idUser}`)
      .then((response) => {
        if (response.data) {
          setData(response.data.map((value) => {
            return {
              "max": value.maxInhalado,
              "min": value.minInhalado,
              "avg": value.avgInhalado,
              "prueba": value.prueba + '#' + value.dateTime,
            }
          }));
        }
      }).catch(() => alert('no se pudo recuperar la información'))
  }, []);

  const pruebaFormatter = (tick) => {
    return `P.${tick.split('#')[0]}`;
  }

  return (
    <div className="card border-dark">
      <div className="card-header bg-dark text-light text-center h4">Oxígeno inhalado</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="prueba" tickFormatter={pruebaFormatter} />
            <YAxis />
            <Tooltip content={<CustomToolTip />} />
            <Legend />
            <Area type="monotone" dataKey="min" stackId="1" name="Mínimo (ml.)" stroke="#ffc107" fill="#ffc107" />
            <Area type="monotone" dataKey="avg" stackId="1" name="Promedio (ml.)" stroke="#198754" fill="#198754" />
            <Area type="monotone" dataKey="max" stackId="1" name="Máximo (ml.)" stroke="#fd7e14" fill="#fd7e14" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Inhaled;