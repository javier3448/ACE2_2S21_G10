#include "prueba.h"

#include "btinparser.h"
#include "yfs201.h"

Prueba::State Prueba::stateActual = State::INITIAL;

SoftwareSerial Prueba::btSerial(BT_RX, BT_TX);

float Prueba::peso = -1;
int Prueba::numeroPrueba = 0;

long Prueba::beginTimePlay = 0;
long Prueba::lastTimeBtSent = 0;

float Prueba::volumenEnPulmones = 0;
float Prueba::volumenMaximoEnPulmones = 0;
bool Prueba::direccionFlujo = false;
bool Prueba::allowFlowChange = false;
long Prueba::lastTimeFlowSampled = 0;

void Prueba::setup()
{
    stateActual = State::INITIAL;

    // Setup bluetooth
    {
        // btSerial = SoftwareSerial(BT_RX, BT_TX);
        btSerial.begin(38400);
        pinMode(BT_STATE, OUTPUT);
    }

    Yfs201::setup();
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
                auto result = BtInParser::parse(c);
                if(result.hasValue == true){
                    peso = result.value;
                    stateActual = State::WAIT_OK;
                    return;
                }
            }
        }break;

        case State::WAIT_OK:
        {
            if(!digitalRead(OK_BUTTON_PIN)){
                // setup para entrar a State::PLAY por primera vez
                {
                    long currTime = millis();
                    beginTimePlay = currTime;
                    lastTimeFlowSampled = currTime;
                    lastTimeBtSent = currTime;
                    direccionFlujo = false;
                    allowFlowChange = false;
                    volumenEnPulmones = 0;
                    volumenMaximoEnPulmones = 0;
                    numeroPrueba++;
                }
                stateActual = State::PLAY;
                return;
            }
        }break;

        case State::PLAY:
        {
            // @TODO?:
            // que espere tambien el boton

            // 'actualizar' el volumenEnPulmones y ver si es valor mas grande
            // hasta ahora
            {
                float volumenActualEnPulmones = updateVolumenEnPulmones();

                if(volumenEnPulmones > volumenMaximoEnPulmones){
                    volumenMaximoEnPulmones = volumenEnPulmones;
                }
            }

            // Enviar datos de realTime cada 500 millis
            long currTime = millis();
            long deltaTimeBtSent = currTime - lastTimeBtSent;
            long playTime = currTime - beginTimePlay;
            if(deltaTimeBtSent >= 500){
                sendBtRealTime(numeroPrueba, playTime, volumenEnPulmones, (int)direccionFlujo);
                lastTimeBtSent = currTime;
            }

            // 5 minutos de playTime para terminar
            if(playTime >=  TOTAL_PLAY_TIME){
                // Send vo2max data and stop signal to bluetooth
                float myConstant = 24253.21;
                Serial.println(volumenMaximoEnPulmones, 4);
                float vo2max = volumenMaximoEnPulmones * myConstant 
                               / 
                               (peso * ((float)TOTAL_PLAY_TIME / 60000.0));
                sendBtVo2max(numeroPrueba, vo2max);
                stateActual = State::INITIAL;
                return;
            }
        }break;
    }
}

// @MEJORA: deberia de retornar la direccion de flujo actual tambien porque eso 
// se envia por bt tambien
// Usar el sensor Yfs201 para determinar el flujo de aire y actualizar el 
// `volumenEnPulmones` dependiendo de la direccion y magnitud del flujo
// retorna el valor del volumen despues de revisar el flujo actual segun el Yfs201
float Prueba::updateVolumenEnPulmones()
{
    float caudal_L_m = Yfs201::getCaudal();

    // Serial.print("caudal: ");
    // Serial.print(caudal_L_m * (direccionFlujo ? 1 : -1), 4);
    // Serial.print(", volumenEnPulmones: ");
    // Serial.println(volumenEnPulmones);

    // @TODO TUNNING: 
    // Para determinar la direccioin del flujo no nos queda de otra mas que empezar
    // en un flujo conocido (exhalar) y cambiar de direccion cada vez que el flujo
    // sea 0, pero cuando sea 0 por varias 'iteraciones' de este loop() no queremos
    // que cambie a cada rato. 
    // Entonces se implemento algo parecido a un ''schmitt trigger''. Que va a cambiar
    // el flujo solo cuando el flujo baje de cierto umbral(bajo, 0.01) y haya pasado en una
    // iteracion anterior otro umbral (alto, 0.05)
    // tambie le llaman: HYSTERESIS
    if(caudal_L_m > 0.4){
        allowFlowChange = true;
    }
    if(caudal_L_m < 0.4 && allowFlowChange){
        direccionFlujo = direccionFlujo ? false : true;
        allowFlowChange = false;
    }

    // Suponemos que el caldual que medimos con getCauldal se mantuvo hasta
    // este punto en el loop
    long currTimeFlowRate = millis();
    long deltaTime = currTimeFlowRate - lastTimeFlowSampled;
    // @TODO MEJORAR COMO CONSEGUIMOS EL CAUDAL, AQUI PERDEMOS MUCHA EXACTITUD Y 
    // USAMOS MUCHO MAS PROCESAMIENTO DEL QUE NECESITAMOS.
    // ES MEJOR PARTIR DE QUE PULSO EQUIVALE A 2.61E-3 L DE AIRE
    float caudal_L_s = caudal_L_m / 60.0;
    float deltaTime_s = (float)deltaTime / 1000.0;
    volumenEnPulmones +=  (direccionFlujo ? 1 : -1) * caudal_L_s * deltaTime_s;

    lastTimeFlowSampled = currTimeFlowRate;

    return volumenEnPulmones;
}

void Prueba::sendBtRealTime(int prueba, long playTime, float volumenEnPulmones, int direccion)
{
    float playTime_seconds = (float)playTime / 1000.0;
    btSerial.print('$');
    btSerial.print(prueba);
    btSerial.print('|');
    btSerial.print(playTime_seconds);
    btSerial.print('|');
    btSerial.print(volumenEnPulmones, 4);
    btSerial.print('|');
    btSerial.print(direccion);
    btSerial.print(';');

    // @debug:
    Serial.print('$');
    Serial.print(prueba);
    Serial.print('|');
    Serial.print(playTime_seconds);
    Serial.print('|');
    Serial.print(volumenEnPulmones, 4);
    Serial.print('|');
    Serial.print(direccion);
    Serial.print(';');
    Serial.println();
}

void Prueba::sendBtVo2max(int prueba, float vo2max)
{
    btSerial.print('#');
    btSerial.print(prueba);
    btSerial.print('|');
    btSerial.print(vo2max, 4);
    btSerial.print(';');

    // @debug:
    Serial.print('#');
    Serial.print(prueba);
    Serial.print('|');
    Serial.print(vo2max, 4);
    Serial.print(';');
    Serial.println();
}


