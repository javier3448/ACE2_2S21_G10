import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { urlServer } from '../../../config';
import CustomToolTip from './CustomToolTip';

const Vo2Max = props => {
  const [data, setData] = useState([
    {
      "vo2max": 40,
      "prueba": 1 + '#2021-04-20 11:20:21'
    },
    {
      "vo2max": 25,
      "prueba": 2 + '#2021-04-20 11:20:22'
    },
    {
      "vo2max": 40,
      "prueba": 3 + '#2021-04-20 11:20:23',
    }
  ]);
  useEffect(() => {
    axios.get(urlServer + `get-all-reports-p2/${props.idUser}`)
      .then((response) => {
        if (response.data) {
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
    return `P.${tick.split('#')[0]}`;
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
          <LineChart width={1000} height={400} data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0, }} >
            <XAxis dataKey="prueba" tickFormatter={pruebaFormatter}  />
            <CartesianGrid strokeDasharray="2 2" />
            <YAxis />
            <Tooltip content={< Vo2MaxTooltip/>} />
            <Legend />
            <Line isAnimationActive={false} type="monotone"
              dataKey="vo2max" name="VO2MAX" stroke="#4040ff" activeDot={{ r: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Vo2Max;