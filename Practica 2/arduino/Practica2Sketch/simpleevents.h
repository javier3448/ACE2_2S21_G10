// solo un monton de funciones para ejecutar otras funciones ""concurrentemente""
// Cosas sencillas como ejecutar una funcion cada 2 segundos.
// HAY QUE LLAMAR A loop CONSTANTEMENTE PARA QUE FUNCIONE y la funcionalidad depende 
// que llamen a loop constantemente y frecuentemente

// EL NUMERO DE EVENTOS SE TIENEN QUE SAVER EN TIEMPO DE COMPILACION AUNQUE PARESCA
// QUE NO.

// The way we time things is pretty mediocre, when we execute the function we are
// always a bit late, ideally we would be late sometimes and some other early.
// Example of current timming for an event that happens every second:
// execution 1: millis=0;
// execution 2: millis=1005;
// execution 3: millis=2033;
// execution 4: millis=3062;
// execution 5: millis=4081;
// execution 6: millis=5101;
// execution 7: millis=6130;
// execution 8: millis=7156;

// @TODO:
// @MEJORA!!!!: USAR TEMPLATES O ALGO ASI PARA EXPRESAR QUE `events` NO ES REALMENTE
// UNA ESTRUCTURA DINAMICA. 
// De hecho casi todo es estatico: el puntero de funcion, el numero de 'eventos',
// el tiempo de delay...

#ifndef SIMPLEEVENTS_h
#define SIMPLEEVENTS_h

#include "pindefs.h"

struct Event{
    bool enable;
    // every `delay` millis we will call func
    long delay;
    // declare func as pointer to function returning void
    void (*func)(void);

    // private-ish: shouldnt be touched by anyone but the SimpleEvents class methods
    // ie: by SimpleEvents::loop()

    long lastTime;
};

struct SimpleEvents{
    // 
    static constexpr int8_t EVENTS_CAPACITY = 8;

    Event events[EVENTS_CAPACITY];

    SimpleEvents();

    void addEvent(int8_t index, long delay, void (*func)(void));
    // @Mejora: agregar otra funcion que ejecute el evento recien agregado ASAP
    // No despues de que pasen los primeros `delay`

    // @TODO:
    //removeEvent(int8_t index);

    void loop();
};

// Our current tests:
// SimpleEvents simpleEvents = SimpleEvents();
// void blink()
// {
//     static byte toggle = 0;
//     toggle = toggle ^ 1;
//     digitalWrite(LED_BUILTIN, toggle);
//     Serial.print("blink! currTime: ");
//     Serial.println(millis());
// }

// void print()
// {
//     static int count = 0;
//     Serial.print("Every 750 millis, currTime: ");
//     Serial.print(millis());
//     Serial.print("ms, count: ");
//     Serial.println(count);
//     count++;
// }

// void setup()
// {
//     Serial.begin(9600);

//     pinMode(LED_BUILTIN, OUTPUT);

//     { // setup events
//         simpleEvents.addEvent(0, 500, blink);
//         simpleEvents.addEvent(1, 750, print);
//     }
// }

// void loop()
// {
//     simpleEvents.loop();
// }
// As of that test it works real nice
#endif

