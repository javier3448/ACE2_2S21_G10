import axios from 'axios';
import Alert from 'components/alerts/Alert';
import Loader from 'components/loader/Loader';
import { urlServer } from 'config';
import { useInterval } from 'hooks/useInterval';
import React, { useEffect, useState } from 'react';
import { Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getUser } from 'services/user';

const RealTime = () => {
  /// Recupera toda la info del usuario
  const userInfo = getUser();
  /// Calcula el limite inferior y mayor para
  /// el ritmo cardíaco
  const maxhrtanaka = 208 - (0.7*userInfo.edad);
  const minThreshold = Math.round(0.64*(maxhrtanaka));
  /// Data set para gráfica
  const [data, setData] = useState([]);
  /// No. de repetición
  const [lap, setLap] = useState(0);
  const [lastLap, setLastLap] = useState();
  /// Calorías por minuto
  const [calPerMinute, setCalPerMinute] = useState(0);
  /// Ritmo por segundo
  const [ritmo, setRitmo] = useState(0);
  /// Tiempo en minutos y segundos
  const [milis, setMilis] = useState('0 min 00 secs');
  /// Determina si la gráfica es tiempo real o 
  /// solo muestra la última repetición
  const [context, setContext] = useState('Última repetición');
  /// Declara dos alertas
  const [alert, setAlert] = useState();
  useEffect(() => {
    if (lastLap) {
      if (lastLap.calpersecond <= 0) {
        setAlert(<Alert
          onStateChange={() => { setAlert() }}
          title="¡Esfuerzate un poco más!"
          variant="warning"
          message={<p className="m-0">Necesitas un ritmo cardíaco de {minThreshold} para quemar calorías</p>}
        />)
      } else {
        setAlert(
          <Alert
            onStateChange={() => { setAlert() }}
            title="¡Sigue así!"
            variant="success"
            message={<p className="m-0">Mantén ese ritmo para seguir quemando calorías</p>}
          />)
      }
    }
  }, [lastLap, minThreshold]);

  useInterval(() => {
    const endpoint = urlServer + `obtener-calorias/${userInfo.IdUser}`;
    axios.get((endpoint))
      .then((response) => {
        if (response.data.length) {
          /// Recupera la data de la repetición más reciente
          var lastSet = response.data;
          lastSet = lastSet[lastSet.length - 1];
          /// Determina el contexto
          if (data.length) {
            if (lastSet.length > data.length) {
              setContext('Repetición actual');
            } else {
              setContext('Última repetición');
            }
          }
          /// Recupera el item más reciente, desde lastSet
          const dataSet = lastSet.arrayCaloriasPorSegundo;
          const lastItem = dataSet[dataSet.length - 1];
          /// Recupera el total de calorías por minuto
          setLastLap(lastItem);
          setData(dataSet);
          setLap(lastItem.repeticion);
          setCalPerMinute(lastSet.calperminute.toFixed(2));
          setRitmo(lastItem.ritmo.toFixed(2));
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
        {alert}
        <div className="card mb-2">
          <div className="card-body rounded text-light bg-lap">
            <div className="card-title h3">
              <i className="fa fa-running"></i>
              {" " + lap + (lap === 1 ? 'er' : 'º')}
            </div>
            Repetición
          </div>
        </div>
        <div className="card mb-2 ">
          <div className="card-body rounded text-light bg-calories">
            <div className="card-title h3"><i className="fa fa-fire-alt"></i>{' ' + calPerMinute}</div>
            Calorías quemadas
          </div>
        </div>
        <div className="card mb-2">
          <div className="card-body rounded text-light bg-heart">
            <div className="card-title h3"><i className="fa fa-heartbeat"></i>{' ' + ritmo}</div>
            Ritmo cardíaco
          </div>
        </div>
      </div>
      <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
        {data.length ? <div className="card">
          <div className="card-body m-0 p-1">
            <div className="card-title text-center">
              <h3>{context}</h3>
              <span className="badge bg-dark">{milis}</span>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-12 mb-2">
                <ResponsiveContainer id="graphic" width="100%" height={400}>
                  <LineChart
                    width={1000}
                    height={450}
                    data={data}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="tiempo" hide={true} name="seg."></XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="calpersecond"
                      name="Calorias"
                      stroke="orange"
                      activeDot={false}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="col-lg-6 col-md-12 mb-2">
                <ResponsiveContainer id="graphic" className="m-0" width="100%" height={400}>
                  <LineChart
                    width={1000}
                    height={450}
                    data={data}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="tiempo" hide={true} name="seg."></XAxis>
                    <YAxis domain={[0,200]}/>
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={minThreshold} stroke="black" />
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="ritmo"
                      name="Ritmo cardíaco"
                      stroke="red"
                      activeDot={false}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div> : <Loader />}
      </div>
    </div>
  )
}

export default RealTime;