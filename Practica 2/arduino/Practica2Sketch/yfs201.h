#ifndef YFS201_h
#define YFS201_h

#include "pindefs.h"

// @MEJORA: pasar todo lo direccion, calculo de volumen y todo eso aqui?
namespace Yfs201 
{
    extern volatile int numPulsos; //variable para la cantidad de pulsos recibidos
    extern float factor_conversion; //para convertir de frecuencia a caudal

    extern float volumen;
    extern long dt;
    extern long t0;

    extern long lastTime;
    extern bool allowFlowChange;

    void setup();
    // Bloquea por al menos 100 millis, retorna Litros por minuto
    float getCaudal();

    void setupCalculoConsumo();
    // Bloquea por al menos 100 millis
    int getFrecuencia();
    void calculoConsumo();
    void contarPulsos();
    int obetenerFrecuencia();
}

#endif
