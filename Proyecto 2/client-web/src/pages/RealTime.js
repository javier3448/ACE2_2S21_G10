import axios from 'axios';
import { urlServer } from 'config';
import { useInterval } from 'hooks/useInterval';
import React, { useState } from 'react';
import { getUser } from 'services/user';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loader from 'components/loader/Loader';

const RealTime = () => {
  /// Data set para gráfica
  const [data, setData] = useState([]);
  /// No. de entrenamiento
  const [lap, setLap] = useState(0);
  /// Calorías por minuto
  const [calPerMinute, setCalPerMinute] = useState(0);
  /// Ritmo por segundo
  const [ritmo, setRitmo] = useState(0);
  /// Tiempo en minutos y segundos
  const [milis, setMilis] = useState('0 min 00 secs');
  /// Determina si la gráfica es tiempo real o 
  /// solo muestra el último entrenamiento
  const [context, setContext] = useState('Último entrenamiento');
  useInterval(() => {
    const userInfo = getUser();
    const endpoint = urlServer + `obtener-calorias/${userInfo.IdUser}`;
    axios.get((endpoint))
      .then((response) => {
        if (response.data.length) {
          /// Recupera la data del entrenamiento más reciente
          const lastSet = response.data[0];
          /// Determina el contexto
          if (data.length) {
            if (lastSet.length > data.length) {
              setContext('Entrenamiento actual');
            } else {
              setContext('Último entrenamiento');
            }
          }
          /// Recupera el item más reciente, desde lastSet
          const dataSet = lastSet.arrayCaloriasPorSegundo;
          const lastItem = dataSet[dataSet.length - 1];
          /// Recupera el total de calorías por minuto
          setData(dataSet);
          setLap(lastItem.repeticion);
          setCalPerMinute(lastSet.calperminute);
          setRitmo(lastItem.ritmo);
          /// Establece la marca de tiempo
          const min = Math.floor(lastItem.tiempo / 60);
          const secs = (lastItem.tiempo - min * 60);
          setMilis(`${min} min ${secs >= 0 ? secs : `0${secs}`} secs`)
        }
      })
      .catch((e) => console.error(e));
  }, 990);
  return (
    <div className="row mb-2">
      <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 mb-2">
        <div className="card mb-2">
          <div className="card-body rounded text-light bg-lap">
            <div className="card-title h2">
              <i className="fa fa-running"></i>
              {" " + lap + (lap === 1 ? 'er' : 'º')}
            </div>
            Entrenamiento
          </div>
        </div>
        <div className="card mb-2 ">
          <div className="card-body rounded text-light bg-calories">
            <div className="card-title h2"><i className="fa fa-fire-alt"></i>{' ' + calPerMinute}</div>
            Calorías quemadas
          </div>
        </div>
        <div className="card mb-2">
          <div className="card-body rounded text-light bg-heart">
            <div className="card-title h2"><i className="fa fa-heartbeat"></i>{' ' + ritmo}</div>
            Ritmo cardíaco
          </div>
        </div>
      </div>
      <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
        {data.length ? <div className="card border border-dark">
          <div className="card-body">
            <div className="card-title text-center">
              <h3>{context}</h3>
              <span className="badge bg-dark">{milis}</span>
            </div>
            <ResponsiveContainer id="graphic" width="100%" height={450}>
              <LineChart
                width={1000}
                height={450}
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="tiempo" name="seg."></XAxis>
                <CartesianGrid strokeDasharray="1 1" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="calpersecond"
                  name="Calorias"
                  stroke="#de7647"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> : <Loader />}
      </div>
    </div>
  )
}

export default RealTime;