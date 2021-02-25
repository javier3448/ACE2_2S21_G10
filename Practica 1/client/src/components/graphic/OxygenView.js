import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeView from '../nav-bar/TimeView';
export default function OxygenView() {

  const [data, setData] = useState([ ]);
  const [avg, setAvg] = useState(0);
  const [colorOxygen, setColorOxygen] = useState('text-muted');

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
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Oxigeno en la sangre</h1>
            </div>
            <TimeView />
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
                  ]} />
                  <CartesianGrid strokeDasharray="2 2" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oxigeno" stroke="#4040ff" activeDot={{ r: 8 }} />
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