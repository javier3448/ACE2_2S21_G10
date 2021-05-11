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
	0b11100,
	0b00000,
	0b00101,
	0b00010,
	0b00101,
	0b00000
};

int8_t MyLcd::OX_SYMBOL1 = 2;
uint8_t MyLcd::OX_SYMBOL_MAP1[8] = {
	0b11100,
	0b10100,
	0b11100,
	0b00000,
	0b00011,
	0b00001,
	0b00010,
	0b00011
};

int8_t MyLcd::OX_SYMBOL2 = 3;
uint8_t MyLcd::OX_SYMBOL_MAP2[8] = {
	0b11100,
	0b10100,
	0b11100,
	0b00010,
	0b00101,
	0b00001,
	0b00010,
	0b00111
};


void MyLcd::setup()
{ 
    lcd.init();                      // initialize the lcd 
    lcd.backlight();

    // TODO: check if the custom chars are lost everytime we reset the arduino.
    {// create custom chars:
    	lcd.createChar(BPM_SYMBOL, BPM_SYMBOL_MAP);
    	lcd.createChar(OX_SYMBOL, OX_SYMBOL_MAP);
    	lcd.createChar(OX_SYMBOL1, OX_SYMBOL_MAP1);
    	lcd.createChar(OX_SYMBOL2, OX_SYMBOL_MAP2);
    }

    lcd.setCursor(0, 0);
    lcd.write(BPM_SYMBOL);
    lcd.write(OX_SYMBOL);
    lcd.write(OX_SYMBOL1);
    lcd.write(OX_SYMBOL2);
    lcd.print("567890abcdfd");
    lcd.setCursor(0, 1);
    lcd.print("1234567890abcdfd");
}
