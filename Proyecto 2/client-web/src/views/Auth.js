import React from 'react';
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import './auth.css'

const Auth = ({ children }) => {
  const auth = useAuth();
  const { state } = useLocation();
  if (auth.user) {
    return <Redirect to={state?.from || '/'} />;
  }
  return (
    <div className="grad">
      <div className="container vh-100 overflow-auto">
        <div className="row align-items-center h-100">
          {children}
        </div>
      </div>
    </div>
  );

}

export default Auth;