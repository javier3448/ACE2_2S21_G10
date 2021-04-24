import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useParams } from 'react-router';
import { urlServer } from '../../../config';
import { useInterval } from '../../../services/interval';

const Vo2RealTime = () => {
  const params = useParams();
  // Temporizador de la prueba
  const [milis, setMilis] = useState('00:00:00');
  // Información de la prueba
  const [data, setData] = useState([]);
  // Fecha de creación de la información
  // Aquí se almacena la fecha inicial de la prueba
  const [fecha, setFecha] = useState('');
  const [noTest, setNoTest] = useState('');
  // Determina la fecha de la prueba
  useEffect(async () => {
    try {
      const response = await axios.get(urlServer + `sensorsv2/${params.id}`);
      if (response.data.length) {
        const dataSet = response.data;
        const lastData = dataSet[dataSet.length - 1];
        if (lastData.result.length) {
          setFecha(new Date(lastData.result[0].dateTime));
          setNoTest(lastData.prueba);
        }
      } else {
        alert('sin datos')
      }
    } catch (err) {
      console.error(err);
      alert('no se pudo recuperar los datos');
    }
  }, []);
  // Recupera constantemente el último dato
  // y se únicamente se visualizará en la 
  // gráfica si la fecha inicial es de hace no más 
  // de 5 min 2 seg 500 milisegundos
  useInterval(() => {
    axios.get(urlServer + `sensorsv2/${params.id}`)
      .then((response) => {
        if (response.data.length) {
          const dataSet = response.data;
          let lastData = dataSet[dataSet.length - 1];
          if (lastData.result.length) {
            lastData = lastData.result.map(value => {
              return {
                "volumen": value.volumen ? value.volumen : 0,
                "dateTime": value.dateTime
              }
            });
            setData(lastData);
            /// Actualiza el contador usando el tiempo del servidor
            /// Recupera el último dato
            const actualTime = new Date(lastData[lastData.length - 1].dateTime).getTime();
            const deltaMilis = actualTime - fecha;
            const milis = Math.floor((deltaMilis % 1000) / 100);
            const secs = Math.floor((deltaMilis / 1000) % 60);
            const minutes = Math.floor((deltaMilis / (1000 * 60)) % 60);
            setMilis(`${minutes >= 10 ? minutes : "0" + minutes}:${secs >= 10 ? secs : "0" + secs}:${milis >= 10 ? milis : "0" + milis}`);
          }
        }
      })
      .catch(error => console.error(error));
  }, 800);

  const tickFormatter = (tick) => {
    const date = new Date(tick);
    const noPrueba = date.toLocaleTimeString("es-GT", { hour: '2-digit', hour12: false, minute: '2-digit' });
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
            <div className="col">Volumen</div>
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
        <h4>Prueba No. {noTest ? noTest : ''} (Actual)</h4>
      </div>
      <div className="card-body">
        <div className="card-title text-center h5">{milis}</div>
        <ResponsiveContainer id="Vo2Realtime_" width="100%" height={450}>
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
            <XAxis dataKey="dateTime" tickFormatter={tickFormatter} />
            <CartesianGrid strokeDasharray="2 2" />
            <YAxis />
            <Tooltip content={<CustomToolTip />} />
            <Legend />
            <Line isAnimationActive={false}
              type="monotone"
              dataKey="volumen"
              name="Volumen (lt.)"
              stroke="#4e8763" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Vo2RealTime;
