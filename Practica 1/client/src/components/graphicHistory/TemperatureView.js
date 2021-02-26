import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { urlServer } from '../../config';
import { useInterval } from '../../services/interval';
import TimeView from '../nav-bar/TimeView';
export default function TemperatureHistory() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'temperatura' valor para el eje Y
  const [dataSet, setData] = useState([{name: '', temperatura: 0}]);
  /// Establece un hook para mostrar el valor promedio
  /// el valor máximo y el valor mínimo
  /// del conjunto de datos 'dataSet'
  const [avg, setAvg] = useState('0');
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  /// Establece un hook para mostrar de diferente color el 
  /// icono del termometro, y mostrar un icono diferente de termometro
  /// text-danger y full si está por encima de los 38 grados (inclusivo)
  /// text-warning y three-quarters si está por encima de los 37 grado (inclusivo) y menor a 38 (exclusivo)
  /// text-primary y half si está por encima de los 36 grados (inclusivo) y menor a 37 (exclusivo)
  /// text-info y quarter si está por debajo de los 36 grados (exclusivo) pero es mayor a 0 (exclusivo)
  /// text-muted y empty si es igual a 0
  const [colorTemperature, setColorTemperature] = useState('text-muted');
  const [iconTemperature, setIconTemperature] = useState('fa fa-thermometer-empty');
  /// Determina si la petición get es válida para el IdUser dado
  const [validRender, isValid] = useState(true);
  useEffect(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    axios.get(urlServer + `reports/temperature/report1/${params.id}`)
    .then((response) => {
      if(response.status===200){
        const data = response.data;
        if (data !== null) {
          setData(data.map((value)=> {
            value.name = new Date(value.dateTime);
            value.temperatura = value.temperatura;
            return value;
          }))
        }
      }
    }).catch((err) => console.log(err))
    axios.get(urlServer + `reports/temperature/report3/${params.id}`)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        if (data !== null) {
          const avgData = Math.round(data.promedioTemperatura);
          setAvg(isNaN(avgData) ? 0 : avgData);
        }
      }
    }).catch((err) => console.log(err))
    axios.get(urlServer + `reports/temperature/report4/${params.id}`)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        if (data !== null) {
          const maxData = data.tempMaxima;
          setMax(isNaN(maxData) ? 0 : maxData);
        }
      }
    }).catch((err) => console.log(err))
    axios.get(urlServer + `reports/temperature/report5/${params.id}`)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        if (data !== null) {
          const minData = data.tempMinima;
          setMin(isNaN(minData) ? 0 : minData);
        }
      }
    }).catch((err) => console.log(err))    
  }, [])

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Temperatura - Historial</h1>
            </div>
            <TimeView />
          </div>
          <div className="card card-body my-4">
            <div className="row">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart width={1000} height={400}
                  data={dataSet}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5, }} >
                  <XAxis dataKey="name" />
                  <CartesianGrid strokeDasharray="1 1" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line  isAnimationActive={false} type="monotone" 
                  dataKey="temperatura" stroke="#4b0081" activeDot={{ r: 1 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card card-body">
            <div className="row">
                <div className="col">
                    <h1>Promedio: {avg + "° C"} <span className={colorTemperature}><i className={iconTemperature}></i></span></h1>
                </div>
                <div className="col">
                    <h1>Maxima: {max + "° C"} <span className="text-danger"><i className="fa fa-temperature-high"></i></span></h1>
                </div>
                <div className="col">
                    <h1>Minima: {min + "° C"} <span className="text-primary"><i className="fa fa-temperature-low"></i></span></h1>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}