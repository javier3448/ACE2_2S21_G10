import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import { urlServer } from '../../../../config';

export default function VelHGraph(props) {

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(urlServer + `get-velocity-report/${props.idUser}`)
      .then((response) => {
        if (response.data) {
          setData(response.data.map((value) => {
            return {
              "max": value.max,
              "min": value.min,
              "avg": value.avgvelocidad,
              "repeticion": value.repeticion
            }
          }))
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="repeticion" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="min" stackId="1" stroke="#ffc107" fill="#ffc107" />
        <Area type="monotone" dataKey="avg" stackId="1" stroke="#198754" fill="#198754" />
        <Area type="monotone" dataKey="max" stackId="1" stroke="#fd7e14" fill="#fd7e14" />
      </AreaChart>
    </ResponsiveContainer>
  );
}