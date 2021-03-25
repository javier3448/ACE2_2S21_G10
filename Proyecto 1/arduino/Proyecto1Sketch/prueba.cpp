#include "prueba.h"

#include "mygps.h"
#include "mybluetooth.h"

Prueba::State Prueba::stateActual;
Prueba::Posicion Prueba::posicionInicial;
Prueba::Repeticion Prueba::repeticionActual;

void Prueba::setup()
{
    Prueba::stateActual = State::STOP;
    posicionInicial = {
        latitud : 0,
        longitud : 0,
        age : 0
    };
    repeticionActual = {
        numeroDeRep : 0,
        posicionInicial : {
            latitud : 0,
            longitud : 0,
            age : 0
        },
        tiempoInicial : 0,
    };
}

// @note: para estar en el estado stop, `prueba` deberia de estar en un valor 'sentinel'
// y START lo que hace es pasar a un valor inicial, ya sea desde un 'sentinel' o 
// desde el estado anterio

void Prueba::loop()
{
    switch(stateActual)
    {
        case State::STOP:
        {
            if(digitalRead(BUTTON_START_PIN)){
                stateActual = State::START;
            }
        }

        case State::START:
        {
            float currLatitud;
            float currLongitud;
            unsigned long currAge;
            MyGps::gps.f_get_position(&currLatitud, &currLongitud, &currAge);

            posicionInicial.latitud = currLatitud;
            posicionInicial.longitud = currLongitud;

            repeticionActual = {
                numeroDeRep : 1,
                posicionInicial : {
                    latitud : currLatitud,
                    longitud : currLongitud,
                    age : currAge
                },
                tiempoInicial : millis(),
            };

            MyBluetooth::restartSendToBluetoothEverySecond();

            stateActual = State::PLAY;
        }

        case State::PLAY:
        {

            if(digitalRead(BUTTON_QUIT_PIN)){
                //@TODO: rendirse
            }

            // @TODO:
            // if(ritmoCardiacoAlto()){
            //    fallarPrueba
            // }

            // siguiente repeticion cada minuto
            float currTimeRepeticion = millis();
            float deltaTimeRepeticion = currTimeRepeticion - repeticionActual.tiempoInicial;
            if(deltaTimeRepeticion >= 1000 * 60){
                float currLatitud;
                float currLongitud;
                unsigned long currAge;
                MyGps::gps.f_get_position(&currLatitud, &currLongitud, &currAge);

                repeticionActual = {
                    numeroDeRep : repeticionActual.numeroDeRep + 1,
                    posicionInicial : {
                        latitud : currLatitud,
                        longitud : currLongitud,
                        age : currAge
                    },
                    tiempoInicial : millis(),
                };
            }

            MyBluetooth::sendToBluetoothEverySecond();

            return;
        }
    }
}
