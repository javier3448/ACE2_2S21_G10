// mybluetooth.h
// todo lo relacionado con el modulo bluetooth, y la empaquetacion de los mensajes
// hay que escribirle a las globales para que eventualmente se envie

#ifndef _MYBLUETOOTH_h
#define _MYBLUETOOTH_h

#include "pindefs.h"

#include <SoftwareSerial.h>

// [!!!]
// @MEJORA?: que reciba como parametro todo el paquete no porque hay que 'armarlo'
// (conseguir los datos de gps, la temp, etc) y quiero hacer solo cuando ya va 
// ser enviado i.e. cada segundo
// tener un global: minutePackage, con lo que necestiamos enviar y tener un struct
// con que lleva el paquete y tener un MyBluetooth::loop que mantenga esos 
// 'eventos temporizados'


// @DECISION: vamos a mandar distancias en vez de coordenadas porque son menso bytes,
// son faciles de obtener con la libreria TinyGps y son faciles de entender

// @DECISION: No vamos a hacer ningun calculos de promedio, minimo y maximo desde
// el arduino porque no quiero que el 'paquete bluetooth' sea muy pesado. Mejor desde
// android. ()

// @Mejora?: deberiamos enviar age?? como, si lo que enviamos es distancia?

// son faciles de obtener con la libreria TinyGps y son faciles de entender

// Necesitamos, enviar la logica de juego para que del otro lado puedan ir acumulando
// los datos necesarios para guardar una prueba completa Y los datos necesarios
// para presentar los reportes de tiempo real

// Example of bluetooth message encoding (ignore linejumps or blank spaces)
// Si estado no es 0 el resto del paquete no tiene datos validos
// $

// headerPaquete| 
// distanciaTotalPrueba|

// repeticionActual|
// distanciaRepeticionActual|
// velocidadTiempoReal|

// temperatura|
// ritmo|
// oxigeno|
// latitud|
// longitud|
// age
//;

namespace MyBluetooth {

    //(0:corriendo, 1:se rendio, 2:fallo prueba)
    enum HeaderPaquete : byte{
        CORRIENDO = 0,
        RENDIDO = 1,
        FALLADO = 2,
    };

    namespace Paquete{

        extern HeaderPaquete headerPaquete; 

        extern float ritmoCardiaco;
        extern float oxigeno;
    }

    // [!!!]: not 'comprehensive' i.e. the real Paquete includes things that are not
    // listed in this namespace, because a lot of the data we will send can be obtained 
    // 'on the spot' right as we build the Paquete

    // @TODO: escribir detalladamente que lleva el paquete y en que parte del codigo
    // 'mantememos' esas globales

    extern SoftwareSerial btSerial;

    void setup();
    // @TODO: better name for these 2
    void restartSendToBluetoothEverySecond();
    // @TODO: nombre que nos indique que este codigo debe corre 'concurrentemente'
    // ie que adentro lidea con todo el estado que implica llevar un DeltaTime
    void sendToBluetoothEverySecond();
}

#endif
