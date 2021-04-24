#ifndef PRUEBA_h
#define PRUEBA_h

#include "pindefs.h"

#include <SoftwareSerial.h>

// @TODO: cambiar nombre a PruebaVO2max
namespace Prueba {

    // @TODO: describir cada estado
    enum State{
        INITIAL,
        WAIT_OK,
        PLAY
    };

    // 300000 = 5 minutos en milis
    // 60000 = 1 minutos en milis
    // @NOCHECKIN: cambiar a 5 minutos, 30 segundos es solo para debuggear
    constexpr long TOTAL_PLAY_TIME = 5000;
    // [!] PORQUE JODIDOS: `constexpr long TOTAL_PLAY_TIME = 5*60*1000;` NO FUNCIONO 
    // talez sea porque los int_literals son de 16 bits, eso seria de lo mas estupido
    // sad
    constexpr bool INHALAR = true;
    constexpr bool EXHALAR = false;

    extern SoftwareSerial btSerial;

    extern State stateActual;

    extern float peso;

    extern long beginTimePlay;
    extern long lastTimeBtSent;

    extern float volumenEnPulmones;
    extern float volumenMaximoEnPulmones;
    extern bool direccionFlujo;
    extern bool allowFlowChange;
    extern long lastTimeFlowSampled;

    void setup();
    void loop();

    // 'private'
    float updateVolumenEnPulmones();
    void sendBtRealTime(long playTime, float volumenEnPulmones);
    void sendBtVo2max(float vo2max);
}

#endif
