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

	extern int8_t BPM_SYMBOL;
	extern uint8_t BPM_SYMBOL_MAP[8];

	extern int8_t OX_SYMBOL;
	extern uint8_t OX_SYMBOL_MAP[8];

	extern int8_t OX_SYMBOL1;
	extern uint8_t OX_SYMBOL_MAP1[8];

	extern int8_t OX_SYMBOL2;
	extern uint8_t OX_SYMBOL_MAP2[8];

    void setup();
    void loop();
}


#endif
