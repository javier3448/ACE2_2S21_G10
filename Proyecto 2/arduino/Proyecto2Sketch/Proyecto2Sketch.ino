#include <SoftwareSerial.h>
#include <Wire.h>

#include <TinyGPS.h>

#include "pindefs.h"

#include "prueba.h"
#include "mygps.h"
#include "mymax30102.h"

// @NOCHECKIN:
#include "simpleevents.h"
#include <LiquidCrystal_I2C.h>

// @TODO: Valores sentinela

// @TODO: traducir todo lo que esta en ingles

// @NOCHECKIN:
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
SimpleEvents simpleEvents = SimpleEvents();
constexpr char* initialMessageFirstLine = "toggle: ";
constexpr int8_t initialMessageFirstLineLength = 8;
constexpr char* initialMessageSecondLine = "currTime: ";
constexpr int8_t initialMessageSecondLineLength = 10;

void setup()
{
    Serial.begin(9600);

    // @NOCHECKIN:
    { //setup lcd
        lcd.init();                      // initialize the lcd 
        lcd.backlight();

        lcd.setCursor(0, 0);
        lcd.print(initialMessageFirstLine);
        lcd.setCursor(0, 1);
        lcd.print(initialMessageSecondLine);
    }
    { // setup events
        simpleEvents.addEvent(0, 750, printInLcd);
        //simpleEvents.addEvent(1, 500, printRitmo);
    }

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


}

// @NOCHECKIN:
void printInLcd()
{
    static byte toggle = 0;
    toggle = toggle ^ 1;
    lcd.setCursor(initialMessageFirstLineLength, 0);
    lcd.print(toggle);
    lcd.setCursor(initialMessageSecondLineLength, 1);
    lcd.print(millis());
}
void printRitmo()
{
    float ritmoCardiaco = MyMax30102::ritmoCardiaco;
    float oxigeno = MyMax30102::oxigeno;
    Serial.print("ritmo cardiaco: ");
    Serial.println(ritmoCardiaco);
    Serial.print("oxigeno: ");
    Serial.println(oxigeno);
}

void loop()
{  
    MyGps::loop();

    MyMax30102::loop();

    Prueba::loop();

    // @NOCHECKIN:
    simpleEvents.loop();
}
