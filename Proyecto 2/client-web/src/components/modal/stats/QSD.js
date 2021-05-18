import React from 'react';

/**
 * 
 * @param {{lap: number, avg:number, min:number, max:number, qSd:number}} param0 
 */
const QSD = ({lap, qSd}) => {
  if (qSd <= 0.30) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Parece que tienes buena resistencia.</strong>
        <p>
          Para la repetición {lap} tu ritmo cardíaco ha sido estable. 
        </p>
        <p style={{textAlign:'justify'}}>
          Esto es un buen indicador. Sin embargo, también es posible
          que tu cuerpo ya se haya aclimatado a tu rutina de ejercicios
          actual. Procura variar tu rutina para mejorar tus resultados a
          largo plazo.
        </p>
      </div>
    );
  } else if (qSd > 0.30 &&  qSd <= 0.50) {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>¡No te rindas tu resistencia puede mejorar!</strong>
        <p>
          Para la repetición {lap} tu ritmo cardíaco ha variado.
        </p>
        <p style={{textAlign:'justify'}}>
          Antes de comenzar tu rutina de ejercicios procura calentar, de esta
          forma estarás más aclimatado. Evita realizar ejercicios
          que aún no soportes. <strong>Si te quedas sin aire, evita ese ejercicio.</strong>
        </p>
      </div>
    );
  } else if (qSd > 0.5 ) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Quizá debas cambiar tu rutina.</strong>
        <p>
          Para la repetición {lap} tu ritmo cardíaco ha variado mucho.
        </p>
        <p style={{textAlign:'justify'}}>
          Tu ritmo cardíaco ha sido muy inestable. Lo mejor será que disminuyas
          la intensidad de tu ejercicio.
        </p>
        <p style={{textAlign:'justify'}}>
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