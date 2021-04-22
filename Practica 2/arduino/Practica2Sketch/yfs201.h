#ifndef YFS201_h
#define YFS201_h

#include "pindefs.h"

namespace Yfs201 
{
    // Constante de nuestro sensor que se utiliza para obtener el flujo en terminos
    // de frecuencia de pulsacion. Nos indica cuantos litros de fluido pasan en 
    // cada pulsacion. La obtuvimos de:
    // Sensor for Measuring the Volume of Air Supplied to the Lungs of Adult Mannequins in Ventilation Maneuvers during Cardiopulmonary Resuscitation
    // https://www.mdpi.com/2504-3900/4/1/39
    // Igual deberia estar en la datasheet o algo asi, no se :/
    constexpr float VOLUMEN_POR_PULSO = 2.61E-3;

    //variable para la cantidad de pulsos recibidos
    extern volatile int numPulsos; 

    // true: inhalando
    // false: exhalando
    extern bool direccion;
    extern float volumenEnPulmones; // L (litros)

    extern long lastTime;
    extern bool allowFlowChange;
    boolean botonInicio();

    void setup();
    void loop(); 

    void interruptContarPulsos();
}

#endif
