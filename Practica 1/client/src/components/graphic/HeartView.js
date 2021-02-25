import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { urlServer } from "../../config";
import TimeView from "../nav-bar/TimeView";
import axios from "axios";
import { useInterval } from "../../services/interval";

export default function HeartView() {
  /// Establece un hook para la información (dataSet)
  /// de la gráfica.
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'pulso' valor para el eje Y
  const [dataSet, setData] = useState([{name: '00s', sec:0, pulso: 0}]);
  /// Establece un hook para mostrar el promedio de pulso
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
    const response = await axios.get(urlServer + `/heart-rate/report1/${infoUser.IdUser}`);
    /// Servirá como referencia para determinar
    /// si insertar un cero o el valor de pulso
    /// que retornó el servidor en su último valor
    const refDate = new Date();
    const data = response.data;
    let flagInsertZero = false;
    if (data !== null) {
      /// Recupera el último dato
      const lastRecord = data[data.length - 1];
      /// Recupera la fecha del último dato
      const lastDate = new Date(lastRecord.dateTime);
      /// Muestra un mensaje
      console.log($`Fecha cliente : ${refDate}\n fecha server: ${lastDate}\n diferencia: ${refDate - lastDate}`)
      if (refDate - lastDate > 1100) {
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
      dataSet.shift();
      setData(dataSet);
    }
    /// Inserta el nuevo dato o un cero, dependiendo del resultado de flagInsertZero
    const newData = {name: '00s', sec:0, pulso: flagInsertZero ? 0 : data.pulso };
    setData(data => [...data, newData]);
    /// Calcula el promedio de pulsaciones
    setAvg(dataSet.reduce((total, value) => total + value.pulso,0) / dataSet.length);
    /// Determina el color del icono del corazón
    setColorHeart((avg < 10) ? 'text-muted' : (avg >= 10 && avg < 60) ? 'text-warning' : (avg >= 60 && avg <= 100) ? 'text-success' ? 'text-danger');
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
                <LineChart
                  width={1000}
                  height={400}
                  data={dataSet}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    domain={[
                      '59s',
                      '58s',
                      '57s',
                      '56s',
                      '55s',
                      '54s',
                      '53s',
                      '52s',
                      '51s',
                      '50s',
                      '49s',
                      '48s',
                      '47s',
                      '46s',
                      '45s',
                      '44s',
                      '43s',
                      '42s',
                      '41s',
                      '40s',
                      '39s',
                      '38s',
                      '37s',
                      '36s',
                      '35s',
                      '34s',
                      '33s',
                      '32s',
                      '31s',
                      '30s',
                      '29s',
                      '28s',
                      '27s',
                      '26s',
                      '25s',
                      '24s',
                      '23s',
                      '22s',
                      '21s',
                      '20s',
                      '19s',
                      '18s',
                      '17s',
                      '16s',
                      '15s',
                      '14s',
                      '13s',
                      '12s',
                      '11s',
                      '10s',
                      '09s',
                      '08s',
                      '07s',
                      '06s',
                      '05s',
                      '04s',
                      '03s',
                      '02s',
                      '01s',
                      '00s'
                    ]}
                  />
                  <CartesianGrid strokeDasharray="2 2" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="pulso"
                    stroke="#FF0000"
                    activeDot={{ r: 1 }}
                  />
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
