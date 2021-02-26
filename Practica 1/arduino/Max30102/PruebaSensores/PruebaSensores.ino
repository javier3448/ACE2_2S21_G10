/*
Sensor de Oxigeno y Ritmo Cardiaco 
Arquitectura de sistemas 2 

*/
/*
LIBRERIAS
*/
#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include "heartRate.h"
MAX30105 particleSensor;


/*********************************************************************************
OXIGENO

*/

#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)

uint16_t irBuffer[100]; 
uint16_t redBuffer[100];  
#else
uint32_t irBuffer[100]; 
uint32_t redBuffer[100];  
#endif


int32_t boLongitud; 
int32_t oxigenoVal; //SPO2 
int8_t oValido; //rango de oxigeno valido
int32_t ritmoCardiacoSPO; //ritmo cardiaco desde el oxigeno
int8_t bpmValido; //bpm



/*********************************************************************************
RITMO CARDIACO

*/
float bPM;
int bpmProm;
byte rangoB = 0;
long ultimoB = 0; //Ultimo Beat
const byte tamRango = 4; //variable
byte rangosA[tamRango]; // arreglo de rangos



/*
 * 
*********LEDS**********/
byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read




/***************************************** OXIGENO*******************************************************************************/


void SensorOxigeno(){
  boLongitud = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps

  //read the first 100 samples, and determine the signal range
  for (byte i = 0 ; i < boLongitud ; i++)
  {
    while (particleSensor.available() == false) 
      particleSensor.check(); 

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); 

    Serial.print(F("red="));
    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", ir="));
    Serial.println(irBuffer[i], DEC);
  }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, boLongitud, redBuffer, &oxigenoVal, &oValido, &ritmoCardiacoSPO, &bpmValido);


  while (1)
  {
  // borra los primeros 25 datos
    for (byte i = 25; i < 100; i++)
    {
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    // obtiene los ultimos 25 datos de la memoria
    for (byte i = 75; i < 100; i++)
    {
      while (particleSensor.available() == false) 
        particleSensor.check(); 

      digitalWrite(readLED, !digitalRead(readLED));

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); 

/*
      Serial.print(F("red="));
      Serial.print(redBuffer[i], DEC);
      Serial.print(F(", ir="));
      Serial.print(irBuffer[i], DEC);*/

      Serial.print(F(" RITMO CARDIACO="));
      Serial.print(ritmoCardiacoSPO, DEC);
/*
      Serial.print(F(", HRvalid="));
      Serial.print(bpmValido, DEC);
*/
      Serial.print(F(", OXIGENO="));
      Serial.print(oxigenoVal, DEC);
/*
      Serial.print(F(", SPO2Valid="));
      Serial.println(oValido, DEC);*/
    }

    //After gathering 25 new samples recalculate HR and SP02
    maxim_heart_rate_and_oxygen_saturation(irBuffer, boLongitud, redBuffer, &oxigenoVal, &oValido, &ritmoCardiacoSPO, &bpmValido);
  }
  }

/********************************************************************************************************************************/


/*******************************************RITMO CARDIACO**********************************************************************/

void RitmoCardiaco(){
  
  long irValor = particleSensor.getIR();

  if (checkForBeat(irValor) == true)
  {
     // si detecta los beats
    long dVariable = millis() - ultimoB;
    ultimoB = millis();

    bPM = 60 / (dVariable / 1000.0);

    if (bPM < 255 && bPM > 20)
    {
      rangosA[rangoB++] = (byte)bPM; //Store this reading in the array
      rangoB %= tamRango; //Wrap variable

      //Take average of readings
      bpmProm = 0;
      for (byte x = 0 ; x < tamRango ; x++)
        bpmProm += rangosA[x];
      bpmProm /= tamRango;
    }
  }

  
  Serial.print(", BPM=");
  Serial.print(bPM);
  Serial.print(", BPM prom=");
  Serial.print(bpmProm);

  if (irValor < 50000)
    Serial.print(" No esta bien puesto");

  Serial.println();
  
  }


void setup() {

Serial.begin(9600);
Serial.println("INICIANDO SENSORES.");

// Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //400kHz 
  {
    Serial.println("Sensor no detectado ");
    while (1);
  }
  Serial.println("Coloque el sensor en el dedo y haga presion.");

  particleSensor.setup(); 
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0); 
  
   if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) 
  {
    Serial.println(F("Sensor  no detectado."));
    while (1);
  }

  Serial.println(F("Coloque el sensor en el dedo y haga presion."));
  while (Serial.available() == 0) ; 

  
  Serial.read();

  byte brilloLed = 60; // 0=Off to 255=50mA
  byte promedioMuestra = 4; //1, 2, 4, 8, 16, 32
  byte modoLed = 2; // 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte rangoMuestra = 100; //50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulsoW = 411; //69, 118, 215, 411
  int rangoADC = 4096; //2048, 4096, 8192, 16384

  particleSensor.setup(brilloLed, promedioMuestra, modoLed, rangoMuestra, pulsoW, rangoADC); //Configure sensor with these settings
}


/******************************************  LOOP ******************************************************/

void loop() {
  // put your main code here, to run repeatedly:

  SensorOxigeno();

}
