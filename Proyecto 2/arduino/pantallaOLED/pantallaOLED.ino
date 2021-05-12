
#include <Adafruit_GFX.h>        //OLED libraries
#include <Adafruit_SSD1306.h>
#include "heartRate.h"  


#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels
#define OLED_RESET    -1 // Reset pin # (or -1 if sharing Arduino reset pin)


Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET); //Declaring the display name (display)

static const unsigned char PROGMEM logo2_bmp[] =
{ 0x03, 0xC0, 0xF0, 0x06, 0x71, 0x8C, 0x0C, 0x1B, 0x06, 0x18, 0x0E, 0x02, 0x10, 0x0C, 0x03, 0x10,              //Logo2 and Logo3 are two bmp pictures that display on the OLED if called
0x04, 0x01, 0x10, 0x04, 0x01, 0x10, 0x40, 0x01, 0x10, 0x40, 0x01, 0x10, 0xC0, 0x03, 0x08, 0x88,
0x02, 0x08, 0xB8, 0x04, 0xFF, 0x37, 0x08, 0x01, 0x30, 0x18, 0x01, 0x90, 0x30, 0x00, 0xC0, 0x60,
0x00, 0x60, 0xC0, 0x00, 0x31, 0x80, 0x00, 0x1B, 0x00, 0x00, 0x0E, 0x00, 0x00, 0x04, 0x00,  };

static const unsigned char PROGMEM logo3_bmp[] =
{ 0x01, 0xF0, 0x0F, 0x80, 0x06, 0x1C, 0x38, 0x60, 0x18, 0x06, 0x60, 0x18, 0x10, 0x01, 0x80, 0x08,
0x20, 0x01, 0x80, 0x04, 0x40, 0x00, 0x00, 0x02, 0x40, 0x00, 0x00, 0x02, 0xC0, 0x00, 0x08, 0x03,
0x80, 0x00, 0x08, 0x01, 0x80, 0x00, 0x18, 0x01, 0x80, 0x00, 0x1C, 0x01, 0x80, 0x00, 0x14, 0x00,
0x80, 0x00, 0x14, 0x00, 0x80, 0x00, 0x14, 0x00, 0x40, 0x10, 0x12, 0x00, 0x40, 0x10, 0x12, 0x00,
0x7E, 0x1F, 0x23, 0xFE, 0x03, 0x31, 0xA0, 0x04, 0x01, 0xA0, 0xA0, 0x0C, 0x00, 0xA0, 0xA0, 0x08,
0x00, 0x60, 0xE0, 0x10, 0x00, 0x20, 0x60, 0x20, 0x06, 0x00, 0x40, 0x60, 0x03, 0x00, 0x40, 0xC0,
0x01, 0x80, 0x01, 0x80, 0x00, 0xC0, 0x03, 0x00, 0x00, 0x60, 0x06, 0x00, 0x00, 0x30, 0x0C, 0x00,
0x00, 0x08, 0x10, 0x00, 0x00, 0x06, 0x60, 0x00, 0x00, 0x03, 0xC0, 0x00, 0x00, 0x01, 0x80, 0x00  };


void setup() {


display.begin(SSD1306_SWITCHCAPVCC, 0x3C); //Start the OLED display
  display.display();
  delay(3000);
  // Initialize sensor

  
}

//CALCULO DE CALORIAS

//REFERENCIA
//https://www.revistagq.com/cuidados/articulo/ejercicios-que-mas-calorias-queman

int FreMin= 115;
int FreMed= 146;
int FreMax= 180;
double tiempo=0;
double ritmo=0;
double totalCalorias=0;
double SumaTotal=0;
double segundoMili=1000; //Cambiar por el tiempo que van contando 
double CalsegundoMin = 0.152;
double CalsegundoMax = 0.183;



//****************************************** *****************************//
// Hacer la rutina cada segundo
//Llevar el ritmo cardiaco a valores aproximados

void calorias(){
 if (ritmo > FreMin  && ritmo <FreMed){              //frecuencia cardiaca minima para quemar calorias
  SumaTotal=+ SumaTotal + CalsegundoMin; 
 }

  else if (ritmo >= FreMed  && ritmo <FreMax){      // si es una frecuencia cardiaca mas alta quema mas calorias
    SumaTotal=+ SumaTotal + CalsegundoMax;
  }

  totalCalorias=SumaTotal; // calorias Quemadas en total 
}




//******************************************MAIN  LOOP *****************************//
void loop() {
 
                                           //Also detecting a heartbeat
                                        //If a finger is detected
    display.clearDisplay();                                   //Clear the display
    display.drawBitmap(5, 5, logo2_bmp, 24, 21, WHITE);       //Draw the first bmp picture (little heart)
    display.setTextSize(2);                                   //Near it display the average BPM you can display the BPM if you want
    display.setTextColor(WHITE); 
    display.setCursor(50,0);                
    display.println("BPM");             
    display.setCursor(50,18);                
//    display.println(beatAvg); 
    display.display();
    
                   //If a heart beat is detected
  {
    display.clearDisplay();                                //Clear the display
    display.drawBitmap(0, 0, logo3_bmp, 32, 32, WHITE);    //Draw the second picture (bigger heart)
    display.setTextSize(2);                                //And still displays the average BPM
    display.setTextColor(WHITE);             
    display.setCursor(50,0);                
    display.println("BPM");             
    display.setCursor(50,18);                
  //  display.println(beatAvg); 
    display.display();
    tone(3,1000);                                        //And tone the buzzer for a 100ms you can reduce it it will be better
    delay(100);
    noTone(3);                                          //Deactivate the buzzer to have the effect of a "bip"
    //We sensed a beat!
//    long delta = millis() - lastBeat;                   //Measure duration between two beats
//    lastBeat = millis();

//    beatsPerMinute = 60 / (delta / 1000.0);           //Calculating the BPM

//    if (beatsPerMinute < 255 && beatsPerMinute > 20)               //To calculate the average we strore some values (4) then do some math to calculate the average
    {
//      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
//      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
  //    beatAvg = 0;
//      for (byte x = 0 ; x < RATE_SIZE ; x++)
 //       beatAvg += rates[x];
  //    beatAvg /= RATE_SIZE;
    }
  }


      //If no finger is detected it inform the user and put the average BPM to 0 or it will be stored for the next measure
//     beatAvg=0;
     display.clearDisplay();
     display.setTextSize(1);                    
     display.setTextColor(WHITE);             
     display.setCursor(30,5);                
     display.println("Please Place "); 
     display.setCursor(30,15);
     display.println("your finger ");  
     display.display();
     noTone(3);
     

}
