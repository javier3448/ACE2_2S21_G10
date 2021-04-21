#include "pindefs.h"

#include <SoftwareSerial.h>

// @debug:
#include "util.h"
#include "simpleevents.h"

#include "yfs201.h"

SoftwareSerial btSerial(BT_RX, BT_TX);

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
}

void loop()
{
    Yfs201::loop();
}