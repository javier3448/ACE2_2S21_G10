// tiene los #define s de los pines, otros constexpr/macros utile y #includes que siempre necesitamos
// Este header deberia ser incluido en todas partes, similar a un 'pch'

#ifndef PINDEFS_h
#define PINDEFS_h

#include <Arduino.h>

// @TRIVIAL TODO: pasar a const expr para que tengamos tipos

#define BT_RX 3
#define BT_TX 4
#define BT_STATE 5
#define BT_START 7

#define YSF201_PIN 2



#endif
