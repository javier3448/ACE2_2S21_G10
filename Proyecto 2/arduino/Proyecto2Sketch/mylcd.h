// mylcd.h
// Contiene los custom characters los valores de setup 
// se espera que siempre llamemos a MyLcd::loop para 
// * actualizar los valores mostrados de los datos en tiempo real 
// * llevar control de deltaTimes de mensajes temporales
// * llevar control de deltaTime de animaciones (si decidimos hacer)

#ifndef _MYLCD_h
#define _MYLCD_h

#include "pindefs.h"
#include <LiquidCrystal_I2C.h>

namespace MyLcd {

	extern LiquidCrystal_I2C lcd;

	extern const int8_t bpmSymbol;
	extern const uint8_t bpmSymbolMap[8];

	extern const int8_t oxSymbol;
	extern const uint8_t oxSymbolMap[8];

	extern const int8_t repDistanceSymbol;
	extern const uint8_t repDistanceSymbolMap[8];

	extern const int8_t repTimeSymbol;
	extern const uint8_t repTimeSymbolMap[8];

	extern const int8_t repCountSymbol;
	extern const uint8_t repCountSymbolMap[8];

	extern const int8_t temperatureSymbol;
	extern const uint8_t temperatureSymbolMap[8];

	extern const int8_t velocitySymbol;
	extern const uint8_t velocitySymbolMap[8];

	extern const int8_t caloriesSymbol;
	extern const uint8_t coloriesSymbolMap[8];

    void setup();
    void loop();

    void print2Digits(int number);
    void print3Digits(int number);

    void printRealtimeMessage(int8_t numeroDeRepActual, float distanciaRepeticionActual, 
    	long tiempoRepeticionActual, float velocidadTiempoReal, float temperatura, 
    	float ritmoCardiaco, float oxigeno, float calories);
}


#endif
