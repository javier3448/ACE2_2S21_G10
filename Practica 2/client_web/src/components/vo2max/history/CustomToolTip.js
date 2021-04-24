import React from 'react';

const CustomToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label.split('#')[1]);
    return (
      <div className="border rounded border-info bg-dark bg-gradient p-1 text-light">
        <div className="row">
          <div className="col">Prueba</div>
          <div className="col text-end">
            <span style={{ backgroundColor: "#107dac" }} className="badge text-wrap">
              {label.split('#')[0]}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">Fecha</div>
          <div className="col text-end">
            <span style={{ backgroundColor: "#107dac" }} className="badge text-wrap">
              {date.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">Hora</div>
          <div className="col text-end">
            <span style={{ backgroundColor: "#107dac" }} className="badge text-wrap">
              {date.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">Máximo</div>
          <div className="col text-end">
            <span style={{ backgroundColor: payload[2].color }} className="badge text-wrap">
              {payload[2].value}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">Promedio</div>
          <div className="col text-end">
            <span style={{ backgroundColor: payload[1].color }} className="badge text-wrap">
              {payload[1].value}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">Mínimo</div>
          <div className="col text-end">
            <span style={{ backgroundColor: payload[0].color }} className="badge text-wrap">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default CustomToolTip;