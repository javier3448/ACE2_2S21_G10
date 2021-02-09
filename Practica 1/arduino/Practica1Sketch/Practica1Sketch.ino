#include <SoftwareSerial.h>

#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

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
}
 
void loop()
{  
	// Nos indica si el modulo esta conectado a otro dispositivo bluetooth
	bool isConnected = digitalRead(BT_STATE);

	if(isConnected){
		float muestra[] = {
			getTemperatura(),
			getRitmoCardiaco(),
			getOxigeno()
		};

		//@debug:
		Serial.println(muestra[0]);
		Serial.println(muestra[1]);
		Serial.println(muestra[2]);

		// Enviamos los 3 floats atravez del modulo bluetooth
		BT1.write((char*)muestra, sizeof(muestra));

		//@debug: un salto de linea para que sea mas facil de leer en la aplicacion
		//de bluetooth que estamos usando para hacer pruebas
		BT1.println();
	}

	// @Mejora: Quisiera revisara si el modulo esta conectado cada 100-500 milis
	// pero que solo tomara muestreo cada 1000 milis. Para que la primera muestra
	// que tome el usuario se sienta inmediata y no tenga que esperar hasta
	// 1000 milis
	delay(1000);
}

float getTemperatura(){
	float tempC = analogRead(A0);
	tempC = (1.1 * tempC * 100.0)/1024.0;
	return tempC;
}

// @TODO:
float getRitmoCardiaco(){
	return 0;
}

// @TODO:
float getOxigeno(){
	return 0;
}
