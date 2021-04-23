#include "prueba.h"

#include "btinparser.h"

Prueba::State Prueba::stateActual = State::INITIAL;

SoftwareSerial Prueba::btSerial(BT_RX, BT_TX);
float Prueba::peso = -1;

void Prueba::setup()
{
    stateActual = State::INITIAL;

    // Setup bluetooth
    {
        // btSerial = SoftwareSerial(BT_RX, BT_TX);
        btSerial.begin(38400);
        pinMode(BT_STATE, OUTPUT);
    }
}

void Prueba::loop()
{
    switch(stateActual)
    {
        case State::INITIAL:
        {
            // Por ahora vamos a leer de bluetooth solo en este estado porque
            // asi podemos facilmente comunicar cuando el parse
            while(btSerial.available()){
                char c = btSerial.read();
                Serial.write(c);
                // @NOCHECKIN:
                //auto result = BtInParser::parse(c);
                // if(result.hasValue == true){
                //     peso = result.value;
                //     stateActual = State::WAIT_OK;
                //     return;
                // }
            }
            // @NOCHECKIN:
            return;

            // @debug:
            {
                static int count = 0;
                //call every 8 loops
                if(count >= 8000){
                    count = 0;
                    Serial.println("INITIAL");
                }
                else{
                    count++;
                }
            }
        }break;

        case State::WAIT_OK:
        {

        }break;

        case State::PLAY:
        {

        }break;
    }
}

