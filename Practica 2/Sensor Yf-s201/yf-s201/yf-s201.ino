//SENSOR DE FLUJO DE AGUA, CAMBIAR PARA OBTENER FLUJO DE AIRE

volatile int NumPulsos; //variable para la cantidad de pulsos recibidos
int PinSensor = 2;    //Sensor conectado en el pin 2
float factor_conversion=7.5; //para convertir de frecuencia a caudal

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
  delay(1000);   //muestra cada 1 segundo
  noInterrupts(); //Desabilitar las interrupciones
  frecuencia=NumPulsos; //Hz(pulsos por segundo)
  return frecuencia;
}

void setup()
{ 
  Serial.begin(9600); 
  pinMode(PinSensor, INPUT); 
  attachInterrupt(0,ContarPulsos,RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)
} 

void loop ()    
{
  float frecuencia=ObtenerFrecuencia(); //la Frecuencia de los pulsos en Hz
  float caudal_L_m=frecuencia/factor_conversion; // el caudal en L/m
  float caudal_L_h=caudal_L_m*60; // el caudal en L/h

  //-----Enviamos por el puerto serie---------------
  Serial.print ("FrecuenciaPulsos: "); 
  Serial.print (frecuencia,0); 
  Serial.print ("Hz\tCaudal: "); 
  Serial.print (caudal_L_m,3); 
  Serial.print (" L/m\t"); 
   Serial.print (caudal_L_h,3); 
  Serial.println ("L/h"); 
}
