import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useParams } from 'react-router';
import { urlServer } from '../../../config';

const Vo2History = props => {
  const params = useParams();
  // Número de prueba que se visualizará
  const noTest = props.noTest;
  // Información de la prueba
  const [data, setData] = useState([]);

  useEffect( async() => {
    try {
      const response = await axios.get(urlServer + `sensorsv2/${params.id}`);
      if (response.data.length) {
        const dataSet = response.data.find((value) => {
          if (value.prueba === noTest) {
            return value;
          }
        })
        setData(dataSet.result);
      } else {
        alert('sin datos');
      }
    } catch (error) {
      console.error(error);
      alert('no se pudo mostrar los datos');
    }
  }, []);

  const tickFormatter = (tick) => {
    const date = new Date(tick);
    const noPrueba = date.toLocaleTimeString("es-GT", {hour: '2-digit', hour12: false, minute: '2-digit'});
    return `${noPrueba}`;
  }

  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="border rounded border-info bg-light bg-gradient p-1 text-dark">
          <div className="row">
            <div className="col text-center">
              Prueba{" "}
              <span className="badge bg-secondary text-wrap">
                {noTest}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <span className="badge bg-secondary text-wrap">
                {date.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col">Exhalado</div>
            <div className="col">
              <span style={{ backgroundColor: payload[1].color }} className="badge text-wrap">
                {payload[1].value}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col">Inhalado</div>
            <div className="col">
              <span style={{ backgroundColor: payload[0].color }} className="badge text-wrap">
                {payload[0].value}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="card border border-dark">
      <div className="card-header bg-dark text-light text-center ">
        <h4>Prueba No. {noTest}</h4>
      </div>
      <div className="card-body">
        <div className="card-title text-center h5">{props.fecha}</div>
        <ResponsiveContainer id="Vo2History_" width="100%" height={450}>
          <LineChart
            width={1000}
            height={450}
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0
            }}>
            <XAxis dataKey="dateTime" tickFormatter={tickFormatter} scale="band" />
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />
            <Tooltip content={<CustomToolTip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="inhalado"
              name="Inhalado (ml.)"
              stroke="#4e8763" />
            <Line 
              type="monotone"
              dataKey="exhalado"
              name="Exhalado (ml.)"
              stroke="#537b99" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Vo2History;