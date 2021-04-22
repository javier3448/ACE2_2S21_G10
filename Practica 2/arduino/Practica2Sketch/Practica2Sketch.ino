#include "pindefs.h"

#include <SoftwareSerial.h>

// @debug:
#include "util.h"
#include "simpleevents.h"

#include "yfs201.h"

SoftwareSerial btSerial(BT_RX, BT_TX);

SimpleEvents simpleEvents = SimpleEvents();

// void printYfs()
// {
// }

// @TODO!!: Ponerlo adentro del setup
long lastTime;

void setup()
{
    Serial.begin(9600);

    // Setup bluetooth
    {
        // btSerial = SoftwareSerial(BT_RX, BT_TX);
        btSerial.begin(38400);
        pinMode(BT_STATE, OUTPUT);
    }

    // setup sensdor flujo YFS-201
    Yfs201::setup();
    lastTime = millis();

    // simpleEvents.addEvent(0, 100, printYfs);
}

// @TODO!!: Ponerlo adentro del setup
// Exhalar: false
bool direccion = false;
bool allowFlowChange = false;
float volumenEnPulmones = 0;

void loop()
{
    Yfs201::loop();

    //Serial.print("caudal: ");
    Serial.println(Yfs201::caudal_L_m * (direccion ? 1 : -1), 4);

    // simpleEvents.loop();
    // @TODO TUNNING: los 
    // Para determinar la direccioin del flujo no nos queda de otra mas que empezar
    // en un flujo conocido (exhalar) y cambiar de direccion cada vez que el flujo
    // sea 0, pero cuando sea 0 por varias 'iteraciones' de este loop() no queremos
    // que cambie a cada rato. 
    // Entonces se implemento algo parecido a un schmitt trigger. Que va a cambiar
    // el flujo solo cuando el flujo baje de cierto umbral(bajo, 0.01) y haya pasado en una
    // iteracion anterior otro umbral (alto, 0.05)
    // tambie le llaman: HYSTERESIS
    if(Yfs201::caudal_L_m > 0.4){
        allowFlowChange = true;
    }
    if(Yfs201::caudal_L_m < 0.4 && allowFlowChange){
        direccion = direccion ? false : true;
        allowFlowChange = false;
    }

    // @TODO: Sacar con delta time y todo eso
    // if(direccion)
    //     volumenEnPulmones += currVolumen;
    // else
    //     volumenEnPulmones -= currVolumen;
}