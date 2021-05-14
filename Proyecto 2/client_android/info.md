- ### Formato de objeto que se enviara a la api
### ejemplo:
JSON 
```JSONasJs
{
   "temperatura":"35",
    "ritmo":"3.5",
    "oxigeno":"70",
    "repeticion":"3",
    "velocidad":"23",
    "distancia":"7.5",
    "tiempo":"4.5",
    "falla":"2",
    "rindio":"3",
    "aprobo":"1",
    "idUser":"1"
}
```

## Nota:
- Repeticion defini como entero que se recibiara desde arduino, considerando que repetcion no podria ser 0.5 o 2.5... pero si prefieren en decimal me lo hacen saber xd
- falla definido entero que se recbira desde arduino
- rindio definido como entero se recibira desde arduino (cantidad de  veces que falla)
