import React from 'react';
import io from 'assets/aerobic-exercise1.jpg'
import './carousel.css'

const Carousel = () => {
  return (
    <div id="carouselExampleCaptions" class="carousel carousel-dark slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src={io} 
            class="d-block rounded-start" 
            alt="..." 
            width={"100%"}
            
            />
          <div class="carousel-caption d-none d-sm-block">
            <h5>Visualiza los avances de tu entrenamiento</h5>
            <p>
              Con la tecnología de WristSmart podrás conocer datos sobre tu ritmo
              cardíaco, temperatura, nivel de oxígeno y calorías quemadas en
              tiempo real.
            </p>
          </div>
        </div>
        <div class="carousel-item">
          <img src={io} 
            class="d-block rounded-start" 
            alt="..." 
            width={"100%"}/>
          <div class="carousel-caption d-none d-sm-block">
            <h5>¿Quieres saber qué tanto has avanzado?</h5>
            <p>
              Todos los datos de los entrenamientos se guardan.
              Desde tu computadora puedes comparar tus datos actuales con los anteriores
            </p>
          </div>
        </div>
        <div class="carousel-item">
          <img src={io} 
            class="d-block rounded-start" 
            alt="..." 
            width={"100%"}/>
          <div class="carousel-caption d-none d-sm-block">
            <h5>Solo debes ver tu muñeca</h5>
            <p>
              No es necesario que monitorees tu entrenamiento desde una computadora,
              bastará con ver la pantalla LCD que WristSmart tiene integrada.
            </p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;