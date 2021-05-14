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

const int8_t MyLcd::temperatureSymbol = 5;
const uint8_t MyLcd::temperatureSymbolMap[8] = {
    0b00011,
    0b00011,
    0b00000,
    0b11100,
    0b10000,
    0b10000,
    0b11100,
    0b00000,
};

const int8_t MyLcd::velocitySymbol = 6;
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

const int8_t MyLcd::caloriesSymbol = 7;
const uint8_t MyLcd::coloriesSymbolMap[8] = {
    0b00000,
    0b11110,
    0b10000,
    0b10010,
    0b10000,
    0b11110,
    0b00000,
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
        lcd.createChar(temperatureSymbol, temperatureSymbolMap);
        lcd.createChar(velocitySymbol, velocitySymbolMap);
        lcd.createChar(caloriesSymbol, coloriesSymbolMap);
    }

    lcd.setCursor(0, 0);
    lcd.write(bpmSymbol);
    lcd.write(oxSymbol);
    lcd.write(repDistanceSymbol);
    lcd.write(repTimeSymbol);
    lcd.write(repCountSymbol);
    lcd.write(temperatureSymbol);
    lcd.write(velocitySymbol);
    lcd.write(caloriesSymbol);
    lcd.setCursor(0, 1);
    lcd.print("1234567890abcdfd");
}

void MyLcd::print3Digits(int number)
{
    if(number < 100){
        lcd.print('0');
    }
    if(number < 10){
        lcd.print('0');
    }
    lcd.print(number);
}

void MyLcd::print2Digits(int number)
{
    if(number < 10){
        lcd.print('0');
    }
    lcd.print(number);
}

void MyLcd::printRealtimeMessage(int8_t numeroDeRepActual, float distanciaRepeticionActual, 
    long tiempoRepeticionActual, float velocidadTiempoReal, float temperatura, 
    float ritmoCardiaco, float oxigeno, float calories)
{
    {// first row
        lcd.setCursor(0, 0);

        lcd.write(repCountSymbol);
        print2Digits(numeroDeRepActual);
        lcd.write(' ');

        lcd.write(repDistanceSymbol);
        if(velocidadTiempoReal < 0)
            lcd.print("XX");
        else
            print2Digits((int)distanciaRepeticionActual);
        lcd.write(' ');

        lcd.write(temperatureSymbol);
        print2Digits((int)temperatura);
        lcd.write(' ');

        lcd.write(bpmSymbol);
        print3Digits((int)ritmoCardiaco);
    }

    {// second row
        lcd.setCursor(0, 1);

        lcd.write(repTimeSymbol);
        print2Digits((int) (tiempoRepeticionActual / 1000));
        lcd.write(' ');

        lcd.write(velocitySymbol);
        if(velocidadTiempoReal < 0)
            lcd.print("XX");
        else
            print2Digits((int)velocidadTiempoReal);
        lcd.write(' ');

        lcd.write(caloriesSymbol);
        print2Digits((int)calories);
        lcd.write(' ');

        lcd.write(oxSymbol);
        print3Digits((int)oxigeno);
    }

}
