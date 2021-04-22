#include "pindefs.h"

#include <SoftwareSerial.h>

// @debug:
#include "util.h"
#include "simpleevents.h"

#include "yfs201.h"

SoftwareSerial btSerial(BT_RX, BT_TX);

SimpleEvents simpleEvents = SimpleEvents();

void printYfs()
{
    Serial.print("direccion, volumen: ");
    Serial.print(Yfs201::direccion);
    Serial.print(", ");
    Serial.println(Yfs201::volumenEnPulmones);
}

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

    simpleEvents.addEvent(0, 100, printYfs);
}

void loop()
{
    Yfs201::loop();

    simpleEvents.loop();
}