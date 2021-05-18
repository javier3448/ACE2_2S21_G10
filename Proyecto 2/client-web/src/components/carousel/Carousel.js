import React from 'react';
import io from 'assets/aerobic-exercise1.jpg'
import './carousel.css'

const Carousel = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel carousel-dark slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={io} 
            className="d-block rounded-start" 
            alt="..." 
            width={"100%"}/>
          <div className="carousel-caption d-none d-sm-block">
            <h5>Visualiza los avances de tu repetición</h5>
            <p>
              Con la tecnología de WristSmart podrás conocer datos sobre tu ritmo
              cardíaco, temperatura, nivel de oxígeno y calorías quemadas en
              tiempo real.
            </p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={io} 
            className="d-block rounded-start" 
            alt="..." 
            width={"100%"}/>
          <div className="carousel-caption d-none d-sm-block">
            <h5>¿Quieres saber qué tanto has avanzado?</h5>
            <p>
              Todos los datos de las repeticiones se guardan.
              Desde tu computadora puedes comparar tus datos actuales con los anteriores
            </p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={io} 
            className="d-block rounded-start" 
            alt="..." 
            width={"100%"}/>
          <div className="carousel-caption d-none d-sm-block">
            <h5>Solo debes ver tu muñeca</h5>
            <p>
              No es necesario que monitorees tu repetición desde una computadora,
              bastará con ver la pantalla LCD que WristSmart tiene integrada.
            </p>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;