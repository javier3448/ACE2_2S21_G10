#include <SoftwareSerial.h>
#include <Wire.h>

#include <TinyGPS.h>

#include "pindefs.h"

#include "prueba.h"
#include "mygps.h"
#include "mymax30102.h"

// @TODO: Valores sentinela

// @TODO: traducir todo lo que esta en ingles


void setup()
{
    Serial.begin(9600);

    // setup buttons
    {
        pinMode(BUTTON_START_PIN, INPUT_PULLUP);
        pinMode(BUTTON_QUIT_PIN, INPUT_PULLUP);
    }

    // setup temperatura
    {
        // Para el sensor de temperatura (LM45DZ) tome referencia analoga de 0 a 1.1V
        // Arduino uno:
        analogReference(INTERNAL);      // Arduino uno
        //analogReference(INTERNAL1V1); // Arduino mega
    }

    MyMax30102::setup();

    MyGps::setup();

    Prueba::setup();
}

void loop()
{  

    MyGps::loop();

    MyMax30102::loop();

    Prueba::loop();
}

