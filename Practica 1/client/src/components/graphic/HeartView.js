import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UserInfo from '../nav-bar/UserInfoView';
export default function HeartView() {

  const [data, setData] = useState([ ]);
  const [avg, setAvg] = useState(0);
  const [colorHeart, setColorHeart] = useState('text-muted');

  //useEffect(() => {
  /* como se jala la data del api, esto deberia ir en el interval cuando se necesite
  fetch('https://pokeapi.co/api/v2/pokemon/squirtle')
  .then(response => response.json())
  .then(data => setData(data)) */

  //   const interval = setInterval(() => {
  //     const newData = {
  //       name: '0',
  //       sec: 0,
  //       pulse: 5400,
  //     }
  //     setData(data => [...data, newData])
  //   }, 1000)

  //   return () => clearInterval(interval);

  // }, []);

  console.log(data)

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col">
              <h1>Ritmo cardiaco</h1>
            </div>
          </div>
          <div className="card card-body my-4">
            <div className="row">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  width={1000}
                  height={400}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" domain={[
                    '60s',
                    '58s',
                    '56s',
                    '54s',
                    '52s',
                    '50s',
                    '48s',
                    '46s',
                    '44s',
                    '42s',
                    '40s',
                    '38s',
                    '36s',
                    '34s',
                    '32s',
                    '30s',
                    '28s',
                    '26s',
                    '24s',
                    '22s',
                    '20s',
                    '18s',
                    '16s',
                    '14s',
                    '12s',
                    '10s',
                    '08s',
                    '06s',
                    '04s',
                    '02s',
                    '00s',
                  ]} />
                  <CartesianGrid strokeDasharray="2 2" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pulso" stroke="#FF0000" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card card-body">
            <div className="row">
              <h1>Promedio: {avg} <span className={colorHeart}><i className="fa fa-heartbeat"></i></span></h1>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}