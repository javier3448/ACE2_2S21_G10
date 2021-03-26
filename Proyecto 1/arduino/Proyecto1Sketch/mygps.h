// prueba.h
// todo lo relacionado con el gps, hicimos este .h porque queremos
// acceder al objeto `gps` desde el .ino y desde prueba.cpp

#ifndef _MYGPS_h
#define _MYGPS_h

#include "pindefs.h"

#include <SoftwareSerial.h>
#include <TinyGPS.h>

namespace MyGps {

    extern SoftwareSerial gpsSerial;
    extern TinyGPS gps;

    void setup();
    void loop();
}


#endif
