
#ifndef _PRUEBA_h
#define _PRUEBA_h
#include "pindefs.h"

namespace Prueba {

enum State{
        PLAY,
        STOP
    };
  
void setup();
void loop();
  extern State stateActual;

#endif
}
