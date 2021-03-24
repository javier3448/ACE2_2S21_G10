import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { urlServer } from '../../config';
import { useInterval } from '../../services/interval';
import TimeView from '../nav-bar/TimeView';
export default function TemperatureView() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'temperatura' valor para el eje Y
  const [dataSet, setData] = useState([{name: '00s', sec: 0, temperatura: 0}]);
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
  useInterval(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    var flagInsertZero = false;
    var lastRecord;
    /// const response = await axios.get('http://localhost:4200/api/temperature/all')
    const response = await axios.get(urlServer + `reports/temperature/report1/${params.id}`)
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
        console.log(`El servidor respondió null, no hay datos`);
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
        data.temperatura = data.temperatura;
        return data;
      });
      /// Inserta el nuevo dato o un cero, dependiendo del resultado de flagInsertZero
      const newData = {name: '00s', sec:0, temperatura: flagInsertZero ? 0 : lastRecord.temperatura };
      newDataSet.push(newData);
      if (newDataSet.length >= 60)  {
        // Elimina el primer dato
        newDataSet.shift();
      }
      setData(newDataSet);
      /// Filtra la información, recuperando únicamente los que sean mayor a cero
      const filterData = dataSet.filter(value => value.temperatura > 0);
      /// Calcula el valor promedio
      const formatter = new Intl.NumberFormat('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const avgData = filterData.reduce((total, value) => total + value.temperatura,0) / filterData.length;
      /// Recupera el primer valor de filterDate o 0
      const firstValue = filterData.length > 0 ? filterData[0].temperatura: 0;
      /// Establece el valor menor, mayor y promedio del conjunto de dato 'dataSet'
      setMin(filterData.reduce((min, b) => Math.min(min, b.temperatura), firstValue));
      setMax(filterData.reduce((max, b) => Math.max(max, b.temperatura), firstValue));
      setAvg(isNaN(avgData) ? 0 : formatter.format(avgData));
      /// Determina el color y el icono a colocar dependendiendo de 'avg'
      if (avgData <= 0) {
        setIconTemperature('fa fa-thermometer-empty');
        setColorTemperature('text-muted');        
      } else if (avgData > 0 && avgData < 36) {
        setIconTemperature('fa fa-thermometer-quarter');
        setColorTemperature('text-info');
      } else if (avgData >= 36 && avgData < 37) {
        setIconTemperature('fa fa-thermometer-half');
        setColorTemperature('text-primary');
      } else if (avgData >= 37 && avgData < 38) {
        setIconTemperature('fa fa-thermometer-three-quarters');
        setColorTemperature('text-warning');
      } else if (avgData >= 38) {
        setIconTemperature('fa fa-thermometer-full');
        setColorTemperature('text-danger'); 
      }
    }
  }, 980)

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Temperatura</h1>
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