import React from 'react';
import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * 
 * @param {{animated:boolean}} param0 
 * @returns 
 */
const Chart = () => {
  
  const [data, setData] = useState([]);
  return (
    <div className="card border border-dark">
      <div className="card-header bg-dark text-light text-center">
        <h4>Entrenamiento 1</h4>
        <span className="badge rounded-pill bg-dark">
          Inició:
        </span>
        <span className="badge rounded-pill bg-dark">
          Finalizó:
        </span>
      </div>
      <div className="card-body">
        <div className="card-title text-center h5">1:00</div>
        <ResponsiveContainer id="graphic" width="100%" height={450}>
          <LineChart
            width={1000}
            height={450}
            data={data}
            margin={{top:10,right:20,left:0,bottom:0}}>
            <XAxis dataKey="dataTime" name="seg."></XAxis>
            <CartesianGrid strokeDasharray="1 1" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line  
              isAnimationActive={false}
              type="monotone"
              dataKey="calorias"
              name="Calorias"
              stroke="#4e8763"
              />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;