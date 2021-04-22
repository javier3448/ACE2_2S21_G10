#ifndef YFS201_h
#define YFS201_h

#include "pindefs.h"

namespace Yfs201 
{
    extern volatile int numPulsos; //variable para la cantidad de pulsos recibidos
    extern float factor_conversion; //para convertir de frecuencia a caudal

    extern float volumen;
    extern long dt;
    extern long t0;

    extern float caudal_L_m;
    // true: inhalando
    // false: exhalando
    extern bool direccion;
    extern float volumenEnPulmones; // L (litros)

    extern long lastTime;
    extern bool allowFlowChange;
    boolean botonInicio();

    void setup();
    void loop();

    void setupCalculoConsumo();
    int getFrecuencia();
    void calculoConsumo();
    void contarPulsos();
    int obetenerFrecuencia();
}

#endif
