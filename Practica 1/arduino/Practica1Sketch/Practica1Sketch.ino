#include <SoftwareSerial.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// $Begin: De ejemplo MAX301002
#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

MAX30105 particleSensor;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
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
	analogReference(INTERNAL);      // Arduino uno
	//analogReference(INTERNAL1V1); // Arduino mega

    Serial.begin(9600);
    BT1.begin(38400); 

	// Initialize sensor
	if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) 
	{
		Serial.println("MAX30105 was not found. Please check wiring/power. ");
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
}


void loop()
{  

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

void sendToBluetooth()
{
	// Nos indica si el modulo esta conectado a otro dispositivo bluetooth
	bool isConnected = digitalRead(BT_STATE);

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
    	muestra[2] = (float)irValue;
	}
}
