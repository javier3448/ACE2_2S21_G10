import React from 'react';

/**
 * 
 * @param {{lap: number, avg:number, min:number, max:number, qSd:number}} param0 
 */
const QSD = ({lap, qSd}) => {
  if (qSd <= 0.20) {
    return (
      <div className="alert alert-success m-0" role="alert">
        <strong>Tu ritmo cardíaco ha sido estable</strong>
        <p style={{textAlign:'justify'}} className="m-0">
          Esto es un buen indicador. Sin embargo, también es posible
          que tu cuerpo ya se haya familiarizado a tu rutina de ejercicios
          actual. Procura variar tu rutina para mejorar tus resultados a
          largo plazo.
        </p>
      </div>
    );
  } else if (qSd > 0.20 &&  qSd <= 0.50) {
    return (
      <div className="alert alert-warning m-0" role="alert">
        <strong>Tu ritmo cardíaco ha variado un poco</strong>
        <p style={{textAlign:'justify'}} className="m-0">
          Antes de comenzar tu rutina de ejercicios procura calentar, de esta
          forma estarás más preparado para un rutina moderada a intensa. 
          Evita realizar ejercicios que aún no soportes. 
          <strong>Si te quedas sin aire, evita ese ejercicio.</strong>
        </p>
      </div>
    );
  } else if (qSd > 0.5 ) {
    return (
      <div className="alert alert-danger m-0" role="alert">
        <strong>Tu ritmo cardíaco ha variado mucho</strong>
        <p style={{textAlign:'justify'}} className="m-0">
          Tu ritmo cardíaco ha sido muy inestable. Lo mejor será que disminuyas
          la intensidad de tu ejercicio o cambies tu rutina de ejercicio.
        </p>
        <p style={{textAlign:'justify'}} className="m-0">
          Asegúrate de dormir bien. Tu cuerpo también necesita tiempo para
          repararse.
        </p>
      </div>
    );
  } else {
    return <div className="alert alert-info" role="alert">
        <p>
          !Ups! parece que hubo un error, no es posible mostrarte recomendaciones
        </p>
    </div>
  }
}

export default QSD;