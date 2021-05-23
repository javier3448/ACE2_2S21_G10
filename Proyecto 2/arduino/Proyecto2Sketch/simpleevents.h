// Solo un monton de funciones para ejecutar otras funciones ""concurrentemente""
// Cosas sencillas como ejecutar una funcion cada 2 segundos.
// HAY QUE LLAMAR A loop CONSTANTEMENTE PARA QUE FUNCIONE y la funcionalidad depende 
// que llamen a loop constantemente y frecuentemente

// @Improvement?:
// We are almost always exactly on time in our test. But when we are late, the next
// exectution of func is on time, not early. 
// Example of what we have:
//     execution 1: millis=0;
//     execution 2: millis=1000;
//     execution 3: millis=2000;
//     execution 4: millis=3002; <--- its inevitable that we will be late sometimes
//     execution 5: millis=4000; <--- but the next one should be early 
//     execution 6: millis=5000;
//     execution 7: millis=6000;
//     execution 8: millis=7000;
// Example of what we want:
//     execution 1: millis=0;
//     execution 2: millis=1000;
//     execution 3: millis=2000;
//     execution 4: millis=3002; <---
//     execution 5: millis=3998; <---
//     execution 6: millis=5000;
//     execution 7: millis=6000;
//     execution 8: millis=7000;

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

    // The value that millis() has to return in order to execute func again.
    long nextTime;
};

struct SimpleEvents{
    // 
    static constexpr int8_t EVENTS_SIZE = 8;

    Event events[EVENTS_SIZE];

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

