#include "yfs201.h"

// @TODO: limpiar, simplificar y 'personalizar'
//        preguntar de donde salio el codigo

volatile int Yfs201::numPulsos = 0; 
// @TODO: en el enunciado dice que se empiza exhalando pero eso haria que nuestra 
// de volumen adentro de los pulmones empiece en negativo
bool Yfs201::direccion = true;
float Yfs201::volumenEnPulmones = 0; // L (litros)
long Yfs201::lastTime = 0;
bool Yfs201::allowFlowChange = false;

void Yfs201::setup()
{
    pinMode(YSF201_PIN, INPUT); 

    lastTime = millis();
    numPulsos = 0;
    direccion = true;
    volumenEnPulmones = 0; // L (litros)
    lastTime = 0;
    allowFlowChange = false;

    attachInterrupt(0, interruptContarPulsos, RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)
}

// Calcular volumen
void Yfs201::loop()
{
    // Talvez no sea necesario quitar los interrupts para acceder al numPulsos
    long currPulsos;
    long currTime = millis();
    noInterrupts();
    {
        currPulsos = numPulsos;
        numPulsos = 0;
    }
    interrupts();

    // Mejora: NO SABEMOS CUANTO TIEMPO PASO DESDE LA ULTIMA VEZ QUE SE CORRIO 
    // ESTE loop(), ENTONCES NO SABEMOS QUE  
    float frecuencia = (float)currPulsos / (float)(currTime - lastTime);
    float flowRate = frecuencia * VOLUMEN_POR_PULSO; // L/s
    float currVolumen = currPulsos * VOLUMEN_POR_PULSO; // L

    // [!!!] QUE PASA SI PASAMOS POR AQUI MUCHAS VECES Y VARIAS DE ESAS VECES EL
    // NUMERO DE PULSOS ES 0 :(

    // @TODO TUNNING: los 
    // Para determinar la direccioin del flujo no nos queda de otra mas que empezar
    // en un flujo conocido (exhalar) y cambiar de direccion cada vez que el flujo
    // sea 0, pero cuando sea 0 por varias 'iteraciones' de este loop() no queremos
    // que cambie a cada rato. 
    // Entonces se implemento algo parecido a un schmitt trigger. Que va a cambiar
    // el flujo solo cuando el flujo baje de cierto umbral(bajo, 0.01) y haya pasado en una
    // iteracion anterior otro umbral (alto, 0.05)
    // tambie le llaman: HYSTERESIS
    if(flowRate > 0.005){
        allowFlowChange = true;
    }
    if(flowRate < 0.001 && allowFlowChange){
        direccion = direccion ? false : true;
        allowFlowChange = false;
    }

    if(direccion)
        volumenEnPulmones += currVolumen;
    else
        volumenEnPulmones -= currVolumen;

    lastTime = currTime;
}

//---Función que se ejecuta en interrupción---------------
void Yfs201::interruptContarPulsos()
{
    numPulsos++;
}
