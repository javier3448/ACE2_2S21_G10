import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { urlServer } from '../../../config';

const Vo2Max = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(urlServer + `get-all-reports-p2/${params.id}`)
      .then((response) => {
        if (response.data.length) {
          setData(response.data.map((value) => {
            return {
              "vo2max": value.vo2max,
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

  const Vo2MaxTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      console.log(payload);
      const label = payload[0].payload.prueba;
      const date = new Date(label.split('#')[1]);
      return (
        <div className="border roundedb border-info bg-dark bg-gradient text-light p-1">
          <div className="row">
            <div className="col">Prueba</div>
            <div className="col text-end">
              <span className="badge text-wrap bg-secondary">
                {label.split('#')[0]}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col">Fecha</div>
            <div className="col text-end">
              <span className="badge text-wrap bg-secondary">
                {date.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col">Hora</div>
            <div className="col text-end">
              <span className="badge text-wrap bg-secondary">
                {date.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col">Vo2Max</div>
            <div className="col text-end">
              <span style={{ backgroundColor: payload[0].color }} className="badge text-wrap">
                {payload[0].value}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null;
  }

  return (
    <div className="card border-dark">
      <div className="card-header bg-dark text-light text-center h4">Vo2Max</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart width={1000} height={400} data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0, }} >
            <XAxis dataKey="prueba" tickFormatter={pruebaFormatter}  />
            <CartesianGrid strokeDasharray="2 2" />
            <YAxis />
            <Tooltip content={< Vo2MaxTooltip/>} />
            <Legend />
            <Bar type="monotone"
              dataKey="vo2max" name="VO2MAX" fill="#4491d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Vo2Max;