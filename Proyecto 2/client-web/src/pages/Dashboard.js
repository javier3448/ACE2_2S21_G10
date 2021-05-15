import InfoUser from 'components/info-user/InfoUser';
import Chart from 'components/chart/Chart';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>
          WristSmart
        </h1>
        <InfoUser />
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 my-2">
          <div className="list-group border border-dark">
            <div className="list-group-item bg-dark text-light">
              <div className="row">
                <div className="col-3 text-begin">Entrenamientos</div>
                <div className="col-9 text-end">Marca de tiempo</div>
              </div>
            </div>
            <div className="list-group-item list-group-item-action text-dark">
              <div className="row">
                <div className="col-3 text-begin">1</div>
                <div className="col-9 text-end">14/05/2021 19:38</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-md-6 col-sm-12 col-xs-12 my-2">
          <Chart />
        </div>
      </div>
    </>
  );
}

export default Dashboard;