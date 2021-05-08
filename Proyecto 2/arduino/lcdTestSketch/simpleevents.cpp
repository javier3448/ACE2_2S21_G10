#include "simpleevents.h"

#include <assert.h>

SimpleEvents::SimpleEvents()
{
    for (int i = 0; i < EVENTS_CAPACITY; ++i)
    {
        events[i] = {
            .enable = false,
            .delay = 0,
            .func = nullptr,
            .lastTime = 0
        };
    }
}

void SimpleEvents::addEvent(int8_t index, long delay, void (*func)(void))
{
    // @TODO: no se cual es la mejor manera de hacer un assert en arduino. no se 
    // ni siquiera si es prudente hacer un assert :/
    assert(index >= 0 && index < EVENTS_CAPACITY);
    assert(delay >= 0);
    assert(func != nullptr);

    events[index] = {
        .enable = true,
        .delay = delay,
        .func = func,
        .lastTime = millis()
    };
}

void SimpleEvents::loop()
{
    for (int i = 0; i < EVENTS_CAPACITY; ++i)
    {
        if(events[i].enable){
            long currTime = millis();
            long delta = currTime - events[i].lastTime;
            if(delta >= events[i].delay){
                events[i].func();
                events[i].lastTime = currTime;
            }
        }
    }
}
