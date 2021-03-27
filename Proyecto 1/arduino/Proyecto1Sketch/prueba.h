// prueba.h
// Tiene toda la logica de la prueba

#ifndef _PRUEBA_h
#define _PRUEBA_h

#include "pindefs.h"
// @MEJORA?: dada la descripcion del .h talvez sea mejor aqui manejar los 'timings'

// @Decision: para sacar las distancias asumimos que todo el recorrido es linea recta

namespace Prueba {

    enum State{
        PLAY,
        STOP
    };

    struct Posicion{
        float latitud;
        float longitud;
        // Nos da una idea vaga de que tan mala :/ es nuestra lectura
        // numero de milisegundos desde que el gps indico esa posion hasta que nos
        // la envio. creo
        unsigned long age;
    };

    struct Repeticion{
        // [!] numeroDeRep 0 significa una repeticion no valida, => numeroDeRep va de 
        // 1 a 21
        int8_t numeroDeRep;
        Posicion posicionInicial;
        long tiempoInicial;
    };

    extern State stateActual;

    // @Mejora: esta posicionInicial es algo confusa con la de la repeticion actual
    // usar otro nombre
    extern Posicion posicionInicial;

    extern Repeticion repeticionActual;


    void setup();
    void loop();
}


#endif