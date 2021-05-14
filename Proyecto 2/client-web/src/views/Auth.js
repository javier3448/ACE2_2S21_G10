import Carousel from 'components/carousel/Carousel';
import { useAuth } from "hooks/useAuth";
import React from 'react';
import { Redirect, useLocation } from "react-router-dom";
import './auth.css';

const Auth = ({ children }) => {
  const auth = useAuth();
  const { state } = useLocation();
  if (auth.user) {
    return <Redirect to={state?.from || '/'} />;
  }
  return (
    <div className="grad overflow-auto">
      <div className="container vh-100">
        <div className="row align-items-center h-100">
          <div className="border-0 rounded shadow-lg bg-mesh p-0">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-6 col-md-6 d-none d-md-block">
                <Carousel />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Auth;