import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeView from '../nav-bar/TimeView';
import {urlServer} from '../../config'
import { useInterval } from '../../services/interval';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function OxygenView() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica.
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'oxigeno' valor para el eje Y
  const [dataSet, setData] = useState([{name: '00s', sec:0, oxigeno: 0}]);
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

  useInterval(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    var flagInsertZero = false;
    var lastRecord;
    /// const response = await axios.get('http://localhost:4200/api/oxygen/all')
    const response = await axios.get(urlServer + `reports/oxygen/report1/${params.id}`)
    /// Servirá como referencia para determinar
    /// si insertar un cero o el valor de oxigeno
    /// que retornó el servidor en su último valor
    const refDate = new Date();
    if (response.status === 200) {
      const data = response.data;
      if (data !== null) {
        /// Recupera el último dato
        lastRecord = data[data.length - 1];
        /// Recupera la fecha del último dato
        const lastDate = new Date(lastRecord.dateTime);
        /// Muestra un mensaje
        console.log(`Fecha cliente : ${refDate}\n fecha server: ${lastDate}\n diferencia: ${refDate - lastDate}`)
        if (refDate - lastDate > 1250) {
          /// Si la diferencia de tiempo es mayor a 1.1 seg, insertará un cero
          flagInsertZero = true;
        }
      } else {
        /// El servidor puede devolver null cuando no hay ningún registro
        /// del sensor de latidos para el usuario dado
        console.log(`El servidor respondió null, no hay datos`);
        /// El servidor no tiene dato, insertará un 0
        flagInsertZero = true;
      }   
    }
    /// Reordena los elementos con el objetivo
    /// que parezca que la gráfica se mueve
    setData(dataSet.map((data) => {
      data.sec++;
      if (data.sec < 10) {
        data.name = '0' + data.sec + 's';
      } else {
        data.name = data.sec + 's';
      }
      data.oxigeno = data.oxigeno;
      return data;
    }));
    if (dataSet.length >= 60)  {
      // Elimina el primer dato
      dataSet.shift();
      setData(dataSet);
    }
    /// Inserta el nuevo dato o un cero, dependiendo del resultado de flagInsertZero
    const newData = {name: '00s', sec:0, oxigeno: flagInsertZero ? 0 : lastRecord.oxigeno };
    setData(data => [...data, newData]);
    /// Filtra la información, recuperando únicamente los que sean mayor a cero
    const filterData = dataSet.filter(value => value.oxigeno > 0);
    const avgData = Math.round(filterData.reduce((total, value) => total + value.oxigeno,0) / filterData.length);
    /// Calcula el promedio de oxigeno en la sangre
    setAvg(isNaN(avgData) ? 0 : avgData);
    /// Determina el color del icono de pulmón
    /// setColorOxygen((avg < 10) ? 'text-muted' : (avg >= 10 && avg < 60) ? 'text-warning' : (avg >= 60 && avg <= 100) ? 'text-success' : 'text-danger');
  }, 1000)

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Oxigeno en la sangre</h1>
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
    </div >

  );
}