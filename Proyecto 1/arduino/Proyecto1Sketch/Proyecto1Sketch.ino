#include <SoftwareSerial.h>
#include <Wire.h>

#include <MAX30105.h>
#include <heartRate.h>
#include <TinyGPS.h>

#define BT_RX 10
#define BT_TX 11
#define BT_STATE 12

#define GPS_TX 3
#define GPS_RX 4

#define MOTOR_PIN 2

MAX30105 particleSensor;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
int beatAvg;

// Los valores que se enviaran en el siguiente 'paquete' bluetooth
float temperaturaAEnviar;
float ritmoCardiacoAEnviar;
float oxigenoAEnviar;
float latitudAEnviar;
float longitudAEnviar;
unsigned long ageAEnviar;

SoftwareSerial btSerial(BT_RX, BT_TX);

SoftwareSerial gpsSerial(GPS_RX, GPS_TX);
TinyGPS gps;

void setup()
{
    // setup motor:
    {
        pinMode(2, OUTPUT);
    }

    // setup bluetooth:
    {
        pinMode(BT_STATE, INPUT);
        btSerial.begin(38400);
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

    // set up gps
    {
        gpsSerial.begin(9600); 
    }

    Serial.begin(9600);
}

void loop()
{  
    bool isConnected = digitalRead(BT_STATE);
    if(isConnected){
        sendToBluetoothEverySecond();
    }

    { // encode gps
        while(gpsSerial.available())
        {
            char c = gpsSerial.read();
            // Serial.write(c); // uncomment this line if you want to see the GPS data flowing
            gps.encode(c);
        }
    }

    correrCodigoMax301002();
}

// @MEJORA?: mover toda la logica de bluetooth a otro archivo?
// @TODO: nombre que nos indique que este codigo debe corre 'concurrentemente'
// ie que adentro lidea con todo el estado que implica llevar un DeltaTime
long bluetoothLastTime = 0;
void sendToBluetoothEverySecond()
{
    // millis for now, explore using micros or something else even

    // si no ha pasado 1 segundo desde la ultima vez que mandamos por bluetooth
    // retornamos de esta funcion sin hacer nada mas
    long bluetoothCurrTime = millis();
    long bluetoothDeltaTime = bluetoothCurrTime - bluetoothLastTime;
    if(bluetoothDeltaTime < 1000)
    {
        return;
    }
    else
    {
        bluetoothLastTime = bluetoothCurrTime;
        // @TODO: mover afuera de aqui

        {//getTemperatura
            float tempC = analogRead(A0);
            tempC = (1.1 * tempC * 100.0)/1024.0;
            temperaturaAEnviar = tempC;
        }

        {//get position
            gps.f_get_position(&latitudAEnviar, &longitudAEnviar, &ageAEnviar);
        }

        //@debug:
        Serial.print('$');
        Serial.print(temperaturaAEnviar);
        Serial.print('|');
        Serial.print(ritmoCardiacoAEnviar);
        Serial.print('|');
        Serial.print(oxigenoAEnviar);
        Serial.print('|');
        Serial.print(latitudAEnviar);
        Serial.print('|');
        Serial.print(longitudAEnviar);
        Serial.print('|');
        Serial.print(ageAEnviar);
        Serial.print(';');
        Serial.println();

        // $temperatura|ritmo|oxigeno|latitud|longitud|age;
        // Enviamos los 3 floats atravez del modulo bluetooth
        btSerial.print('$');
        btSerial.print(temperaturaAEnviar);
        btSerial.print('|');
        btSerial.print(ritmoCardiacoAEnviar);
        btSerial.print('|');
        btSerial.print(oxigenoAEnviar);
        btSerial.print('|');
        btSerial.print(latitudAEnviar);
        btSerial.print('|');
        btSerial.print(longitudAEnviar);
        btSerial.print('|');
        btSerial.print(ageAEnviar);
        btSerial.print(';');
        // @DEBUG:
        btSerial.println();
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
        ritmoCardiacoAEnviar = 0;
        oxigenoAEnviar = 0;
    }
    else{
        ritmoCardiacoAEnviar = beatsPerMinute;
      // Chapuz para que retorne valores de oxigenacion mas razonables. No esta basado en 
      // ninguna formula ni nada, suponemos que la relacion entre lo que retorna el sensor
      // y la oxigenacion en la sangre es lineal
       oxigenoAEnviar = ((float)irValue) / 1100;
    }
}
