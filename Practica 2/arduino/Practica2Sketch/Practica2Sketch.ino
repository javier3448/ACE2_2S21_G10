#include "pindefs.h"

// @debug:
#include "util.h"
#include "simpleevents.h"
#include "yfs201.h"

#include "prueba.h"

SimpleEvents simpleEvents = SimpleEvents();

// void printYfs()
// {
// }

// @TODO!!: Ponerlo adentro del setup
long lastTime;

void setup()
{
    Serial.begin(9600);

    // setup sensor flujo YFS-201
    Yfs201::setup();
    lastTime = millis();

    // setup button de confirmacion
    pinMode(OK_BUTTON_PIN, INPUT_PULLUP); //boton inicio

    // simpleEvents.addEvent(0, 100, printYfs);

    Prueba::setup();
}

// @TODO!!: Ponerlo adentro del setup
// Exhalar: false
bool direccion = false;
bool allowFlowChange = true;
float volumenEnPulmones = 0;

void loop()
{
    Prueba::loop();
    return;

    float caudal_L_m = Yfs201::getCaudal();

    Serial.print("caudal: ");
    Serial.print(caudal_L_m * (direccion ? 1 : -1), 4);
    Serial.print(", volumenEnPulmones: ");
    Serial.println(volumenEnPulmones);

    // simpleEvents.loop();
    // @TODO TUNNING: los 
    // Para determinar la direccioin del flujo no nos queda de otra mas que empezar
    // en un flujo conocido (exhalar) y cambiar de direccion cada vez que el flujo
    // sea 0, pero cuando sea 0 por varias 'iteraciones' de este loop() no queremos
    // que cambie a cada rato. 
    // Entonces se implemento algo parecido a un schmitt trigger. Que va a cambiar
    // el flujo solo cuando el flujo baje de cierto umbral(bajo, 0.01) y haya pasado en una
    // iteracion anterior otro umbral (alto, 0.05)
    // tambie le llaman: HYSTERESIS
    if(caudal_L_m > 0.4){
        allowFlowChange = true;
    }
    if(caudal_L_m < 0.4 && allowFlowChange){
        direccion = direccion ? false : true;
        allowFlowChange = false;
    }


    // Suponemos que el caldual que medimos con getCauldal se mantuvo hasta
    // este punto en el loop
    long currTime = millis();
    long deltaTime = currTime - lastTime;
    // @TODO MEJORAR COMO CONSEGUIMOS EL CAUDAL, AQUI PERDEMOS MUCHA EXACTITUD Y 
    // USAMOS MUCHO MAS PROCESAMIENTO DEL QUE NECESITAMOS.
    // ES MEJOR PARTIR DE QUE PULSO EQUIVALE A 2.61E-3 L DE AIRE
    float caudal_L_s = caudal_L_m / 60.0;
    float deltaTime_s = (float)deltaTime / 1000.0;
    volumenEnPulmones +=  (direccion ? 1 : -1) * caudal_L_s * deltaTime_s;

    lastTime = currTime;
}