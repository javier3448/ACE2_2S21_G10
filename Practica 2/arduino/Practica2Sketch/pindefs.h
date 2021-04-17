// tiene los #define s de los pines, otros constexpr/macros utile y #includes que siempre necesitamos
// Este header deberia ser incluido en todas partes, similar a un 'pch'

#include <Arduino.h>

#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

// Para arduino uno
//#define SDA A4
//#define SCL A5