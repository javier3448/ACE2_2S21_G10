import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TimeView from '../../../nav-bar/TimeView';
import WeekHView from './WeekHView';
import WeekHGraph from './WeekHGraph';
import VelHGraph from './VelHGraph';
import DistanceHGraph from './DistanceHGraph';
import FLapHGraph from './FLapHGraph';
import SLapHGraph from './SLapHGraph';
export default function CourseHView() {
  const params = useParams();
  const id = params.id;
  const [sh1, setSh1] = useState(false);
  const [sh2, setSh2] = useState(false);
  const [sh3, setSh3] = useState(false);
  const [colLg, setcolLg] = useState(4);

  const handleClick = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case "btn1":
        if (!sh2 && !sh3) {
          /// Estan visibles
          setSh1(false);
          setSh2(true);
          setSh3(true);
          setcolLg(12);
        } else {
          /// Estan invisibles
          setSh1(false);
          setSh2(false);
          setSh3(false);
          setcolLg(4);
        }
        break;
      case "btn2":
        if (!sh1 && !sh3) {
          /// Estan visibles
          setSh1(true);
          setSh2(false);
          setSh3(true);
          setcolLg(12);
        } else {
          /// Estan invisibles
          setSh1(false);
          setSh2(false);
          setSh3(false);
          setcolLg(4);
        }
        break;
      case "btn3":
        if (!sh1 && !sh2) {
          /// Estan visibles
          setSh1(true);
          setSh2(true);
          setSh3(false);
          setcolLg(12);
        } else {
          /// Estan invisibles
          setSh1(false);
          setSh2(false);
          setSh3(false);
          setcolLg(4);
        }
        break;
    }
  }

  const [colLg1, setcolLg1] = useState(4);
  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row mb-4">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Test Course-Navette - Reportes</h1>
            </div>
            <TimeView />
          </div>
          <hr />
          <div className="row">
            <div className={`col-lg-${colLg} col-md-12 col-sm-12 col-xs-12 mb-4`} hidden={sh1}>
              <div className="card">
                <button className="btn btn-secondary" type="button" onClick={handleClick}>
                  <div className="h4 text-center" id="btn1">
                    Repeticiones por fecha
                  </div>
                </button>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="overflow-auto">
                        <WeekHGraph idUser={id} />
                        <WeekHView idUser={id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-lg-${colLg} col-md-12 col-sm-12 col-xs-12 mb-4`} hidden={sh2}>
              <div className="card">
                <button className="btn btn-secondary" type="button" onClick={handleClick}>
                  <div className="h4 text-center" id="btn2" >
                    Repeticiones antes de fallar
                  </div>
                </button>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <FLapHGraph idUser={id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-lg-${colLg} col-md-12 col-sm-12 col-xs-12 mb-4`} hidden={sh3}>
              <div className="card">
                <button className="btn btn-secondary" type="button" onClick={handleClick}>
                  <div className="h4 text-center" id="btn3">
                    Repeticiones antes de rendirse
                  </div>
                </button>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <SLapHGraph idUser={id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-4">
              <div className="card">
                <div className="card-header h4 text-center">Velocidad alcanzada (m/s)</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="overflow-auto">
                        <VelHGraph idUser={id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-4">
              <div className="card">
                <div className="card-header h4 text-center">Distancia por repetición (m)</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="overflow-auto">
                        <DistanceHGraph idUser={id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}