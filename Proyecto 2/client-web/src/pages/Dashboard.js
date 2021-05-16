import axios from 'axios';
import { urlServer } from 'config';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from 'services/user';

const Dashboard = () => {
  useEffect(()=> {
    const userInfo = getUser();
    const endpoint = urlServer + `obtener-calorias/${userInfo.IdUser}`;
    axios.get(endpoint)
      .then((response) => {
        if (response.data) {

        }
      })
      .catch((e) => {console.error(e)});
  }, []);
  return (
    <>
      <div className="row gap-0">
        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-2">
          <div className="card rounded">
            <div className="card-body">
              <div className="card-title h2">
                Entrenamientos
              </div>
              <div className="d-grid gap-2">
                <Link to='/realtime' className="btn btn-outline-dark">
                  Actual{' '}
                  <i className="fa fa-arrow-alt-circle-right"></i>
                </Link>
                <Link to='/stats' className="btn btn-outline-dark">
                  Anteriores{' '}
                  <i className="fa fa-arrow-alt-circle-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
          <div className="card rounded bg-primary">
            <div className="card-body text-light">
              <div className="card-title h2">24</div>
              Entrenamientos
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
          <div className="card rounded bg-secondary">
            <div className="card-body text-light">
              <div className="card-title h2">1953</div>
              Calorías quemadas
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;