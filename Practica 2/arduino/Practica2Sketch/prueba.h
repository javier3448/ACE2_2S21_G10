#ifndef PRUEBA_h
#define PRUEBA_h

#include "pindefs.h"

#include <SoftwareSerial.h>

namespace Prueba {

    // @TODO: describir cada estado
    enum State{
        INITIAL,
        WAIT_OK,
        PLAY
    };

    extern State stateActual;

    extern SoftwareSerial btSerial;
    extern float peso;

    void setup();
    void loop();

}

#endif
