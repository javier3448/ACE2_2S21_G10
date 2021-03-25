#include "mygps.h"

SoftwareSerial MyGps::gpsSerial(GPS_RX, GPS_TX);
TinyGPS MyGps::gps;

void MyGps::setup()
{
    gpsSerial.begin(9600); 
}

// @TODO: better name 
void MyGps::loop()
{
    // encode gps sentences, the resulting data is in the MyGps::gps object
    while(gpsSerial.available())
    {
        char c = gpsSerial.read();
        // Serial.write(c); // uncomment this line if you want to see the GPS data flowing
        gps.encode(c);
    }
}
