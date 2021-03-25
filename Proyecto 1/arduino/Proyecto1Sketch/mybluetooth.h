// mybluetooth.h
// todo lo relacionado con el modulo bluetooth, y la empaquetacion de los mensajes
// hay que escribirle a las globales para que eventualmente se envie

#ifndef _MYBLUETOOTH_h
#define _MYBLUETOOTH_h

#include "pindefs.h"

#include <SoftwareSerial.h>

namespace MyBluetooth {

    // [!!!]: not 'comprehensive' i.e. the real package includes things that are not
    // listed in this namespace, because a lot of the data we will send can be obtained 
    // 'on the spot' right as we build the package
    namespace Package{
        extern float ritmoCardiaco;
        extern float oxigeno;
    }

    extern SoftwareSerial btSerial;

    void setup();
    // @TODO: better name for these 2
    void restartSendToBluetoothEverySecond();
    // @TODO: nombre que nos indique que este codigo debe corre 'concurrentemente'
    // ie que adentro lidea con todo el estado que implica llevar un DeltaTime
    void sendToBluetoothEverySecond();
}

#endif
