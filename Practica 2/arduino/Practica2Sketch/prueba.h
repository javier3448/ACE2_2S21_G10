
#ifndef _PRUEBA_h
#define _PRUEBA_h
#include "pindefs.h"

namespace Prueba {

enum State{
        PLAY,
        STOP
    };

     struct Repiticion{
        int8_t repeticionActual;
        int8_t direccion;
    	float weight;
    	float tiempo; 
    	float volumen;
    	float vomax;
    };
  
void setup();
void loop();
  extern State stateActual;

#endif
}
