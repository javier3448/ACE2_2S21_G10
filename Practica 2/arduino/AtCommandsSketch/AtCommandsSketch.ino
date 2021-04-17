#include <SoftwareSerial.h>

#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

SoftwareSerial btSerial(BT_RX, BT_TX);

// Before powering the Arduino just hold the push button pressed and then power 
// your Arduino, as a result you will have the LED blinking in an interval of 
// 2 seconds which indicates the successful entering of the AT command mode. 

// In order to start the settings we run the serial monitor and we set the baud 
// rate to 9600 and *both NL & carriage return*

// commands: https://www.teachmemicro.com/hc-05-bluetooth-command-list/
char c=' ';
void setup() 
{
    Serial.begin(9600);
    Serial.println("ready");
    btSerial.begin(38400);
}

void loop() 
{
    if(btSerial.available())
    {
        c=btSerial.read();
        Serial.write(c);
    }
    if(Serial.available())
    {
        c=Serial.read();
        btSerial.write(c);
    }
}
