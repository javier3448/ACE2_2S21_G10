#include <SoftwareSerial.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

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

// Para arduino uno:
SoftwareSerial BT1(BT_RX, BT_TX);
// @TODO: definir el puerto serial para arduino mega:

// Cada segundo vamos a mandarle a el despositivo que este conectado por bluetooth
// 3 floats (12 bytes en total)
// los primeros 4 bytes son el primer float la *temperatura* medida
// los siguientes 4 bytes son el segundo float el *ritmo cardiaco* medido
// los ultimos 4 bytes son el tercer float el *oxigeno* medido

void setup()
{ 
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
		while (1);
	}
	Serial.println("Place your index finger on the sensor with steady pressure.");

	particleSensor.setup(); //Configure sensor with default settings
	particleSensor.setPulseAmplitudeRed(0x0A);  
	particleSensor.setPulseAmplitudeGreen(0); 
}


// [???]
// Que pasa si prendemos y apagamos el arduino :

void loop()
{  
	// Nos indica si el modulo esta conectado a otro dispositivo bluetooth
	bool isConnected = digitalRead(BT_STATE);

	if(isConnected){
		float muestra[3];

		getMuestra(muestra);

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
		//@debug: un salto de linea para que sea mas facil de leer en la aplicacion
		//de bluetooth que estamos usando para hacer pruebas
		//BT1.println();
	}

	// @Mejora: Quisiera revisara si el modulo esta conectado cada 100-500 milis
	// pero que solo tomara muestreo cada 1000 milis. Para que la primera muestra
	// que tome el usuario se sienta inmediata y no tenga que esperar hasta
	// 1000 milis
	delay(1000);
}

// @TODO: organizar todo despues de 'refactorizacion'
// @TODO: Agrupar todo bien bien

void getMuestra(float* muestra)
{
	{//getTemperatura
		float tempC = analogRead(A0);
		tempC = (1.1 * tempC * 100.0)/1024.0;
		muestra[0] = tempC;
	}

	// @TODO: Que no se trabe cuando el mensaje quede incompleto
	{//get ritmo cardiaco y oxigeno
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
		Serial.print(", BPM=");
		Serial.print(beatsPerMinute);
		Serial.print("IR=");
		Serial.print(irValue);
		Serial.print(", Avg BPM=");
		Serial.print(beatAvg);

		if (irValue < 50000)
	    	Serial.print(" No finger?");

	    muestra[1] = beatsPerMinute;
	    muestra[2] = (float)irValue;

		Serial.println();
	}

}




