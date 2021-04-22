#include "prueba.h"

#include "simpleevents.h"
#include "util.h"
#include "yfs201.h"



namespace Sensor{
    bool isActive;
    long startTime;

    void setup()
    {
        isActive = false;
        startTime = 0;
        pinMode(BT_START, INPUT_PULLMODE);
    }

    void empezarPrueba()
    {
        
        isActive = true;
        startTime = millis();
    }

    void loop()
    {
        if(!isActive) return;

        long deltaTime = millis() - startTime;
        if(deltaTime > 300000){ // 5 minutos
           
            isActive = false;
        }
    }
}




static SoftwareSerial btSerial(BT_RX, BT_TX);

inline void sendPlayPackage(int8_t repeticionActual, int8_t direccion, 
    float weight, float tiempo, float volumen, 
    float vomax); //ENVIO DE DATOS 

inline void sendStartPackage();

void Prueba::setup(){
    Prueba::stateActual = State::STOP;
    posicionInicial = {
    	numeroDeRep : 0,
        direccion =0,
        tiempoInicial : 0,
        weight=0,
        volumen=0,
        vomax=0,
    };
    repeticionActual = {
        numeroDeRep : 0,
        direccion =0,
        tiempoInicial : 0,
        weight=0,
        volumen=0,
        vomax=0,
    };

    // setupBluetooth
    {
        pinMode(BT_START, INPUT_PULLMODE);
        btSerial.begin(38400);
    }

    Sensor::setup();
  

void Prueba::loop()
{

 switch(stateActual)
    {
    

    	 case State::STOP:
        {
            if(!digitalRead(BT_START)){  // espera el boton start
            

           }
       }

        case State::PLAY:
        {
        	if(!digitalRead(BT_START)){ //no deberia de hacer nada 
           
           	}
        }
    }
}
