import React, { useState } from 'react';
import Exhaled from './Exhaled';
import Inhaled from './Inhaled';
import Vo2Max from './Vo2Max';
import TimeView from '../../nav-bar/TimeView';

const AllGraphics = () => {
  const [graphic, setGraphic] = useState(0);
  const WhichGraphic = () => {
    console.log(typeof graphic);
    if (typeof graphic === "number") {
      switch (graphic) {
        case 0:
          return <Exhaled />
        case 1:
          return <Inhaled />
        case 2:
          return <Vo2Max />
      }
    }
    return <div>Recarge la página</div>;
  }

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Vo2Max</h1>
            </div>
            <TimeView />
          </div>
          <div className="d-grid gap-2">
            <div className="btn-group " role="group" aria-label="Basic example">
              <button type="button" onClick={ () => setGraphic(0)} className="btn btn-outline-dark">Exhalado</button>
              <button type="button" onClick={ () => setGraphic(1)} className="btn btn-outline-dark">Inhalado</button>
              <button type="button" onClick={() => setGraphic(2)} className="btn btn-outline-dark">Vo2Max</button>
            </div>
          </div>
          <div className="row my-4">
            <div className="col">
              <WhichGraphic />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllGraphics;