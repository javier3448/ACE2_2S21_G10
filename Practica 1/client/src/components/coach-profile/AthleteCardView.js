import React, { useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
export default function AthleteCard(props) {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <h4 className="card-title">
              {props.data.nombre + " " + props.data.apellidos}
            </h4>
            <Link to={`/dashboard/${props.data.IdUser}`} className="btn btn-sm btn-outline-dark">
              <span>
                <i className="fa fa-eye"></i>
              </span>
            </Link>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">Edad:</div>
            <div className="col"></div>
          </div>
          <div className="row">
            <div className="col">Sexo:</div>
            <div className="col"></div>
          </div>
          <div className="row">
            <div className="col">Estatura:</div>
            <div className="col">{props.data.altura} m.</div>
          </div>
          <div className="row">
            <div className="col">Peso:</div>
            <div className="col">{props.data.peso} lbs.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
