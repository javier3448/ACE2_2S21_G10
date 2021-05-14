#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

#include "simpleevents.h"
#include "mymax30102.h"

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
SimpleEvents simpleEvents = SimpleEvents();

constexpr char* initialMessageFirstLine = "toggle: ";
constexpr int8_t initialMessageFirstLineLength = 8;
constexpr char* initialMessageSecondLine = "currTime: ";
constexpr int8_t initialMessageSecondLineLength = 10;

void setup()
{
    Serial.begin(9600);

    { //setup lcd
        lcd.init();                      // initialize the lcd 
        lcd.backlight();

        lcd.setCursor(0, 0);
        lcd.print(initialMessageFirstLine);
        lcd.setCursor(0, 1);
        lcd.print(initialMessageSecondLine);
    }


    { // setup events
        simpleEvents.addEvent(0, 750, printInLcd);
        simpleEvents.addEvent(1, 500, printRitmo);
    }

    MyMax30102::setup();
}

void printInLcd()
{
    static byte toggle = 0;
    toggle = toggle ^ 1;
    lcd.setCursor(initialMessageFirstLineLength, 0);
    lcd.print(toggle);
    lcd.setCursor(initialMessageSecondLineLength, 1);
    lcd.print(millis());
}

void printRitmo()
{
    float ritmoCardiaco = MyMax30102::ritmoCardiaco;
    float oxigeno = MyMax30102::oxigeno;
    Serial.print("ritmo cardiaco: ");
    Serial.println(ritmoCardiaco);
    Serial.print("oxigeno: ");
    Serial.println(oxigeno);
}

void loop()
{
    simpleEvents.loop();
    MyMax30102::loop();
}
