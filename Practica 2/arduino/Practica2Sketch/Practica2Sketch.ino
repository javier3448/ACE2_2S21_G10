#include "pindefs.h"

#include <SoftwareSerial.h>

// @debug:
#include "util.h"
#include "simpleevents.h"

// bmp280
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp1(BMP_CSB1);
Adafruit_BMP280 bmp2(BMP_CSB2);

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

    { // setup bmp280_1
        Serial.println("Starting BMP280 device 1...");

        if (!bmp1.begin()) {
            Serial.println("Sensor BMP280 device 1 was not found.");
            // @TODO: signal that bmp1 was not found by blinking led or something...
            while (1);
        }
        Serial.println("Initialize BMP280 1 completed.");
    }

    { // setup bmp280_2
        Serial.println("Starting BMP280 device 2...");

        if (!bmp2.begin()) {
            Serial.println("Sensor BMP280 device 2 was not found.");
            // @TODO: signal that bmp1 was not found by blinking led or something...
            while (1);
        }
        Serial.println("Initialize BMP280 2 completed.");
    }

    // setup sensdor flujo YSf-

    // Setup simpleEvents
}

int count = 0;
void loop()
{
    static auto toggle = HIGH;

    delay(200);

    // No deberiamos de usar el LED_BUILTIN porque SPI lo usa (pin 13 en arduino uno)
    // digitalWrite(LED_BUILTIN, toggle);
    // if(toggle == HIGH){
    //     toggle = LOW;
    // }
    // else{
    //     toggle = HIGH;
    // }

    { // loop bmp280_1
        float pressure1 = bmp1.readPressure() / 100.0;

        Serial.print("Pressure 1 = ");
        Serial.print(pressure1);
        Serial.print("Pa,   ");

        btSerial.print("Pressure 1 = ");
        btSerial.print(pressure1);
        btSerial.print("Pa,   ");
    }


    { // loop bmp280_2
        float pressure2 = bmp2.readPressure() / 100.0;

        Serial.print("Pressure 2 = ");
        Serial.print(pressure2);
        Serial.print("Pa,   ");

        btSerial.print("Pressure 2 = ");
        btSerial.print(pressure2);
        btSerial.print("Pa,   ");
    }

    Serial.println();
    btSerial.println();

    count++;
}