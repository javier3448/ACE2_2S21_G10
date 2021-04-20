// tiene los #define s de los pines, otros constexpr/macros utile y #includes que siempre necesitamos
// Este header deberia ser incluido en todas partes, similar a un 'pch'

#ifndef _PINDEFS_h
#define _PINDEFS_h

#include <Arduino.h>

#define BT_RX 3
#define BT_TX 4
#define BT_STATE 5

#define BMP_SCL 13
#define BMP_SDO 12
#define BMP_SDA 11

#define BMP_CSB1 10
#define BMP_CSB2 9

#endif
