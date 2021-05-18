import React from 'react';
import { getUser } from 'services/user';

/**
 * 
 * @param {{avg:number}} param0 
 * @returns 
 */
const Dispersion = ({ avg }) => {
  const age = getUser().edad;
  const maxRitmo = 220 - age;
  const fifty = maxRitmo * 0.5;
  const seventy = maxRitmo * 0.7;
  const eighty = maxRitmo * 0.85;
  if (avg > 0 && avg < fifty) {
    return (<div className="alert alert-warning m-0">
      <strong>Aumenta la intensidad</strong>
      <p style={{textAlign:'justify'}} className="m-0">
        Si quieres mejorar tu resistencia, tu promedio de ritmo cardíaco debería estar entre
        <strong>{" "+ fifty.toFixed(2) +"~" + eighty.toFixed(2)+" "}</strong>
      </p>
    </div>)
  } else if (avg >= fifty && avg < seventy) {
    return (<div className="alert alert-success m-0">
      <strong>Sigue así</strong>
      <p style={{textAlign:'justify'}} className="m-0">
        El promedio de ritmo cardíaco estuvo entre 
        {" ["+fifty.toFixed(2) +" - " + seventy.toFixed(2)+"] "}. Lo que quiere decir que 
        realizaste un ejercicio de intensidad moderada. Mantener ese ritmo ayudará
        a mejorar tu aptitud aeróbica.
      </p>
    </div>)
  } else if (avg >= seventy && avg < eighty) {
    return (<div className="alert alert-success m-0">
      <strong>Sigue así</strong>
      <p style={{textAlign:'justify'}} className="m-0">
        El promedio de ritmo cardíaco estuvo entre 
        {" "+fifty.toFixed(2) +" - " + seventy.toFixed(2)+" "}. Lo que quiere decir que 
        realizaste un ejercico de intensidad intensa. Mantener ese ritmo ayudará
        a mejorar tu aptitud aeróbica.
      </p>
      <p>
        Ten en cuenta que entre más intenso el ejercicio, mayor deberá ser el 
        descanso que le deberás dar a tu cuerpo.
      </p>
    </div>)
  } else {
    return (<div className="alert alert-danger">
      <strong>Parece que hubo un error</strong>
      <p>No es posible darte recomendaciones</p>
    </div>)
  }
}

export default Dispersion;