// mybluetooth.h
// Todo lo relacionado con el modulo bluetooth, y la empaquetacion de los mensajes.
// Cuando vamos a enviar un paquete leemos variables globales que las clases/namespaces 
// de otros los sensores mantenienen actualizadas/validas.

#ifndef _MYBLUETOOTH_h
#define _MYBLUETOOTH_h

#include "pindefs.h"

#include <SoftwareSerial.h>

// @TODO SOON: mantener estos comentarios

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

    // Algunos 'paquetes' solo tienen el byte del header, ie tienen de tamano
    // 1 byte. Dichos paquetes son: 
    // INICIAR, INICIAR_PRUEBA, CORRIENDO_PRUEBA, FIN_EXITO, FIN_RENDICION, FIN_FALLO,
    // [estos chars ascii se escogieron arbitrariamente, pueden ser cualquier
    // caracter a excepcion: [0-9] '.' '|' ';' porque dichos caracteres pueden aparecer
    // adentro del cuerpo del paquete: CORRIENDO_PRUEBA
    enum HeaderPaquete : char{
        INICIAR_PRUEBA = '!',
        CORRIENDO_PRUEBA = '#',
        FIN_EXITO = '$',
        FIN_RENDICION = '%',
        FIN_FALLO = '&',
    };

    extern SoftwareSerial btSerial;

    void setup();

    void restartPlayNaveteePackageEverySecond();
    void sendPlayNaveteePackageEverySecond();

    void sendStartPackageNow();
    void sendSuccessPackageNow();
    void sendFailPackageNow();
    void sendQuitPackageNow();

}

#endif
