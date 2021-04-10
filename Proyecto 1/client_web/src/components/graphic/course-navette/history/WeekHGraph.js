import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { urlServer } from '../../../../config';

export default function WeekHGraph(props) {
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);
  const [data, setData] = useState([]);
  useEffect(async () => {
    axios.get(urlServer + `get-fechas-report/${props.idUser}`)
      .then((response) => {
          if(response.data) {
            setMax(response.data.max);
            setMin(response.data.min);
            setAvg(response.data.prom);
            setData(response.data.result.map((value) => {
              return {
                hour: value.hora.split(' ')[1],
                index: 1,
                repeticiones: value.repeticiones
              }
            }));
          }
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  const parseDomain = () => [
    0,
    Math.max(
      Math.max.apply(
        null,
        data.map((entry) => entry.repeticiones),
      ),
    ),
  ];

  const renderTooltip = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;

      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #999',
          margin: 0,
          padding: 10,
        }} >
          <p>{data.hour} hrs</p>
          <p>
            <span>repeticiones: </span>
            {data.repeticiones}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="row">
        <div className="col-4 text-center h4">Max: {max}</div>
        <div className="col-4 text-center h4">Min: {min}</div>
        <div className="col-4 text-center h4">Avg: {avg}</div>
      </div>
      <hr></hr>
      <ResponsiveContainer width="100%" height={60}>
        <ScatterChart
          width={800}
          height={60}
          margin={{
            top: 10,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            type="category"
            dataKey="hour"
            interval={0}
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            name="Sabado"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Sabado', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="repeticiones" range={[0, 225]} domain={parseDomain()} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  )
}