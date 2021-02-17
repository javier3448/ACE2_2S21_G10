import React from "react";
import { useHistory } from "react-router-dom";
import UserInfo from "../nav-bar/UserInfoView";

export default function Dashboard() {
  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <hr />
          <div className="row my-2">
            <div className="col-lg-4 col-md-12 my-3">
              <div className="card">
                <div className="card-header">
                  <h5 className="text-center">
                    Ritmo cardíaco{" "}
                    <span>
                      <i className="fa fa-heartbeat"></i>
                    </span>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 d-grid gap-2">
                      <button className="btn btn-outline-primary" type="button">
                        Tiempo real
                      </button>
                    </div>
                    <div className="col-6 d-grid gap-2">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseHeart"
                        aria-expanded="false"
                        aria-controls="collapseHeart"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="collapse" id="collapseHeart">
                        <p>Registros anteriores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 my-3">
              <div className="card">
                <div className="card-header">
                  <h5 className="text-center">
                    Nivel de oxígeno{" "}
                    <span>
                      <i className="fa fa-lungs"></i>
                    </span>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 d-grid gap-2">
                      <button className="btn btn-outline-primary" type="button">
                        Tiempo real
                      </button>
                    </div>
                    <div className="col-6  d-grid gap-2">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOxygen"
                        aria-expanded="false"
                        aria-controls="collapseOxygen"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="collapse" id="collapseOxygen">
                        <p>Registros anteriores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 my-3">
              <div className="card">
                <div className="card-header">
                  <h5 className="text-center">
                    Temperatura corporal{" "}
                    <span>
                      <i className="fa fa-thermometer-empty"></i>
                    </span>
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-6 d-grid gap-2">
                      <button className="btn btn-outline-primary" type="button">
                        Tiempo real
                      </button>
                    </div>
                    <div className="col-6  d-grid gap-2">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTemperature"
                        aria-expanded="false"
                        aria-controls="collapseTemperature"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="collapse" id="collapseTemperature">
                        <p>Registros anteriores</p>
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
