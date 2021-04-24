import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { urlServer } from '../../../config';
import CustomToolTip from './CustomToolTip';

const Inhaled = () => {
  const params = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(urlServer + `get-all-reports-p2/${params.id}`)
      .then((response) => {
        console.log(response);
        if (response.data.length) {
          setData(response.data.map((value) => {
            return {
              "max": value.maxInhalado,
              "min": value.minInhalado,
              "avg": value.avgInhalado,
              "prueba": value.prueba + '#' + value.dateTime,
            }
          }));
          console.log(data);
        }
      }).catch((error) =>{ alert('no se pudo recuperar la información'); console.error(error);})
  }, []);

  const pruebaFormatter = (tick) => {
    const noPrueba = tick.toString().split('#')[0];
    return `P.${noPrueba}`;
  }

  return (
    <div className="card border-dark">
      <div className="card-header bg-dark text-light text-center h4">Oxígeno inhalado</div>
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
            <CartesianGrid strokeDasharray="2 2" stroke="#a19f9e" />
            <XAxis dataKey="prueba" tickFormatter={pruebaFormatter} scale="band" />
            <YAxis />
            <Tooltip content={<CustomToolTip />} />
            <Legend />
            <Bar type="linear" dataKey="min" name="Mínimo (ml.)"  fill="#88ebad" />
            <Bar type="linear" dataKey="avg" name="Promedio (ml.)"  fill="#50d280" />
            <Bar type="linear" dataKey="max" name="Máximo (ml.)"  fill="#6bb988" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Inhaled;