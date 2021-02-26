import axios from "axios";
import React, { useState } from "react";
import {
  CartesianGrid,
  Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from "recharts";
import { useInterval } from "../../services/interval";
import {urlServer} from '../../config'
import TimeView from "../nav-bar/TimeView";

export default function HeartView() {
  /// Establece un hook para la información (dataSet)
  /// de la gráfica.
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'pulso' valor para el eje Y
  const [dataSet, setData] = useState([{name: '00s', sec:0, pulso: 0}]);
  /// Establece un hook para mostrar el promedio de pulso
  /// del conjunto de datos 'dataSet'
  const [avg, setAvg] = useState(0);
  /// Establece un hook para mostrar de diferente color 
  /// el icono de corazón
  /// text-danger si es mayor a 100 (exclusivo)
  /// text-success si está entre 60 y 100 (inclusivo)
  /// text-warning si es menor a 60 y mayor a 10 (inclusivo)
  /// text-muted si es menor a 10 (exclusivo)
  const [colorHeart, setColorHeart] = useState("text-muted");
  useInterval(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    const infoUser = JSON.parse(localStorage.getItem("userInfo"));
    var flagInsertZero = false;
    var lastRecord;
    /// const response = await axios.get('http://localhost:4200/api/heart/all');
    const response = await axios.get(urlServer + `reports/heart-rate/report1/${infoUser.IdUser}`);
    /// Servirá como referencia para determinar
    /// si insertar un cero o el valor de pulso
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
      data.pulso = data.pulso;
      return data;
    }));
    if (dataSet.length >= 60)  {
      // Elimina el primer dato
      dataSet.shift();
      setData(dataSet);
    }
    /// Inserta el nuevo dato o un cero, dependiendo del resultado de flagInsertZero
    const newData = {name: '00s', sec:0, pulso: flagInsertZero ? 0 : lastRecord.pulso };
    setData(data => [...data, newData]);
    /// Filtra la información, recuperando únicamente los que sean mayor a cero
    const filterData = dataSet.filter(value => value.pulso > 0);
    /// Calcula el promedio de pulsaciones
    const avgData = Math.round(filterData.reduce((total, value) => total + value.pulso,0) / filterData.length);
    setAvg(isNaN(avgData) ? 0 : avgData);
    /// Determina el color del icono del corazón
    setColorHeart((avg < 10) ? 'text-muted' : (avg >= 10 && avg < 60) ? 'text-warning' : (avg >= 60 && avg <= 100) ? 'text-success' : 'text-danger');
  }, 1000);

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Ritmo cardiaco</h1>
            </div>
            <TimeView />
          </div>
          <div className="card card-body my-4">
            <div className="row">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart width={1000} height={400} data={dataSet}
                  margin={{ top: 5, right: 30, left: 20,bottom: 5,}}>
                  <XAxis dataKey="name"/>
                  <CartesianGrid strokeDasharray="2 2" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line isAnimationActive={false} type="monotone"
                    dataKey="pulso" stroke="#FF0000" activeDot={{ r: 1 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card card-body">
            <div className="row">
              <h1>
                Promedio: {avg}{" "}
                <span className={colorHeart}>
                  <i className="fa fa-heartbeat"></i>
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
