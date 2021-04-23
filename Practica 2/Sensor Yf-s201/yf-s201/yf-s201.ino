//SENSOR DE FLUJO DE AGUA, CAMBIAR PARA OBTENER FLUJO DE AIRE

volatile int NumPulsos; //variable para la cantidad de pulsos recibidos
int PinSensor =  2;    //Sensor conectado en el pin 2
float factor_conversion = 7.5; //para convertir de frecuencia a caudal

//**VARIABLES DE CONSUMO
//volatile int NumPulsos; //variable para la cantidad de pulsos recibidos
//int PinSensor = 2;    //Sensor conectado en el pin 2
//float factor_conversion=7.11; //para convertir de frecuencia a caudal  *** CAMBIANDO FRECUENCIA
float volumen = 0;
long dt = 0; //variación de tiempo por cada bucle
long t0 = 0; //millis() del bucle anterior

void setup()
{ 
    Serial.begin(9600); 
    pinMode(PinSensor, INPUT); 
    attachInterrupt(0,ContarPulsos,RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)
} 

void loop ()    
{
    float frecuencia = ObtenerFrecuencia(); //la Frecuencia de los pulsos en Hz
    float caudal_L_m = frecuencia/factor_conversion; // el caudal en L/m
    float caudal_L_h = caudal_L_m*60; // el caudal en L/h

    //-----Enviamos por el puerto serie---------------
    Serial.print("FrecuenciaPulsos: "); 
    Serial.print(frecuencia,0); 
    Serial.print("Hz\tCaudal: "); 
    Serial.print(caudal_L_m,3); 
    Serial.print(" L/m\t"); 
    Serial.print(caudal_L_h,3); 
    Serial.println("L/h"); 
}

//************************************CONSUMO
void setupCalculoConsumo() 
{ 
    Serial.begin(9600); 
    pinMode(PinSensor, INPUT); 
    attachInterrupt(0,ContarPulsos,RISING);//(Interrupción 0(Pin2),función,Flanco de subida)
    Serial.println ("Envie 'r' para restablecer el volumen a 0 Litros"); 
    t0 = millis();
} 

int ObtenerFrecuecia() 
{
    int frecuencia;
    NumPulsos = 0;   //Ponemos a 0 el número de pulsos
    interrupts();    //Habilitamos las interrupciones
    delay(100);   //muestra de 1 segundo
    noInterrupts(); //Deshabilitamos  las interrupciones
    frecuencia = NumPulsos; //Hz(pulsos por segundo)
    return frecuencia;
}
void CalculoConsumo ()    
{
    if (Serial.available()) {
        if(Serial.read() == 'r')volumen=0;//restablecemos el volumen si recibimos 'r'
    }
    float frecuencia = ObtenerFrecuecia(); //obtenemos la frecuencia de los pulsos en Hz
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
void ContarPulsos ()
{ 
    NumPulsos++;  //incrementala variable de pulsos
} 

//---Función para obtener frecuencia de los pulsos--------
int ObtenerFrecuencia() 
{
    int frecuencia;
    NumPulsos = 0;   // 0 el número de pulsos
    interrupts();    //Habilitar  interrupciones
    delay(100);   //muestra cada 1 segundo
    noInterrupts(); //Desabilitar las interrupciones
    frecuencia = NumPulsos; //Hz(pulsos por segundo)
    return frecuencia;
}
