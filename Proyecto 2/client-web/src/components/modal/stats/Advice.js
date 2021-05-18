import QSD from 'components/modal/stats/QSD';
import { max, mean, min, std } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getArray } from 'services/stats';
import Dispersion from './Dispersion';

/**
 * Modal que desplegará recomendaciones basado en el 
 * coeficiente de desviación para el ritmo cardiaco
 * para un repetición en particular
 * @param {{id:number}} param0 
 * @returns 
 */
const Advice = () => {
  /// Recupera el número de repetición
  /// que se obtiene desde la ruta
  const { lap } = useParams();
  /// Declara hook para almacenar
  /// el coeficiente de varianza
  const [qSd, setQSD] = useState();
  const [avg, setAvg] = useState();
  const [minV, setMin] = useState();
  const [maxV, setMax] = useState();
  useEffect(() => {
    if (lap) {
      getArray(lap).then((data) => {
        const dataSet = data.map((value) => {
          return Number(value.ritmo);
        });
        /// Calcula la desviación estándar
        const sd = std(dataSet);
        /// Calcula el promedio
        const avg = mean(dataSet);
        /// Recupera el mínimo y el máximo
        setMin(min(dataSet));
        setMax(max(dataSet));
        setAvg(avg);
        /// Calcula el coeficiente de
        /// desviación estándar
        const qSd = sd / avg;
        setQSD(qSd);
      }).catch((e) => console.error(e));
    }
  }, [lap]);
  /// Controla la acción para el click de la etiqueta anchor
  const handleClick = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  if (!lap) return <></>;
  return (
    <>
      <div className="d-grid gap-2 mb-2">
        <button type="button"
          className="btn btn-outline-dark"
          data-bs-toggle="modal" data-bs-target="#adviceModal">
          <i className="fa fa-check"></i>{' '}
        Recomendaciones
      </button>
      </div>
      <div className="modal fade" tabIndex="-1" id="adviceModal" aria-hidden="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Recomendaciones (repetición no. {lap})</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <table className="table table-sm">
                    <thead className="align-middle text-center">
                      <tr>
                        <th colSpan="4">Ritmo cardíaco</th>
                      </tr>
                      <tr>
                        <th>Promedio</th>
                        <th>Máximo</th>
                        <th>Mínimo</th>
                        <th>Coeficiente<br /> de desviación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td>{avg ? avg.toFixed(2) : ''}</td>
                        <td>{maxV ? maxV.toFixed(2) : ''}</td>
                        <td>{minV ? minV.toFixed(2) : ''}</td>
                        <td>{qSd ? qSd.toFixed(2) : ''}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="row">
                    <div className="col">
                      <QSD lap={lap} qSd={qSd} />
                    </div>
                    <div className="col">
                      <Dispersion avg={avg} />
                      <div className="d-grid gap-2 mt-2">
                        <button
                          className="btn btn-info"
                          onClick={() => handleClick('https://www.mayoclinic.org/es-es/healthy-lifestyle/fitness/in-depth/exercise-intensity/art-20046887#:~:text=C%C3%B3mo%20elegir%20la%20intensidad%20del%20ejercicio')}
                          type="button">Más info</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default Advice;