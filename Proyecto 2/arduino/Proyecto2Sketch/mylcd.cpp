#include "mylcd.h"

LiquidCrystal_I2C MyLcd::lcd = LiquidCrystal_I2C(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

const int8_t MyLcd::bpmSymbol = 0;
const uint8_t MyLcd::bpmSymbolMap[8] = {
    0b00000,
    0b01010,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
    0b00000,
    0b00000
};

const int8_t MyLcd::oxSymbol = 1;
const uint8_t MyLcd::oxSymbolMap[8] = {
    0b11100,
    0b10100,
    0b10100,
    0b11100,
    0b00000,
    0b00101,
    0b00010,
    0b00101
};

const int8_t MyLcd::repDistanceSymbol = 2;
const uint8_t MyLcd::repDistanceSymbolMap[8] = {
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00110,
    0b00101,
    0b00110,
};

const int8_t MyLcd::repTimeSymbol = 3;
const uint8_t MyLcd::repTimeSymbolMap[8] = {
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00111,
    0b00010,
    0b00010,
};

const int8_t MyLcd::repCountSymbol = 4;
const uint8_t MyLcd::repCountSymbolMap[8] = {
    0b00000,
    0b00000,
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00000,
};

const int8_t MyLcd::velocitySymbol = 5;
const uint8_t MyLcd::velocitySymbolMap[8] = {
    0b00000,
    0b00000,
    0b10110,
    0b10100,
    0b10100,
    0b11000,
    0b00000,
    0b00000,
};

const int8_t MyLcd::caloriesSymbol = 6;
const uint8_t MyLcd::coloriesSymbolMap[8] = {
    0b00011,
    0b00011,
    0b00000,
    0b11100,
    0b10000,
    0b10000,
    0b11100,
    0b00000,
};


void MyLcd::setup()
{ 
    lcd.init();                      // initialize the lcd 
    lcd.backlight();

    // TODO: check if the custom chars are lost everytime we reset the arduino.
    {// create custom chars:
        lcd.createChar(bpmSymbol, bpmSymbolMap);
        lcd.createChar(oxSymbol, oxSymbolMap);
        lcd.createChar(repDistanceSymbol, repDistanceSymbolMap);
        lcd.createChar(repTimeSymbol, repTimeSymbolMap);
        lcd.createChar(repCountSymbol, repCountSymbolMap);
        lcd.createChar(velocitySymbol, velocitySymbolMap);
        lcd.createChar(caloriesSymbol, coloriesSymbolMap);
    }

    lcd.setCursor(0, 0);
    lcd.write(bpmSymbol);
    lcd.write(oxSymbol);
    lcd.write(repDistanceSymbol);
    lcd.write(repTimeSymbol);
    lcd.write(repCountSymbol);
    lcd.write(velocitySymbol);
    lcd.write(caloriesSymbol);
    lcd.setCursor(0, 1);
    lcd.print("1234567890abcdfd");
}
