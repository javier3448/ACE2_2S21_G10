import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlServer } from '../../../../config';
import {
  CartesianGrid,
  Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from "recharts";

export default function DistanceHGraph(props) {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(urlServer + `get-distance-report/${props.idUser}`)
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart width={1000} height={400} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
        <XAxis dataKey="repeticion" />
        <CartesianGrid strokeDasharray="2 2" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line isAnimationActive={false} type="monotone"
          dataKey="distancia" stroke="#FF0000" activeDot={{ r: 1 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}