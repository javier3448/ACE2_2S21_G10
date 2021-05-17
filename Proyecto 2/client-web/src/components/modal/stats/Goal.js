import React from 'react';

/**
 * 
 * @param {{id:any,goal:{remain:number, reached:number, goal:number, prevCals: number, goalCals:number, actualCals: number}}} param0 
 * @returns 
 */
const Goal = ({ goal, id }) => {
  /// Calcula las calorías que se han logrado
  var reachedCals = goal.actualCals - goal.prevCals;
  /// Calcula las calorías que faltan
  var remainCals = goal.goalCals - reachedCals;
  /// Si remainCals es negativo o 0, ya se superó la meta
  if (remainCals <= 0) {
    reachedCals = goal.goalCals;
    remainCals = 0;
  }
  /// Renderiza el componente
  return (
    <div className="modal fade" tabIndex="-1" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Informe de meta actual</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-row-reverse">
            </div>
            <table className="table table-sm text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="border-start border-dark">Meta</th>
                  <th>Logrado</th>
                  <th>Pendiente</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold border-end border-bottom-0 border-dark">Entrenamientos</td>
                  <td className="border-0">{goal.goal}</td>
                  <td className="border-0">{goal.reached}</td>
                  <td className="border-0">{goal.remain}</td>
                </tr>
                <tr>
                  <td className="fw-bold border-end border-bottom-0 border-dark">Calorias</td>
                  <td className="border-0">{goal.goalCals}</td>
                  <td className="border-0">{reachedCals}</td>
                  <td className="border-0">{remainCals}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goal;