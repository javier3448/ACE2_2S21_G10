import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeView from '../nav-bar/TimeView';
import {urlServer} from '../../config'
import { useInterval } from '../../services/interval';
import axios from 'axios';
import ErrorView from '../error-page/Error';

export default function OxygenHistory() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica.
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'oxigeno' valor para el eje Y
  const [dataSet, setData] = useState([{name: '', oxigeno: 0}]);
  /// Establece un hook para mostrar el promedio de oxígeno en la sangre
  /// del conjunto de datos 'dataSet'
  const [avg, setAvg] = useState(0);
  /// Establece un hook para mostrar de difernte color
  /// el icono de pulmones
  /// text-danger si está por encima de lo normal
  /// text-success si está en el rango considerado normal
  /// text-warning si está por debajo de lo normal
  /// text-muted cuando es cero o menor
  const [colorOxygen, setColorOxygen] = useState('text-muted');
  /// Determina si la petición get es válida para el IdUser dado
  const [validRender, isValid] = useState(true);
  useEffect(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    const response = await axios.get(urlServer + `reports/oxygen/report1/${params.id}`)
    const avgResponse = await axios.get(urlServer + `reports/oxygen/report3/${params.id}`)
    if (response.status === 200) {
      const data = response.data;
      if (data !== null) {
        setData(data.map((value) => {
          value.name = new Date(value.dateTime);
          value.oxigeno = value.oxigeno;
          return value;
        }));
      }
    } else {
      isValid(false);
    }
    /// Establece el promedio
    if (avgResponse.status === 200 && avgResponse.data !== null) {
      const avgData = Math.round(avgResponse.data.promedioOxigeno);
      setAvg(isNaN(avgData) ? 0 : avgData);  
    }
    /// Determina el color del icono de pulmón
    /// setColorOxygen((avg < 10) ? 'text-muted' : (avg >= 10 && avg < 60) ? 'text-warning' : (avg >= 60 && avg <= 100) ? 'text-success' : 'text-danger');
  }, [])

  return ( !validRender ? <ErrorView data={{error: "404 - Recurso no encontrado"}} /> :
    (<div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Oxigeno en la sangre - Historial</h1>
            </div>
            <TimeView />
          </div>
          <div className="card card-body my-4">
            <div className="row">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart width={1000} height={400} data={dataSet}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5, }} >
                  <XAxis dataKey="name" />
                  <CartesianGrid strokeDasharray="2 2" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line isAnimationActive={false} type="monotone" 
                  dataKey="oxigeno" stroke="#4040ff" activeDot={{ r: 1 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card card-body">
            <div className="row">
              <h1>Promedio: {avg} <span className={colorOxygen}><i className="fa fa-lung"></i></span></h1>
            </div>
          </div>
        </div>
      </div>
    </div >)
  );
}