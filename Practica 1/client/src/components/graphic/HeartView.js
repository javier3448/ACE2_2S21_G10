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
  const [dataSet, setData] = useState([{name: '00s', sec:0, pulso: 0}]);
  const [avg, setAvg] = useState(0);
  const [colorHeart, setColorHeart] = useState("text-muted");
  const infoUser = JSON.parse(localStorage.getItem("userInfo"));

  useInterval(async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon/squirtle")
    const data = response.data;
    if (data !== null) {
      /// Reordena los elementos
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
      if (dataSet.length === 60)  {
        dataSet.shift();
        setData(dataSet);
      }
      const newData = {name: '00s', sec:0, pulso: data.base_experience * Math.random()};
      setData(data => [...data, newData]);
    }
  }, 1000);

  // useEffect(() => {
    // const response = axios.get(urlServer + `/heart-rate/report1/${infoUser.IdUser}`);
    // if (response.data !== null) {
    //   let lengthData = response.data.length;
    //   if (dataSet.length === 0) {
    //     // Está vacío
    //     // Recupera el último dato de la lista que envió el servidor
    //     let lastRecord = response.data[lengthData - 1];
    //     // Convierte la fecha
    //     let lastRecordDate = new Date(lastRecord.dateTime);
    //     // Determina si el registro es el más reciente
    //     let lastSeconds = new Date();
    //     // Si la diferencia es mmayor a 0.6 y menor a 1.4
    //     let difference = lastSeconds - lastRecordDate;
    //     if (difference >= 0.6 && lastRecordDate <= 1.4) {
    //       dataSet.push({name: '00s', sec: 0, pulse:lastRecord.ritmo})
    //     }
    //   } else {
    //     // No está vacío
    //   }
    // }
  //   const interval = setInterval(() => {
  //     axios.get("https://pokeapi.co/api/v2/pokemon/squirtle")
  //     .then((response) => {
  //       setData((data) => {
  //         if(data.length === 60) {
  //           data.pop();
  //         }
  //         data.unshift({name: '00s', sec:0, pulso: response.data.base_experience * Math.random()})
  //       })
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

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
