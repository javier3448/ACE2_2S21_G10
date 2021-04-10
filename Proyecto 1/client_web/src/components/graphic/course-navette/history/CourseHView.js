import React from 'react';
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
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 mb-4">
              <div className="card">
                <div className="card-header h4 text-center">Repeticiones por fecha</div>
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
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 mb-4">
              <div className="card">
                <div className="card-header h4 text-center">Repeticiones antes de fallar</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <FLapHGraph idUser={id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 mb-4">
              <div className="card">
                <div className="card-header h4 text-center">Repeticiones antes de rendirse</div>
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
          <div className="row">

          </div>
        </div>
      </div>
    </div>

  );
}