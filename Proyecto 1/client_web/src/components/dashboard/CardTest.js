import React from "react";
import { Link } from "react-router-dom";
export default function CardTest(props) {
  const data = props.data;
  const testName = data.testName;
  const textIcon = data.textIcon;
  const link = data.link;
  return (
    <div className="card">
    <div className="card-header">
      <h5 className="text-center">
        {testName + " "}
        <span>
          <i className={"fa " + textIcon}></i>
        </span>
      </h5>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col-6 d-grid gap-2">
          <Link className="btn btn-outline-primary" to={`/athlete/stats/${link}`} >
            Tiempo real
          </Link>
        </div>
        <div className="col-6 d-grid gap-2">
          <Link className="btn btn-outline-success" to={`/athlete/stats-history/${link}`}>
            Historial
          </Link>
        </div>
      </div>
    </div>
  </div>
  ) 
}