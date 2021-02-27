import axios from "axios";
import React, { isValidElement, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from "recharts";
import { useInterval } from "../../services/interval";
import {urlServer} from '../../config'
import TimeView from "../nav-bar/TimeView";
import ErrorView from "../error-page/Error";
import { useParams } from "react-router-dom";

export default function HeartHistory() {
  const params = useParams();
  /// Establece un hook para la información (dataSet)
  /// de la gráfica.
  /// Almacenará 'name' valor para el eje X
  /// 'sec' referencia que ayudará a 'mover' los datos
  /// 'pulso' valor para el eje Y
  const [dataSet, setData] = useState([{name: '', pulso: 0}]);
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
  /// Determina si la petición get es válida para el IdUser dado
  const [validRender, isValid] = useState(true);
  useEffect(async () => {
    /// Solicita al servidor todos los datos del usuario con id: IdUser
    const response = await axios.get(urlServer + `reports/heart-rate/report1/${params.id}`);
    const avgResponse = await axios.get(urlServer + `reports/heart-rate/report3/${params.id}`)
    if (response.status === 200) {
      const data = response.data;
      if (data !== null) {
        setData(data.map((value) => {
          value.name = new Date(value.dateTime)
          value.pulso = value.ritmo
          return value;
        }));
      }
    } else {
      isValid(false);
    }
    /// Establece el promedio
    if (avgResponse.status === 200 && avgResponse.data !== null) {
      const avgData = Math.round(avgResponse.data.promedioRitmo);
      setAvg(isNaN(avgData) ? 0 : avgData);
    }
    /// Determina el color del icono del corazón
    setColorHeart((avg < 10) ? 'text-muted' : (avg >= 10 && avg < 60) ? 'text-warning' : (avg >= 60 && avg <= 100) ? 'text-success' : 'text-danger');
  }, [])

  return  ( !validRender ? <ErrorView data={{error: "404 - Recurso no encontrado"}} /> :
    (<div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Ritmo cardiaco - Historial</h1>
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
    </div>)
  );
}
