#include "mybluetooth.h"

#include "mygps.h"

SoftwareSerial MyBluetooth::btSerial(BT_RX, BT_TX);

float MyBluetooth::Package::ritmoCardiaco = 0;
float MyBluetooth::Package::oxigeno = 0;

void MyBluetooth::setup()
{
    pinMode(BT_STATE, INPUT);
    btSerial.begin(38400);
}

static long lastTimeSent;
void MyBluetooth::restartSendToBluetoothEverySecond()
{
    lastTimeSent = millis();
}
void MyBluetooth::sendToBluetoothEverySecond()
{
    // millis for now, explore using micros or something else even

    // si no ha pasado 1 segundo desde la ultima vez que mandamos por bluetooth
    // retornamos de esta funcion sin hacer nada mas
    long currTime = millis();
    long deltaTime = currTime - lastTimeSent;
    if(deltaTime < 1000)
    {
        return;
    }
    else
    {
        lastTimeSent = currTime;

        // if the bluetooth module is not connected we dont send any data
        if(!digitalRead(BT_STATE)) return;

        float temperaturaAEnviar;
        {//getTemperatura
            temperaturaAEnviar = analogRead(A0);
            temperaturaAEnviar = (1.1 * temperaturaAEnviar * 100.0)/1024.0;
        }

        float latitudAEnviar;
        float longitudAEnviar;
        unsigned long ageAEnviar;
        float velocidadAEnviar;
        {//get data from gps
            MyGps::gps.f_get_position(&latitudAEnviar, &longitudAEnviar, &ageAEnviar);
            velocidadAEnviar = MyGps::gps.f_speed_kmph();
        }

        //@debug:
        Serial.print('$');
        Serial.print(temperaturaAEnviar);
        Serial.print('|');
        Serial.print(Package::ritmoCardiaco);
        Serial.print('|');
        Serial.print(Package::oxigeno);
        Serial.print('|');
        Serial.print(latitudAEnviar);
        Serial.print('|');
        Serial.print(longitudAEnviar);
        Serial.print('|');
        Serial.print(ageAEnviar);
        Serial.print('|');
        Serial.print(velocidadAEnviar);
        Serial.print(';');
        Serial.println();

        // $temperatura|ritmo|oxigeno|latitud|longitud|age;
        // Enviamos los 3 floats atravez del modulo bluetooth
        btSerial.print('$');
        btSerial.print(temperaturaAEnviar);
        btSerial.print('|');
        btSerial.print(Package::ritmoCardiaco);
        btSerial.print('|');
        btSerial.print(Package::oxigeno);
        btSerial.print('|');
        btSerial.print(latitudAEnviar);
        btSerial.print('|');
        btSerial.print(longitudAEnviar);
        btSerial.print('|');
        btSerial.print(ageAEnviar);
        btSerial.print('|');
        btSerial.print(velocidadAEnviar);
        btSerial.print(';');
        // @DEBUG:
        btSerial.println();
    }
}