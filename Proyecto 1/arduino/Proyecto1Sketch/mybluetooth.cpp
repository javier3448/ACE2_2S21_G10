#include "mybluetooth.h"

#include <TinyGPS.h>

#include "mygps.h"
#include "prueba.h"
#include "mymax30102.h"

SoftwareSerial MyBluetooth::btSerial(BT_RX, BT_TX);

void MyBluetooth::setup()
{
    pinMode(BT_STATE, INPUT);
    btSerial.begin(38400);
}

static long lastTimeSent;
void MyBluetooth::restartPlayNaveteePackageEverySecond()
{
    lastTimeSent = millis();
}
void MyBluetooth::sendPlayNaveteePackageEverySecond()
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

        // get posicionAcual
        //{
            float latitudActual;
            float longitudActual;
            unsigned long ageActual;
            MyGps::gps.f_get_position(&latitudActual, &longitudActual, &ageActual);
        //}

    // Armamos los datos que van a ser enviados:

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

        // Conseguimos los datos de los sensores
        //{
            float temperatura;
            {//getTemperatura
                temperatura = analogRead(A0);
                temperatura = (1.1 * temperatura * 100.0)/1024.0;
            }

            float oxigeno = MyMax30102::oxigeno;

            float ritmoCardiaco = MyMax30102::ritmoCardiaco;
        //}

        //@debug:
        Serial.print((char)HeaderPaquete::CORRIENDO_PRUEBA);
        Serial.print(distanciaTotalPrueba);
        Serial.print('|');
        Serial.print(numeroDeRepActual);
        Serial.print('|');
        Serial.print(distanciaRepeticionActual);
        Serial.print('|');
        Serial.print(velocidadTiempoReal);
        Serial.print('|');
        Serial.print(temperatura);
        Serial.print('|');
        Serial.print(ritmoCardiaco);
        Serial.print('|');
        Serial.print(oxigeno);
        Serial.print(';');
        Serial.println();

        btSerial.print((char)HeaderPaquete::CORRIENDO_PRUEBA);
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
        btSerial.print(ritmoCardiaco);
        btSerial.print('|');
        btSerial.print(oxigeno);
        btSerial.print(';');
        // @DEBUG:
        // @NOCHECKIN:
        btSerial.println();
    }
}

void MyBluetooth::sendStartPackageNow()
{
    btSerial.print((char)HeaderPaquete::INICIAR_PRUEBA);
}

void MyBluetooth::sendSuccessPackageNow()
{
    btSerial.print((char)HeaderPaquete::FIN_EXITO);
}
void MyBluetooth::sendFailPackageNow()
{
    btSerial.print((char)HeaderPaquete::FIN_FALLO);
}
void MyBluetooth::sendQuitPackageNow()
{
    btSerial.print((char)HeaderPaquete::FIN_RENDICION);
}

// @TODO SOON: mantener estos comentarios:

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
// #

// distanciaTotalPrueba|

// repeticionActual|
// distanciaRepeticionActual|
// velocidadTiempoReal|

// temperatura|
// ritmo|
// oxigeno
//;

