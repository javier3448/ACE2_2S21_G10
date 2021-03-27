// @TODO: cambiar nombre de este .h al nombre de la prueba (course-navetee)
#include "prueba.h"

#include "mygps.h"
#include "mybluetooth.h"

Prueba::State Prueba::stateActual;
Prueba::Posicion Prueba::posicionInicial;
Prueba::Repeticion Prueba::repeticionActual;

// @Mejora?: poner Bomba y buzzer en su propio archivo, creo que el hecho que 
// llamemos a Bomba::loop y ::setup desde aqui es algo confuso.
namespace Bomba{
    bool isActive;
    long startTime;

    void setup()
    {
        isActive = false;
        startTime = 0;
        pinMode(MOTOR_PIN, OUTPUT);
    }

    void empezarDosSegundosDeBombeo()
    {
        digitalWrite(MOTOR_PIN, HIGH);
        isActive = true;

        startTime = millis();
    }

    void loop()
    {
        if(!isActive) return;

        long deltaTime = millis() - startTime;
        if(deltaTime > 2000){
            digitalWrite(MOTOR_PIN, LOW);
            isActive = false;
        }
    }
}

namespace Buzzer{
    bool isActive = false;
    long startTime = 0;

    void setup()
    {
        isActive = false;
        startTime = 0;
        pinMode(BUZZER_PIN, OUTPUT);
    }
    void empezarDosSegundosDeTono()
    {
        tone(BUZZER_PIN, 1000);
        // digitalWrite(BUZZER_PIN, HIGH);
        isActive = true;

        startTime = millis();
    }
    static void loop()
    {
        if(!isActive) return;

        long deltaTime = millis() - startTime;
        if(deltaTime > 2000){
            noTone(BUZZER_PIN);
            isActive = false;
        }
    }
}

void Prueba::setup(){
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

    Bomba::setup();
    Buzzer::setup();
}

// @note: para estar en el estado stop, `prueba` deberia de estar en un valor 'sentinel'
// y START lo que hace es pasar a un valor inicial, ya sea desde un 'sentinel' o 
// desde el estado anterio

void Prueba::loop()
{
    // Las cosas que corren por x cantidad de segundos corren sin importar el valor
    // de stateActual (cosas como inflar globo por 2 segundos, buzzer de 2 segundos)
    // gameStateIndependentEvents()
    Bomba::loop();
    Buzzer::loop();

    switch(stateActual)
    {
        case State::STOP:
        {
            if(!digitalRead(BUTTON_START_PIN))
            { 
                { //stuff we need to do before we go to State::PLAY for the first time
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

                    MyBluetooth::Paquete::headerPaquete = MyBluetooth::HeaderPaquete::CORRIENDO;
                    MyBluetooth::restartSendToBluetoothEverySecond();
                }
                stateActual = State::PLAY;
            }
        }break;

        case State::PLAY:
        {

            if(!digitalRead(BUTTON_QUIT_PIN)){
                Bomba::empezarDosSegundosDeBombeo();
                // @TODO:
                // MyBluetooth::sendQuitPackateNow();
                stateActual = State::STOP;
            }

            // @TODO: SIMPLIFICAR EL CODIGO BLUETOOTH

            // @TODO:
            // if(ritmoCardiacoAlto()){
            //    fallarPrueba (inflar globo 2 segundos)
            // }

            // siguiente repeticion cada minuto
            long currTimeRepeticion = millis();
            long deltaTimeRepeticion = currTimeRepeticion - repeticionActual.tiempoInicial;
            if(deltaTimeRepeticion >= 1000l * 60l)
            {
                if(repeticionActual.numeroDeRep >= 21){
                    // @TODO:
                    //Terminar prueba exitosamente

                }
                else{
                    //Ir a siguiente repeticion
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
                        tiempoInicial : currTimeRepeticion,
                    };

                    Serial.println("siguiente repeticion");
                    Buzzer::empezarDosSegundosDeTono();
                }
            }

            MyBluetooth::sendToBluetoothEverySecond();
        }break;
    }
}
