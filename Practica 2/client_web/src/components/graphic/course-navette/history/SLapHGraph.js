import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from "recharts";
import { urlServer } from '../../../../config';

export default function SLapHGraph(props) {
  const [data, setData] = useState([]);
  const [laps, setLaps] = useState(0);
  const [surrender, setSurrender] = useState(0);
  useEffect(() => {

    axios.get(urlServer + `get-giveup-report/${props.idUser}`)
      .then((response) => {
        if(response.data) {
          setSurrender(response.data[0].rindioTotales)
          setLaps(response.data[0].repeticionesTotales);
          setData(response.data[0].result);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="border rounded border-info bg-dark bg-gradient p-1 text-light">
          <div>{label.split(' ')[0] ? label.split(' ')[0] : ""  + ""}</div>
          <div>{label.split(' ')[1] ? label.split(' ')[1] + " hrs": "" }</div>
          <div>Repeticiones<span style={{ backgroundColor: "#107dac" }} className="badge text-wrap">{payload[0].value}</span></div>
          <div>Rendiciones<span style={{backgroundColor:"#ac3f10"}} className="badge text-wrap">{payload[1].value}</span></div>
        </div>
      );
    }
  
    return null;
  };
  

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <h5>
            Repeticiones <span style={{backgroundColor:"#107dac"}} className="badge text-wrap">{laps}</span>
          </h5>
        </div>
        <div className="col text-center">
          <h5>
            Rendiciones <span style={{backgroundColor:"#ac3f10"}} className="badge text-wrap">{surrender}</span>
          </h5>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={265}>
        <BarChart width={1000} height={265} data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0, }}>
          <XAxis dataKey="hora"   hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="repeticiones" fill="#107dac" />
          <Bar dataKey="rindio" fill="#ac3f10" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}