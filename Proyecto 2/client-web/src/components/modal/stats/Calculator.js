import React, { useEffect, useState } from 'react';
import { getHeart } from 'services/stats';
import { getLaps } from 'services/calories';

const Calculator = ({ id }) => {
  /// Guarda el promedio de ritmo cardíaco
  const [avg, setAvg] = useState(0);
  /// Guarda la meta de calorías
  const [cal, setCal] = useState(0);
  /// 
  const [laps, setLaps] = useState(0);
  useEffect(() => {
    /// Recupera el promedio del corazón
    getHeart().then((data) => {
      setAvg(data.avg);
    }).catch((e) => console.error(e));
  }, []);

//  const handleChange = () => {
//    setLaps(laps(avg, cal));
  //}

  return (
    <div className="modal fade" tabIndex="-1" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Calculadora de entrenamientos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p className="lh-sm" style={{textAlign: 'justify'}}>
              La calculadora toma por defecto tu promedio de ritmo cardiaco para todos los entrenamientos.
            </p>
            <p className="lh-sm" style={{textAlign: 'justify'}}>
              Especifíca tu meta de calorías, y si quieres, modifica el ritmo cardíaco para averiguar
              cuantos entrenamientos deberás realizar para alcanzar tu meta.
            </p>
            <div className="row">
              <div className="col-7">
                <div className="mb-2">
                  <label for="txtCal" className="form-label fw-light">Meta de calorías</label>
                  <input id="txtCal" type="number" step="0.01" min="1"
                    value={cal} onChange={(e) => setCal(e.target.value)}
                    onBlur={() => setLaps(getLaps(avg, cal))}
                    className="form-control" />
                </div>
                <div className="mb-2">
                  <label for="txtAvg" className="form-label fw-light">Ritmo cardíaco</label>
                  <input id="txtAvg" type="number" step="0.01" min="1"
                    value={avg} onChange={(e) => setAvg(e.target.value)}
                    onBlur={() => setLaps(getLaps(avg, cal))}
                    className="form-control" />
                </div>
              </div>
              <div className="col-5">
                <div className="card h-100 p-1">
                  <div className="card-body" style={{ backgroundColor: 'orange' }}>
                    <div className="d-flex align-items-start flex-column bd-highlight">
                      <div className="mb-auto p-2 bd-highlight h2">{laps + ' '}<i className="fa fa-running"></i></div>
                      <p className="p-2 bd-highlight">Entrenamientos</p>
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

export default Calculator