#include "yfs201.h"

// @TODO: limpiar, simplificar y 'personalizar'
//        preguntar de donde salio el codigo

volatile int Yfs201::numPulsos = 0; //variable para la cantidad de pulsos recibidos
float Yfs201::factor_conversion = 7.5; //para convertir de frecuencia a caudal

float Yfs201::volumen = 0;
long Yfs201::dt = 0;
long Yfs201::t0 = 0;


void Yfs201::setup()
{
    pinMode(YSF201_PIN, INPUT); 
    attachInterrupt(0, contarPulsos, RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)
}

void Yfs201::loop()
{
    float frecuencia = getFrecuencia(); //la Frecuencia de los pulsos en Hz
    float caudal_L_m = frecuencia/factor_conversion; // el caudal en L/m
    float caudal_L_h = caudal_L_m*60; // el caudal en L/h
}

void Yfs201::setupCalculoConsumo()
{
    Serial.begin(9600); 
    pinMode(YSF201_PIN, INPUT); 
    attachInterrupt(0, contarPulsos, RISING);//(Interrupción 0(Pin2),función,Flanco de subida)
    Serial.println ("Envie 'r' para restablecer el volumen a 0 Litros"); 
    t0 = millis();
}

int Yfs201::getFrecuencia()
{
    int frecuencia;
    numPulsos = 0;   //Ponemos a 0 el número de pulsos
    interrupts();    //Habilitamos las interrupciones
    delay(100);   //muestra de 1 segundo
    noInterrupts(); //Deshabilitamos  las interrupciones
    frecuencia = numPulsos; //Hz(pulsos por segundo)
    return frecuencia;
}

void Yfs201::calculoConsumo()
{
    if (Serial.available()) {
        if(Serial.read() == 'r')volumen = 0;//restablecemos el volumen si recibimos 'r'
    }
    float frecuencia = getFrecuencia(); //obtenemos la frecuencia de los pulsos en Hz
    float caudal_L_m = frecuencia/factor_conversion; //calculamos el caudal en L/m
    dt = millis() - t0; //calculamos la variación de tiempo
    t0 = millis();
    volumen = volumen + (caudal_L_m / 60) * (dt / 1000); // volumen(L)=caudal(L/s)*tiempo(s)

    //-----Enviamos por el puerto serie---------------
    Serial.print("Caudal: "); 
    Serial.print(caudal_L_m,3); 
    Serial.print("L/min\tVolumen: "); 
    Serial.print(volumen,3); 
    Serial.println (" L");

}

//---Función que se ejecuta en interrupción---------------
void Yfs201::contarPulsos()
{
    numPulsos++;
}

//---Función para obtener frecuencia de los pulsos--------
int Yfs201::obetenerFrecuencia()
{
    int frecuencia;
    numPulsos = 0;   // 0 el número de pulsos
    interrupts();    //Habilitar  interrupciones
    delay(100);   //muestra cada 1 segundo
    noInterrupts(); //Desabilitar las interrupciones
    frecuencia = numPulsos; //Hz(pulsos por segundo)
    return frecuencia;
}
