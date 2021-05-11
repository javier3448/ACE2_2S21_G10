#include "mylcd.h"

LiquidCrystal_I2C MyLcd::lcd = LiquidCrystal_I2C(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

int8_t MyLcd::BPM_SYMBOL = 0;
uint8_t MyLcd::BPM_SYMBOL_MAP[8] = {
    0b00000,
    0b01010,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
    0b00000,
    0b00000
};

int8_t MyLcd::OX_SYMBOL = 1;
uint8_t MyLcd::OX_SYMBOL_MAP[8] = {
    0b11100,
    0b10100,
    0b10100,
    0b11100,
    0b00000,
    0b00101,
    0b00010,
    0b00101
};

// TODO: mejores nombres para estos simbolos

int8_t MyLcd::RD_SYMBOL = 2;
uint8_t MyLcd::RD_SYMBOL_MAP[8] = {
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00110,
    0b00101,
    0b00110,
};

int8_t MyLcd::RT_SYMBOL = 3;
uint8_t MyLcd::RT_SYMBOL_MAP[8] = {
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00111,
    0b00010,
    0b00010,
};

int8_t MyLcd::R_SYMBOL = 4;
uint8_t MyLcd::R_SYMBOL_MAP[8] = {
    0b11100,
    0b10100,
    0b11000,
    0b10100,
    0b00000,
    0b00111,
    0b00010,
    0b00010,
};


void MyLcd::setup()
{ 
    lcd.init();                      // initialize the lcd 
    lcd.backlight();

    // TODO: check if the custom chars are lost everytime we reset the arduino.
    {// create custom chars:
        lcd.createChar(BPM_SYMBOL, BPM_SYMBOL_MAP);
        lcd.createChar(OX_SYMBOL, OX_SYMBOL_MAP);
        lcd.createChar(RD_SYMBOL, RD_SYMBOL_MAP);
        lcd.createChar(RT_SYMBOL, RT_SYMBOL_MAP);
        lcd.createChar(R_SYMBOL, R_SYMBOL_MAP);
    }

    lcd.setCursor(0, 0);
    lcd.write(BPM_SYMBOL);
    lcd.write(OX_SYMBOL);
    lcd.write(RD_SYMBOL);
    lcd.write(RT_SYMBOL);
    lcd.write(R_SYMBOL);
    lcd.print("567890abcdfd");
    lcd.setCursor(0, 1);
    lcd.print("1234567890abcdfd");
}
