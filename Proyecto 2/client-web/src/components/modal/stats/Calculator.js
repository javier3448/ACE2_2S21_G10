import React, { useEffect, useState } from 'react';
import { getLaps } from 'services/calories';
import { getHeart } from 'services/stats';
/// import { setGoal } from 'services/user';

const Calculator = ({ id, actualLaps, actualCal }) => {
  /// Guarda el promedio de ritmo cardíaco
  const [avg, setAvg] = useState(0);
  /// Guarda la meta de calorías
  const [cal, setCal] = useState(0);
  /// Almacenará la cantidad de entrenamientos a realizar
  const [laps, setLaps] = useState(0);
  useEffect(() => {
    /// Recupera el promedio del corazón
    getHeart().then((data) => {
      setAvg(data.avg);
    }).catch((e) => console.error(e));
  }, []);
  /// Maneja el evento del click para el botón
  /// Almacenará en localStorage el número 
  /// de entrenamientos actuales y la meta
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   if (laps === 0) {
  //     alert('No se puede establecer una meta de 0 entrenamientos');
  //     return;
  //   }
  //   /// Recupera una posible meta ya establecida
  //   if (localStorage.getItem('goal')) {
  //     alert('Ya hay una meta establecida');
  //     return;
  //   }
  //   /// Establece una nueva meta
  //   const goal = {
  //     actualLaps,
  //     goal: laps,
  //     calories: cal,
  //     actualCal
  //   }
  //   if (setGoal(goal)) {
  //     alert('Meta establecida');
  //   } else {
  //     alert('No se pudo establecer la meta');
  //   }
  //   window.location.reload();
  // }

  return (
    <div className="modal fade" tabIndex="-1" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Calculadora de entrenamientos</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                  <label htmlFor="txtCal" className="form-label fw-light">Meta de calorías</label>
                  <input id="txtCal" type="number" step="0.01" min="1"
                    value={cal} onChange={(e) => setCal(e.target.value)}
                    onBlur={() => setLaps(getLaps(avg, cal))}
                    className="form-control" />
                </div>
                <div className="mb-2">
                  <label htmlFor="txtAvg" className="form-label fw-light">Ritmo cardíaco</label>
                  <input id="txtAvg" type="number" step="0.01" min="1"
                    value={avg} onChange={(e) => setAvg(e.target.value)}
                    onBlur={() => setLaps(getLaps(avg, cal))}
                    className="form-control" />
                </div>
              </div>
              <div className="col-5">
                <div className="card h-100 p-1">
                  <div className="card-body bg-lap text-light">
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