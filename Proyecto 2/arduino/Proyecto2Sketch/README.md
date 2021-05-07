Para compilar para otro arduino:avr :
1. Conectar arduino por usb

2. Ver en que puerto esta conectado el arduino
```bash
arduino-cli board list
```

3. Atachar el arduino y para que se genere el sketch.json
```bash
arduino-cli board attach <puerto>
```

4. Compilar (`compile`) y subir codigo (`-u`)
```bash
arduino-cli compile -u
```

5. Ver la entrada del puerto serial
```bash
screen <puerto>
```

5. Salirse de screen
    * ctrl + a
    * k
    * y

[!!!]
Para compilar y subir a nuestro arduino nano tenemos que cambiar el `sketch.json`
a mano:
```json
{
  "cpu": {
    "fqbn": "arduino:avr:nano",
    "name": "Arduino Nano",
    "port": "serial:///dev/ttyUSB0"
  }
}
```
El nombre del puerto es diferente al del uno(/dev/ttyACM0). 
No se porque y `arduino-cli board list` solo lo reconoce un como 'Serial Port (USB)'
pero no recone el 'Board Name FQBN Core' (Fully Qualified Board Name)


# NOTAS DE GPS
Under 1 second time-to-first-fix for hot and aided starts
Time-To-First-fix:  For Cold Start 32s, For Warm Start 23s, For Hot Start <1s
[!!!] Maximum navigation update rate: 5Hz
Default baud rate: 9600bps

rfwirless-world.com:
A GPS receiver module requires only DC power supply for its operation. It will start outputting data as soon as it has identified GPS satellites within its range.
So we dont really send anything in the serial port, just the handshake thingy (I think)
The gps module just sends out data and we have to read it


$GPVTG,,,,,,,,,N*30
Course and speed information relative to the ground
$GPGGA,185253.00,,,,,0,00,99.99,,,,,,*6E
Global positioning system fix data (time, position, fix type data)
$GPGSA,A,1,,,,,,,,,,,,,99.99,99.99,99.99*30
GPS receiver operating mode, satellites used in the position solution, and DOP values.
$GPGSV,1,1,00*79
The number of GPS satellites in view satellite ID numbers, elevation, azimuth and SNR values.
$GPGLL,,,,,185253.00,V,N*42
Geographic position, latitude, longitude
$GPRMC,185254.00,V,,,,,,,230321,,,N*7
Time, date, position, course and speed data
IMPORTANTE: Cuando no parpadea el led del modulo bluetooth es porque no ha encontrado
satelites


# OTRAS NOTAS
// Example of bluetooth message encoding (ignore linejumps or blank spaces)
// $
// *Runtime*
// repeticionActual| (?)
// distanciaRepeticionActual|
// velocidad|
// tiempoRepeticionActual (?)

// distanciaTotalPrueba|
// tiempoPrueba (?)

// *Para mantener logica de juego
// Si esta jugando, se rindio, o fallo, 
//
// *Para hacerlo aqui de una*
// velPromedioRepeticion|
// velMinimaRepeticion|
// velMaximaRepeticion|

// velPromedioPrueba|
// velMinimaPrueba|
// velMaximaPrueba|

// NumeroRepeticion|
// temperatura|
// ritmo|
// oxigeno|
// latitud|
// longitud|
// age
//;


