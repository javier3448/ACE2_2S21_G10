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

