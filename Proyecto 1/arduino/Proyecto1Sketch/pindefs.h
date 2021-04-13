// It has the pin #define s, other useful constexpr/macros and #includes we always need
// This header should be included everywhere, its kinda like a pch or somethin

#ifndef _PINDEFS_h
#define _PINDEFS_h

#include <Arduino.h>

#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

#define MOTOR_PIN 2

#define BUZZER_PIN 9

#define BUTTON_START_PIN 7
#define BUTTON_QUIT_PIN 8

#define GPS_TX 4
#define GPS_RX 3

#define TEMPERATURE_PIN A0

// Para arduino uno
//#define SDA A4
//#define SCL A5

#endif