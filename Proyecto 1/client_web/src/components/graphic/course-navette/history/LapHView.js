import React from 'react';

export default function LapHView(props) {
  return (
    <>
      <div className="accordion-item">
        <h2 className="accordion-header" id={"heading_"+props.i}>
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse_"+props.id} aria-expanded="false" aria-controls={"collapse_"+props.id}>
            {props.result.hora + " hrs"}
      </button>
        </h2>
        <div id={"collapse_"+props.id} className="accordion-collapse collapse" aria-labelledby={"heading_"+props.i} data-bs-parent={"#"+props.parent}>
          <div className="accordion-body">
            <div className="row">
              <div className="col-9">
                ¿Falló?
              </div>
              <div className="col-3">
                {props.result.fallos}
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                ¿Aprobó?
              </div>
              <div className="col-3">
                {props.result.aprobo}
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                Repeticiones
              </div>
              <div className="col-3">
                {props.result.repeticiones}
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                Entrenamiento
              </div>
              <div className="col-3">
                {props.result.entrenamiento.split(' ')[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}