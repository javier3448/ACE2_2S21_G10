#include <SoftwareSerial.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

// $Begin: De ejemplo MAX301002
#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

/********************************SENSOR DE OXIGENO ***************************************/

#define MAX_BRIGHTNESS 255

#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
//Arduino Uno doesn't have enough SRAM to store 100 samples of IR led data and red led data in 32-bit format
//To solve this problem, 16-bit MSB of the sampled data will be truncated. Samples become 16-bit data.

uint16_t irBuffer[100]; //infrared LED sensor data
uint16_t redBuffer[100];  //red LED sensor data
#else
uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data
#endif

int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read
/********************************************* ***************************************/



MAX30105 particleSensor;
const byte RATE_SIZE = 4; 
byte rates[RATE_SIZE]; 
byte rateSpot = 0;
long lastBeat = 0; 
float beatsPerMinute;
int beatAvg;
// #End

SoftwareSerial BT1(BT_RX, BT_TX);

u32 lastTime;
// muestra que vamos a enviar al celular eventualmente
// muestra[0] = temperatura
// muestra[1] = ritmo cardiaco
// muestra[2] = oxigeno
float muestra[3];

void setup()
{
lastTime = millis();

    pinMode(BT_STATE, INPUT);

    // Para el sensor de temperatura (LM45DZ) tome referencia analoga de 0 a 1.1V
    // Arduino uno:
//analogReference(INTERNAL);      // Arduino uno
analogReference(INTERNAL1V1); // Arduino mega

    Serial.begin(9600);
    BT1.begin(38400);

// Initialize sensor
if (!particleSensor.begin(Wire, I2C_SPEED_FAST))
{
Serial.println("MAX30105 no encontrado ");
// @TODO que no se muera todo cuando no encuentra el MAX30105
pinMode(LED_BUILTIN, OUTPUT);
while (1)
{
// El parpadeo del builtin led indica que hay que reiniciar el arduino
// porque no logro comunicarse con el MAX30105
digitalWrite(LED_BUILTIN, HIGH);
delay(200);
digitalWrite(LED_BUILTIN, LOW);
delay(200);
};
}
Serial.println("Place your index finger on the sensor with steady pressure.");

particleSensor.setup(); //Configure sensor with default settings
particleSensor.setPulseAmplitudeRed(0x0A);  
particleSensor.setPulseAmplitudeGreen(0);

setupOxigeno();

}





void loop()
{  
sensorOxigeno();
}

/********************************************* SETUP OXIGENO *******************************/

void setupOxigeno(){
   // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println(F("MAX30105 no encontrado"));
    while (1);
  }

    while (Serial.available() == 0) ; //wait until user presses a key
  Serial.read();

  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
  }


  void sensorOxigeno(){
    
    bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps

  //read the first 100 samples, and determine the signal range
  for (byte i = 0 ; i < bufferLength ; i++)
  {
    while (particleSensor.available() == false) //do we have new data?
      particleSensor.check(); //Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); //We're finished with this sample so move to next sample

    Serial.print("Sin dedo en sensor");

   /* Serial.print(F("red="));
    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", ir="));
    Serial.println(irBuffer[i], DEC);*/
  }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  //Continuously taking samples from MAX30102.  Heart rate and SpO2 are calculated every 1 second
  while (1)
  {
    //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
    for (byte i = 25; i < 100; i++)
    {
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    //take 25 sets of samples before calculating the heart rate.
    for (byte i = 75; i < 100; i++)
    {
      while (particleSensor.available() == false) //do we have new data?
        particleSensor.check(); //Check the sensor for new data

      digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); //We're finished with this sample so move to next sample

      //send samples and calculation result to terminal program through UART
   /*   Serial.print(F("red="));
      Serial.print(redBuffer[i], DEC);
      Serial.print(F(", ir="));
      Serial.print(irBuffer[i], DEC);

      Serial.print(F(", HR="));
      Serial.print(heartRate, DEC);

      Serial.print(F(", HRvalid="));
      Serial.print(validHeartRate, DEC);*/

      Serial.print(F(", SPO2="));
      Serial.print(spo2, DEC);

      Serial.print(F(", SPO2Valid="));
      Serial.println(validSPO2, DEC);

      
    }

    //After gathering 25 new samples recalculate HR and SP02
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);


      // milis for now, explore using micros or something else even
      long currTime = millis();
      u32 deltaTime = currTime - lastTime;
      
      if(deltaTime >= 1000){
      lastTime = currTime;
      sendToBluetooth();
      }
      
      // @quick TODO: better name
      correrCodigoMax301002();
    
  }
    }

void sendToBluetooth()
{
// Nos indica si el modulo esta conectado a otro dispositivo bluetooth
bool isConnected =true;// digitalRead(BT_STATE);

if(isConnected){

{//getTemperatura
float tempC = analogRead(A0);
tempC = (1.1 * tempC * 100.0)/1024.0;
muestra[0] = tempC;
}

//@debug:
Serial.print('$');
Serial.print(muestra[0]);
Serial.print('|');
Serial.print(muestra[1]);
Serial.print('|');
Serial.print(muestra[2]);
Serial.print(';');
Serial.println();

// Enviamos los 3 floats atravez del modulo bluetooth
BT1.print('$');
BT1.print(muestra[0]);
BT1.print('|');
BT1.print(muestra[1]);
BT1.print('|');
BT1.print(muestra[2]);
BT1.print(';');

// [!!!] SI AGREGAMOS CUALQUIER OTRA COSA A NUESTRO 'PAQUETE' TENEMOS QUE
// CAMBIARLO DEL LADO DE ANDROID TAMBIEN!
}
}

// @TODO: averigurar que putas esta pasando aqui realmente y si irValue
// es esto el oxigeno realmente.
void correrCodigoMax301002()
{
long irValue = particleSensor.getIR();

if (checkForBeat(irValue) == true)
{
//We sensed a beat!
long delta = millis() - lastBeat;
lastBeat = millis();

beatsPerMinute = 60 / (delta / 1000.0);

if (beatsPerMinute < 255 && beatsPerMinute > 20)
{
rates[rateSpot++] = (byte)beatsPerMinute;
rateSpot %= RATE_SIZE;

//Take average of readings
beatAvg = 0;
for (byte x = 0 ; x < RATE_SIZE ; x++)
beatAvg += rates[x];
beatAvg /= RATE_SIZE;
}
}

//@debug
// Serial.print(", BPM=");
// Serial.print(beatsPerMinute);
// Serial.print("IR=");
// Serial.print(irValue);
// Serial.print(", Avg BPM=");
// Serial.print(beatAvg);
// Serial.println();

// [!]: enviamos 0 en ritmo cardiaco y 0 en oxigeno si dectamos que no
//      tiene puesto el dedo que, segun el ejemplo de MAX301002 es cuando
//      ir tiene un nivel de 50000
if(irValue < 50000){
    muestra[1] = 0;
    muestra[2] = 0;
}
else{
    muestra[1] = beatsPerMinute;
    muestra[2] = (float)spo2;
}
}
