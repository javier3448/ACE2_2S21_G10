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
                // Serial.write(c);
                auto result = BtInParser::parse(c);
                if(result.hasValue == true){
                    peso = result.value;
                    stateActual = State::WAIT_OK;
                    return;
                }
            }

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
            if(!digitalRead(OK_BUTTON_PIN)){
                stateActual = State::PLAY;
                return;
            }
            // @debug:
            {
                static long count = 0;
                //call every 8 loops
                if(count >= 80000){
                    count = 0;
                    Serial.print("WAIT_OK: ");
                    Serial.println(peso);
                }
                else{
                    count++;
                }
            }
        }break;

        case State::PLAY:
        {
            // AQUI AQUI AQUI
            // @TODO:
            // correr calculo de volumen y todo eso
            // cada 500 milis enviar a bt
            // despues de 5 minutos terminar todo (usar 1 minuto para debugger facil)

            millis();

            // @debug:
            {
                static long count = 0;
                //call every 8 loops
                if(count >= 80000){
                    count = 0;
                    Serial.print("PLAY: ");
                }
                else{
                    count++;
                }
            }
        }break;
    }
}

