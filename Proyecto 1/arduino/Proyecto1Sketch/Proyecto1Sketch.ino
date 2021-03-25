#include <SoftwareSerial.h>
#include <Wire.h>

#include <MAX30105.h>
#include <heartRate.h>
#include <TinyGPS.h>

#include "pindefs.h"

#include "prueba.h"
#include "mygps.h"
#include "mybluetooth.h"

// @TODO: Valores sentinela

MAX30105 particleSensor;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
int beatAvg;

void setup()
{

    // setup buzzer
    {
        pinMode(BUZZER_PIN, OUTPUT);
    }

    // setup buttons
    {
        pinMode(BUTTON_START_PIN, INPUT_PULLUP);
        pinMode(BUTTON_QUIT_PIN, INPUT_PULLUP);
    }

    // setup motor:
    {
        pinMode(2, OUTPUT);
    }


    // setup temperatura
    {
        // Para el sensor de temperatura (LM45DZ) tome referencia analoga de 0 a 1.1V
        // Arduino uno:
        analogReference(INTERNAL);      // Arduino uno
        //analogReference(INTERNAL1V1); // Arduino mega
    }

    // setup sensor de ritmo cardiaco y oxigeno
    {
        if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) 
        {
            Serial.println("MAX30105 was not found. Please check wiring/power. ");
            // @TODO que no se muera todo cuando no encuentra el MAX30105
            // o que haga eso cuando no se logre conectar con cualquier otro sensor
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
        particleSensor.setup(); //Configure sensor with default settings
        particleSensor.setPulseAmplitudeRed(0x0A);  
        particleSensor.setPulseAmplitudeGreen(0); 
    }

    MyGps::setup();

    MyBluetooth::setup();

    Serial.begin(9600);
}

void loop()
{  
    MyBluetooth::sendToBluetoothEverySecond();

    MyGps::loop();

    correrCodigoMax301002();
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
        MyBluetooth::Package::ritmoCardiaco = 0;
        MyBluetooth::Package::oxigeno = 0;
    }
    else{
        MyBluetooth::Package::ritmoCardiaco = beatsPerMinute;
        // Chapuz para que retorne valores de oxigenacion mas razonables. No esta basado en 
        // ninguna formula ni nada, suponemos que la relacion entre lo que retorna el sensor
        // y la oxigenacion en la sangre es lineal
        MyBluetooth::Package::oxigeno = ((float)irValue) / 1100.0;
    }
}
