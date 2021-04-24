#include "pindefs.h"

// @debug:
#include "util.h"
#include "simpleevents.h"
#include "yfs201.h"

#include "prueba.h"

SimpleEvents simpleEvents = SimpleEvents();

// void printYfs()
// {
// }

// @TODO!!: Ponerlo adentro del setup
long lastTime;

void setup()
{
    Serial.begin(9600);

    // setup sensor flujo YFS-201
    Yfs201::setup();
    lastTime = millis();

    // setup button de confirmacion
    pinMode(OK_BUTTON_PIN, INPUT_PULLUP); //boton inicio

    // simpleEvents.addEvent(0, 100, printYfs);

    Prueba::setup();
}

// @TODO!!: Ponerlo adentro del setup
// Exhalar: false
bool direccion = false;
bool allowFlowChange = true;
float volumenEnPulmones = 0;

void loop()
{
    Prueba::loop();
}