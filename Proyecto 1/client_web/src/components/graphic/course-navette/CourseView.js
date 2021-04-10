import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { urlServer } from '../../../config';
import { useInterval } from '../../../services/interval';
import TimeView from '../../nav-bar/TimeView';
import LapView from './LapView';
export default function CourseView() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'temperatura' valor para el eje Y
  const [dataSet, setData] = useState([{ name: '00s', sec: 0, velocidad: 0 }]);
  /// Establece un hook para mostrar el valor promedio
  /// el valor máximo y el valor mínimo
  /// del conjunto de datos 'dataSet'
  const [avg, setAvg] = useState('0');
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  useInterval(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    var flagInsertZero = false;
    var lastRecord;
    /// const response = await axios.get('http://localhost:4200/api/temperature/all')
    const response = await axios.get(urlServer + `get-all-velocity/${params.id}`)
    /// Servirá como referencia para determinar
    /// si insertar un cero o el valor de temperatura
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
        /// console.log(`Fecha cliente : ${refDate}\n fecha server: ${lastDate}\n diferencia: ${refDate - lastDate}`)
        if (Math.abs(refDate - lastDate) > 5000) {
          /// Si la diferencia de tiempo es mayor a 1.1 seg, insertará un cero
          flagInsertZero = true;
        }
      } else {
        /// El servidor puede devolver null cuando no hay ningún registro
        /// del sensor de latidos para el usuario dado
        /// console.log(`El servidor respondió null, no hay datos`);
        /// El servidor no tiene dato, insertará un 0
        flagInsertZero = true;
      }
      /// Reordena los elementos con el objetivo
      /// que parezca que la gráfica se mueve
      const newDataSet = dataSet.map((data) => {
        data.sec++;
        if (data.sec < 10) {
          data.name = '0' + data.sec + 's';
        } else {
          data.name = data.sec + 's';
        }
        data.velocidad = data.velocidad;
        return data;
      });
      /// Inserta el nuevo dato o un cero, dependiendo del resultado de flagInsertZero
      const newData = { name: '00s', sec: 0, velocidad: flagInsertZero ? 0 : lastRecord.velocidad };
      newDataSet.push(newData);
      if (newDataSet.length >= 20) {
        // Elimina el primer dato
        newDataSet.shift();
      }
      setData(newDataSet);
      /// Filtra la información, recuperando únicamente los que sean mayor a cero
      const filterData = dataSet.filter(value => value.velocidad > 0);
      /// Calcula el valor promedio
      const formatter = new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const avgData = filterData.reduce((total, value) => total + value.velocidad, 0) / filterData.length;
      /// Recupera el primer valor de filterDate o 0
      const firstValue = filterData.length > 0 ? filterData[0].velocidad : 0;
      /// Establece el valor menor, mayor y promedio del conjunto de dato 'dataSet'
      setMin(filterData.reduce((min, b) => Math.min(min, b.velocidad), firstValue));
      setMax(filterData.reduce((max, b) => Math.max(max, b.velocidad), firstValue));
      setAvg(isNaN(avgData) ? 0 : formatter.format(avgData));
    }
  }, 980)

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Test Course-Navette</h1>
            </div>
            <TimeView />
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-6 col-sm-12 col-xs-12">
              <div className="card card-body my-4">
                <h3>Velocidad</h3>
                <ResponsiveContainer id="lineVelocity" width="100%" height={300}>
                  <LineChart
                    height={300}
                    data={dataSet}
                    margin={{ top: 0, right: 30, left: 0, bottom: 0, }} >
                    <XAxis dataKey="name" />
                    <CartesianGrid strokeDasharray="1 1" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line isAnimationActive={false} type="monotone"
                      dataKey="velocidad" stroke="#4b0081" activeDot={{ r: 1 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="row">
                  <div className="col text-center">
                    <h4>Avg</h4>
                  </div>
                  <div className="col">
                    <h4>{avg} m/s</h4>
                  </div>
                  <div className="col text-center border-start border-dark">
                    <h4>Max</h4>
                  </div>
                  <div className="col border-end border-dark">
                    <h4>{max} m/s</h4>
                  </div>
                  <div className="col text-center">
                    <h4>Min</h4>
                  </div>
                  <div className="col">
                    <h4>{min} m/s</h4>
                  </div>
                </div>
              </div>
            </div>
            <LapView id={params.id} />
          </div>
        </div>
      </div>
    </div >
  );
}