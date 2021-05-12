#include <SoftwareSerial.h>
#include <Wire.h>

#include <TinyGPS.h>

#include "pindefs.h"

#include "prueba.h"
#include "mygps.h"
#include "mymax30102.h"

// @NOCHECKIN:
#include "simpleevents.h"
#include "mylcd.h"
#include <LiquidCrystal_I2C.h>

// @Mejora?: tener una global donde estan todos los datos medidos 
// {
//     int8_t numeroDeRepActual, 
//     float distanciaRepeticionActual, 
//     long tiempoRepeticionActual, 
//     float velocidadTiempoReal, 
//     float temperatura, 
//     float ritmoCardiaco, 
//     float oxigeno, 
//     float calories
// }
// y que las diferentes partes del codigo solo lean o escriban ahi
// y poner un par de valores sentinela ahi para que se sepa el dato no es valido/no esta disponible

void setup()
{
    Serial.begin(9600);

    MyLcd::setup();

    // setup buttons
    {
        pinMode(BUTTON_START_PIN, INPUT_PULLUP);
        pinMode(BUTTON_QUIT_PIN, INPUT_PULLUP);
    }

    // setup temperatura
    {
        // Para el sensor de temperatura (LM45DZ) tome referencia analoga de 0 a 1.1V
        // Arduino uno:
        analogReference(INTERNAL);      // Arduino uno
        //analogReference(INTERNAL1V1); // Arduino mega
    }

    MyMax30102::setup();

    Prueba::setup();

    // [!!!!!!!!]: 
    // ES MUY MUY IMPORTATE QUE LLAMEMOS A MyGps::setup() DESPUES QUE A Prueba::setup()
    // Porque Prueba::setup() tabmien crea una instancia de un SoftwareSerial, dicha instancia empieza
    // a escuchar con .listen(). SOLO PODEMOS TENER UNA DE ESAS INSTANCIAS ESCUCHANDO!!!!
    // Como en el bluetooth solo enviamos y no escuchamos, no importa que solo MyGps::gpsSerial pueda
    // escuchar.
    // [!?!?] D:  (POSIBLE BUG!)
    // Creo que tampoco podemos escribir al bluetooth mientras gpsSerial.available()
    // porque cuando probamos imprimir todo lo que recibe el gps atravez del bluetooth
    // se como que corrompio todo :( (@TODO: ver que esta pasando!)
    // no nos a afectado en las pruebas porque es poco probable que mandemos por
    // bluetooth mientras gpsSerial.available() y el gps.encode se repecupera
    // si se enviamos un ''paquete gps'' corroto
    MyGps::setup();

    MyLcd::lcd.print("Welcome!");
}

void loop()
{  
    MyGps::loop();

    MyMax30102::loop();

    Prueba::loop();
}
