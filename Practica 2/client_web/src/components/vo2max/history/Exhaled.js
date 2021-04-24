import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { urlServer } from '../../../config';
import CustomToolTip from './CustomToolTip';

const Exhaled = () => {
  const params = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(urlServer + `get-all-reports-p2/${params.id}`)
      .then((response) => {
        if (response.data.length) {
          setData(response.data.map((value) => {
            return {
              "max": value.maxExhalado,
              "min": value.minExhalado,
              "avg": value.avgExhalado,
              "prueba": value.prueba + '#' + value.dateTime,
            }
          }));
        }
      }).catch(() => alert('no se pudo recuperar la información'))
  }, []);

  const pruebaFormatter = (tick) => {
    const noPrueba = tick.toString().split('#')[0];
    return `P.${noPrueba}`;
  }

  return (
    <div className="card border-dark">
      <div className="card-header bg-dark text-light text-center h4">Oxígeno exhalado</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
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
            <Bar type="monotone" dataKey="min" name="Mínimo (ml.)"  fill="#8bcdff" />
            <Bar type="monotone" dataKey="avg" name="Promedio (ml.)"  fill="#4fa5e6" />
            <Bar type="monotone" dataKey="max" name="Máximo (ml.)" fill="#6fa4cc" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Exhaled;