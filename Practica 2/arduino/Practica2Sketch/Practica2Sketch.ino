#include <SoftwareSerial.h>

#include "pindefs.h"

SoftwareSerial btSerial(BT_RX, BT_TX);

void setup()
{
    Serial.begin(9600);

    pinMode(LED_BUILTIN, OUTPUT);

    // Setup bluetooth
    {
        // btSerial = SoftwareSerial(BT_RX, BT_TX);
        btSerial.begin(38400);
        pinMode(BT_STATE, OUTPUT);
    }
}

int count = 0;
void loop()
{  
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);

    btSerial.print("hello ");
    btSerial.println(count);
    Serial.print("hello ");
    Serial.println(count);

    count++;
}
