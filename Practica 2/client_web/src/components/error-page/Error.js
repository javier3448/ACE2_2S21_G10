import React from "react";
import { Link } from "react-router-dom";

export default function ErrorView(props) {
  const errorType = () => {
    return (
      <div className="col">
        <h1>
          <span>
            <i className="fa fa-exclamation-circle"></i>{" "}
          </span>
          {props.data.error}
        </h1>
      </div>
    );
  };

  return (
    <div className="container vh-100">
      <div className="row align-items-center h-100">
        {errorType()}
        <div className="col">
          <Link to="/dashboard" className="btn btn-lg btn-primary">
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
