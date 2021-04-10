// @TODO: cambiar nombre de este .h al nombre de la prueba (course-navetee)
#include "prueba.h"

#include "mygps.h"
#include "mymax30102.h"

Prueba::State Prueba::stateActual;
Prueba::Posicion Prueba::posicionInicial;
Prueba::Repeticion Prueba::repeticionActual;

static long lastTimeBtSent;
static int8_t countRitmo;

// @TODO: mover aqui temperatura y botones

// @TODO: integrar a la logica del juego si esta conectado o no el bluetooth:
// si se perdio la coneccion cancelar la prueba o algo asi

// @Mejora?: poner Bomba y buzzer en su propio archivo, creo que el hecho que 
// llamemos a Bomba::loop y ::setup desde aqui es algo confuso.
namespace Bomba{
    bool isActive;
    long startTime;

    void setup()
    {
        isActive = false;
        startTime = 0;
        pinMode(MOTOR_PIN, OUTPUT);
    }

    void empezarDosSegundosDeBombeo()
    {
        digitalWrite(MOTOR_PIN, HIGH);
        isActive = true;

        startTime = millis();
    }

    void loop()
    {
        if(!isActive) return;

        long deltaTime = millis() - startTime;
        if(deltaTime > 4000){
            digitalWrite(MOTOR_PIN, LOW);
            isActive = false;
        }
    }
}

namespace Buzzer{

    // @TODO: mejor nombre para los diferentes tipos de tono

    bool isActive = false;
    long startTime = 0;

    bool isActiveExitoso = false;
    long startTimeExitoso = 0;

    void setup()
    {
        isActive = false;
        startTime = 0;

        isActiveExitoso = false;
        startTimeExitoso = 0;

        pinMode(BUZZER_PIN, OUTPUT);
    }

    void empezarDosSegundosDeTono()
    {
        tone(BUZZER_PIN, 1000);
        // digitalWrite(BUZZER_PIN, HIGH);
        isActive = true;

        startTime = millis();
    }

    void empezarTresSegundosDeTonoExitoso()
    {
        digitalWrite(BUZZER_PIN, HIGH);
        isActiveExitoso = true;

        startTimeExitoso = millis();
    }

    static void loop()
    {
        if(isActive)
        {
            long deltaTime = millis() - startTime;
            if(deltaTime > 2000){
                noTone(BUZZER_PIN);
                isActive = false;
            }
        }

        if(isActiveExitoso)
        {
            long deltaTime = millis() - startTimeExitoso;
            if(deltaTime > 4000){
                digitalWrite(BUZZER_PIN, LOW);
                isActiveExitoso = false;
            }
        }
    }
}

static SoftwareSerial btSerial(BT_RX, BT_TX);
inline void sendPlayPackage(int8_t numeroDeRepActual, float distanciaRepeticionActual, 
    long tiempoRepeticionActual, float velocidadTiempoReal, float temperatura, 
    float ritmoCardiaco, float oxigeno);
inline void sendStartPackage();
inline void sendSuccessPackage();
inline void sendFailPackage();
inline void sendQuitPackage();


void Prueba::setup(){
    Prueba::stateActual = State::STOP;
    posicionInicial = {
        latitud : 0,
        longitud : 0,
        age : 0
    };
    repeticionActual = {
        numeroDeRep : 0,
        posicionInicial : {
            latitud : 0,
            longitud : 0,
            age : 0
        },
        tiempoInicial : 0,
    };

    // setupBluetooth
    {
        pinMode(BT_STATE, INPUT);
        btSerial.begin(38400);
    }

    Bomba::setup();
    Buzzer::setup();
}

// @note: para estar en el estado stop, `prueba` deberia de estar en un valor 'sentinel'
// y START lo que hace es pasar a un valor inicial, ya sea desde un 'sentinel' o 
// desde el estado anterio

void Prueba::loop()
{
    // Las cosas que corren por x cantidad de segundos corren sin importar el valor
    // de stateActual (cosas como inflar globo por 2 segundos, buzzer de 2 segundos)
    // gameStateIndependentEvents()
    Bomba::loop();
    Buzzer::loop();

    switch(stateActual)
    {
        case State::STOP:
        {
            if(!digitalRead(BUTTON_START_PIN))
            { 
                { //stuff we need to do before we go to State::PLAY for the first time
                    float currLatitud;
                    float currLongitud;
                    unsigned long currAge;
                    MyGps::gps.f_get_position(&currLatitud, &currLongitud, &currAge);

                    posicionInicial.latitud = currLatitud;
                    posicionInicial.longitud = currLongitud;

                    repeticionActual = {
                        numeroDeRep : 1,
                        posicionInicial : {
                            latitud : currLatitud,
                            longitud : currLongitud,
                            age : currAge
                        },
                        // reiniciar temporizador de 'repeticion cada minuto'
                        tiempoInicial : millis(),
                    };

                    sendStartPackage();

                    // reiniciar temporizador de 'send playPackage every second'
                    lastTimeBtSent = millis();

                    // reiniciar conteo de ritmo cardiaco
                    countRitmo = 0;
                }
                stateActual = State::PLAY;
                return;
            }
        }break;

        case State::PLAY:
        {

            if(!digitalRead(BUTTON_QUIT_PIN)){
                Bomba::empezarDosSegundosDeBombeo();
                sendQuitPackage();
                stateActual = State::STOP;
                return;
            }

            // cada segundo enviamos por bluetooth y revisamos que no falle la 
            // prueba por ritmo cardiaco
            long currTimeBtSent = millis();
            long deltaTimeBtSent = currTimeBtSent - lastTimeBtSent;
            if(deltaTimeBtSent >= 1000l)
            {
                lastTimeBtSent = currTimeBtSent;

                // get posicionAcual
                float latitudActual;
                float longitudActual;
                unsigned long ageActual;
                MyGps::gps.f_get_position(&latitudActual, &longitudActual, &ageActual);

            // Armamos los datos que van a ser enviados:

                // Conseguimos todos los datos de la prueba
                auto numeroDeRepActual = repeticionActual.numeroDeRep;
                float distanciaRepeticionActual = TinyGPS::distance_between(
                    latitudActual, longitudActual, 
                    Prueba::repeticionActual.posicionInicial.latitud, Prueba::repeticionActual.posicionInicial.longitud
                );
                long tiempoRepeticionActual = millis() - Prueba::repeticionActual.tiempoInicial;
                float velocidadTiempoReal = MyGps::gps.f_speed_kmph();

                // Conseguimos los datos de los sensores
                float temperatura =  (1.1 * analogRead(TEMPERATURE_PIN) * 100.0)/1024.0;
                float oxigeno = MyMax30102::oxigeno;
                float ritmoCardiaco = MyMax30102::ritmoCardiaco;

                sendPlayPackage(numeroDeRepActual, distanciaRepeticionActual, tiempoRepeticionActual, velocidadTiempoReal, temperatura, ritmoCardiaco, oxigeno);

                // @TODO
                // @Mejora: Sacar promedio de los ultimos 4, no que se pasen de
                // cierto umbral

                // Revisamos si los ultimos 4 ritmos enviados son muy altos
                {
                    if(ritmoCardiaco > RITMO_ALTO){
                        countRitmo++;
                        if(countRitmo >= 4){
                            // FALLAR PRUEBA
                            Bomba::empezarDosSegundosDeBombeo();
                            sendFailPackage();
                            stateActual = State::STOP;
                            return;
                        }
                    }
                    else{
                        countRitmo = 0;
                    }
                }
            }


            // siguiente repeticion cada minuto
            long currTimeRepeticion = millis();
            long deltaTimeRepeticion = currTimeRepeticion - repeticionActual.tiempoInicial;
            if(deltaTimeRepeticion >= 1000l * 60l)
            {
                if(repeticionActual.numeroDeRep >= 21){
                    // Serial.println("Prueba completad exitosamente");
                    Buzzer::empezarTresSegundosDeTonoExitoso();
                    sendSuccessPackage();
                    stateActual = State::STOP;
                    return;
                }
                else{
                    //Ir a siguiente repeticion
                    float currLatitud;
                    float currLongitud;
                    unsigned long currAge;
                    MyGps::gps.f_get_position(&currLatitud, &currLongitud, &currAge);

                    repeticionActual = {
                        numeroDeRep : repeticionActual.numeroDeRep + 1,
                        posicionInicial : {
                            latitud : currLatitud,
                            longitud : currLongitud,
                            age : currAge
                        },
                        tiempoInicial : currTimeRepeticion,
                    };

                    // Serial.println("siguiente repeticion");
                    Buzzer::empezarDosSegundosDeTono();
                }
            }
        }break;
    }
}

// DE AQUI EN ADELANTE TODO LO QUE BLUETOOTH:

// @TODO: organizar lo bluetooth como namespace, igual que como hicimos con Bomba
// y Buzzer


enum HeaderPaquete : char{
    INICIAR_PRUEBA = '!',
    CORRIENDO_PRUEBA = '#',
    FIN_EXITO = '$',
    FIN_RENDICION = '%',
    FIN_FALLO = '&',
};

inline void sendPlayPackage(int8_t numeroDeRepActual, float distanciaRepeticionActual, 
    long tiempoRepeticionActual, float velocidadTiempoReal, float temperatura, 
    float ritmoCardiaco, float oxigeno)
{
    //@debug:
    Serial.print((char)HeaderPaquete::CORRIENDO_PRUEBA);
    Serial.print(numeroDeRepActual);
    Serial.print('|');
    Serial.print(tiempoRepeticionActual);
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
    btSerial.print(numeroDeRepActual);
    btSerial.print('|');
    btSerial.print(tiempoRepeticionActual);
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
    // @DEBUG:
    // @DEBUG:
    btSerial.println();
}

inline void sendStartPackage()
{
    // @debug:
    Serial.println((char)HeaderPaquete::INICIAR_PRUEBA);

    btSerial.print((char)HeaderPaquete::INICIAR_PRUEBA);
}
inline void sendSuccessPackage()
{
    // @debug:
    Serial.println((char)HeaderPaquete::FIN_EXITO);

    btSerial.print((char)HeaderPaquete::FIN_EXITO);
}
inline void sendFailPackage()
{
    // @debug:
    Serial.println((char)HeaderPaquete::FIN_FALLO);

    btSerial.print((char)HeaderPaquete::FIN_FALLO);
}
inline void sendQuitPackage()
{
    // @debug:
    Serial.println((char)HeaderPaquete::FIN_RENDICION);

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

// repeticionActual|
// distanciaRepeticionActual|
// tiempoRepeticionActual|
// velocidadTiempoReal|

// temperatura|
// ritmo|
// oxigeno
//;


