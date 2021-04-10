import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { urlServer } from '../../../../config';

export default function VelHGraph(props) {

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(urlServer + `get-velocity-report/${props.idUser}`)
      .then((response) => {
        if(response.data) {
          setData(response.data.map((value) => {
            return {
              "max":value.max,
              "min":value.min,
              "avg":value.avgvelocidad,
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
    <>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="repeticion" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="max" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="avg" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="min" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}