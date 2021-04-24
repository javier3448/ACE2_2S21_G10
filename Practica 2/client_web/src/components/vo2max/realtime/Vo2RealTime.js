import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useParams } from 'react-router';
import { urlServer } from '../../../config';

const Vo2RealTime = props => {
  const params = useParams();
  // Número de prueba que se visualizará
  const noTest = props.noTest;
  // Información de la prueba
  const [data, setData] = useState([]);
  // Fecha de creación de la información
  const [fecha, setFecha] = useState();

  useEffect(() => {
    axios.get(urlServer + `sensorsv2/${params.id}`)
      .then((response) => {
        return;
        if (response.data.length) {
          setData(response.data.find(value => {
            if (value.prueba === noTest) {
              return value.result;
            }
          }));
          if (data.length > 0) {
            setFecha(new Date(data[0].dateTime).toLocaleDateString());
          }
        } else {
          alert('sin datos')
        }
      })
      .catch(() => alert('no se pudo recuperar los datos'));
  }, []);

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
            <div className="col">
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
    <div className="card">
      <div className="card-header bg-dark text-light text-center ">
        <h4>Prueba No. {noTest}</h4>
      </div>
      <div className="card-body">
        <div className="card-title text-center h5">{fecha || ""}</div>
        <ResponsiveContainer width="100%" height={450}>
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
            <XAxis dataKey="dateTime" hide={true} />
            <CartesianGrid strokeDasharray="2 2" />
            <YAxis />
            <Tooltip content={<CustomToolTip />} />
            <Legend />
            <Line isAnimationActive={false}
              type="monotone"
              dataKey="inhalado"
              name="Inhalado (ml.)"
              stroke="#39c7ff"
              activeDot={{ r: 1 }} />
            <Line isAnimationActive={false}
              type="monotone"
              dataKey="exhalado"
              name="Exhalado (ml.)"
              stroke="#39ffd4"
              activeDot={{ r: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Vo2RealTime;
