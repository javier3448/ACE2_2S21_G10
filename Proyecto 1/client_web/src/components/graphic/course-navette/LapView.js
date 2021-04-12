import axios from 'axios';
import React, { useState } from 'react';
import { urlServer } from '../../../config';
import { useInterval } from '../../../services/interval';
import { useParams } from 'react-router-dom';

export default function LapView(props) {
  const [laps, setLaps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [heart, setHeart] = useState(0);
  useInterval(() => {
    axios.get(urlServer + `get-all-distancia/${props.id}`)
      .then((response) => {
        const data = response.data;
        /// Recupera la última repetición
        if (data) {
          const laps = data[0].result;
          if (laps.length > 0) {
            const lastLap = data[0].result[laps.length - 1];
            /// Establece la información
            /// para la repetición más reciente
            setLaps(lastLap.repeticion);
            setDistance(lastLap.distancia);
            /// Establece la información para 
            /// el acumulado de distancia
            setTotalDistance(data[0].distanciaTotal);
          }
        }
      })
      .catch(err => console.error(err));
    axios.get(urlServer + `reports/heart-rate/report1/${props.id}`)
      .then((response) => {
        const data = response.data;
        if (data && data.length > 0) {
          const lastRecord = data[data.length - 1];
          setHeart(lastRecord.ritmo);
        }
      })
      .catch(err => console.error(err));
  }, 980);

  return (
    <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
      <div className="card card-body my-4">
        <h4>Distancia</h4>
        <div className="row h4">
          <div className="col-8">Actual</div>
          <div className="col-4 text-end">{distance} m</div>
        </div>
        <div className="row h4">
          <div className="col-8">Total</div>
          <div className="col-4 text-end">{totalDistance} m</div>
        </div>
      </div>
      <div className="card card-body my-4">
        <div className="row h4">
          <div className="col-8">Repeticiones</div>
          <div className="col-4 text-end">{laps}</div>
        </div>
      </div>
      <div className="card card-body my-4">
        <div className="row h4">
          <div className="col-8">Ritmo cardíaco</div>
          <div className="col-4 text-end align-center">{heart}</div>
        </div>
      </div>
    </div>
  );
}