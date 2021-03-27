#include "mybluetooth.h"

#include <TinyGPS.h>

#include "mygps.h"
#include "prueba.h"

SoftwareSerial MyBluetooth::btSerial(BT_RX, BT_TX);

MyBluetooth::HeaderPaquete MyBluetooth::Paquete::headerPaquete = (MyBluetooth::HeaderPaquete)0xff;
float MyBluetooth::Paquete::ritmoCardiaco = 0;
float MyBluetooth::Paquete::oxigeno = 0;

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
        // @Debug:
        // if the bluetooth module is not connected we dont send any data
        if(!digitalRead(BT_STATE))
        {
            Serial.println("sendToBluetoothNow(): No se pudo enviar paquete por blutooth porque el modulo bluetooth esta desconectado!");
            return;
        } 

        float temperatura;
        {//getTemperatura
            temperatura = analogRead(A0);
            temperatura = (1.1 * temperatura * 100.0)/1024.0;
        }

        // get posicionAcual
        //{
            float latitudActual;
            float longitudActual;
            unsigned long ageActual;
            MyGps::gps.f_get_position(&latitudActual, &longitudActual, &ageActual);
        //}

        // Conseguimos todos los datos de la prueba
        //{
            float distanciaTotalPrueba = TinyGPS::distance_between(
                latitudActual, longitudActual, 
                Prueba::posicionInicial.latitud, Prueba::posicionInicial.longitud
            );

            auto& numeroDeRepActual = Prueba::repeticionActual.numeroDeRep;

            float distanciaRepeticionActual = TinyGPS::distance_between(
                latitudActual, longitudActual, 
                Prueba::repeticionActual.posicionInicial.latitud, Prueba::repeticionActual.posicionInicial.longitud
            );

            float velocidadTiempoReal = MyGps::gps.f_speed_kmph();
        //}

        float velocidadAEnviar;

        //@debug:

        btSerial.print('$');
        btSerial.print(Paquete::headerPaquete);
        btSerial.print('|');
        btSerial.print(distanciaTotalPrueba);
        btSerial.print('|');
        btSerial.print(numeroDeRepActual);
        btSerial.print('|');
        btSerial.print(distanciaRepeticionActual);
        btSerial.print('|');
        btSerial.print(velocidadTiempoReal);
        btSerial.print('|');
        btSerial.print(temperatura);
        btSerial.print('|');
        btSerial.print(Paquete::ritmoCardiaco);
        btSerial.print('|');
        btSerial.print(Paquete::oxigeno);
        btSerial.print(';');
        // @DEBUG:
        // @NOCHECKIN:
        btSerial.println();
    }
}

// @DECISION: vamos a mandar distancias en vez de coordenadas porque son menso bytes,
// son faciles de obtener con la libreria TinyGps y son faciles de entender

// @DECISION: No vamos a hacer ningun calculos de promedio, minimo y maximo desde
// el arduino porque no quiero que el 'paquete bluetooth' sea muy pesado. Mejor desde
// android. ()

// son faciles de obtener con la libreria TinyGps y son faciles de entender

// Necesitamos, enviar la logica de juego para que del otro lado puedan ir acumulando
// los datos necesarios para guardar una prueba completa Y los datos necesarios
// para presentar los reportes de tiempo real

// Example of bluetooth message encoding (ignore linejumps or blank spaces)
// Si estado no es 0 el resto del paquete no tiene datos validos
// $

// headerPaquete| 
// distanciaTotalPrueba|

// repeticionActual|
// distanciaRepeticionActual|
// velocidadTiempoReal|

// temperatura|
// ritmo|
// oxigeno
//;

