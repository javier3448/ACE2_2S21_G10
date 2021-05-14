#include "mymax30102.h"

#include <MAX30105.h>
#include <heartRate.h>

float MyMax30102::ritmoCardiaco = 0;
float MyMax30102::oxigeno = 0;

static MAX30105 particleSensor;
static const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
static byte rates[RATE_SIZE]; //Array of heart rates
static byte rateSpot = 0;
static long lastBeat = 0; //Time at which the last beat occurred
static float beatsPerMinute;
static int beatAvg;

void MyMax30102::setup()
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

// @TODO: averigurar que esta pasando aqui realmente y si irValue
// es esto el oxigeno realmente. 
void MyMax30102::loop()
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

    // [!]: 0 en ritmo cardiaco y 0 en oxigeno si dectamos que el usuario no
    //      tiene su dedo en el Max30102 que segun el ejemplo de MAX301002,
    //      ocurre si su irValue es menor a 50000
    if(irValue < 50000){
        MyMax30102::ritmoCardiaco = 0;
        MyMax30102::oxigeno = 0;
    }
    else{
        MyMax30102::ritmoCardiaco = beatsPerMinute;
        // Chapuz para que retorne valores de oxigenacion mas razonables. No esta basado en 
        // ninguna formula ni nada, suponemos que la relacion entre lo que retorna el sensor
        // y la oxigenacion en la sangre es lineal
        MyMax30102::oxigeno = ((float)irValue) / 1100.0;
    }
}
