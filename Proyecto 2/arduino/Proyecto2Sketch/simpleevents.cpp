#include "simpleevents.h"

#include <assert.h>

SimpleEvents::SimpleEvents()
{
    for (int i = 0; i < EVENTS_SIZE; ++i)
    {
        events[i] = {
            .enable = false,
            .delay = 0,
            .func = nullptr,
            .nextTime = 0
        };
    }
}

void SimpleEvents::addEvent(int8_t index, long delay, void (*func)(void))
{
    // @TODO: no se cual es la mejor manera de hacer un assert en arduino. no se 
    // ni siquiera si es prudente hacer un assert :/
    assert(index >= 0 && index < EVENTS_SIZE);
    assert(delay >= 0);
    assert(func != nullptr);

    events[index] = {
        .enable = true,
        .delay = delay,
        .func = func,
        .nextTime = millis() + delay
    };
}

void SimpleEvents::loop()
{
    for (auto& event : events)
    {
        if(event.enable){
            long currTime = millis();
            if(event.nextTime <= currTime){
                event.func();

                // owedTime is how 'late' we exectuded func
                long owedTime = currTime - event.nextTime;
                // we compensate that lateness by making the next event happen sooner
                event.nextTime = (currTime + event.delay) - owedTime;
            }
        }
    }
}
