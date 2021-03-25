# APIS 

## Table of contents
* [Login](#Login)
* [Usuarios](#Usuarios)
* [Sensores](#Sensores)
* [Reports](#reports)
* [Nota](#Nota)

## Login
### Metodo GET
este va a ser para iniciar sesion

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/login/{username}/{password}

- Username: en este campo va el usuario que va a iniciar sesion
- Password: en este campo va la contraseña


### Metodo DELETE
este va a ser para cuando se cierra sesion

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/login
  
## Usuarios
### Metodo POST
este va a ser para crear usuarios

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/users

Campos requeridos para que funcione: 
1. nombre
2. apellidos
3. carnet
4. altura
5. peso
6. username
7. password
8. tipo (atleta o coach)
9. asignacion (usuario del coach, si es coach poner none o algo asi)
10. sexo (M masculino F femenino) 
11. edad

### Metodo GET 
obtener los usuarios por coach para ver los reportes 

     https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/users/show/{asignacion}
asignacion: es el usuario del coach, podes recuperarlo cuando te logueas ya que ahi te retorno el usuario y toda la data


### Metodo DELETE
Para eliminar usuarios

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/users

## Sensores
### Metodo POST
este va a ser para registrar lo que marquen los sensores
    
    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors

Campos requeridos
1. temperatura
2. ritmo
3. oxigeno
4. repeticion
5. velocidad
6. distancia
7. tiempo
8. falla
9. rindio
10. idUser


### Metodo DELETE
este va a ser para eliminar algun registro de lo que marquen los sensores

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors

## Reports
### Ritmo (Son metodos GET)
Reporte 1: aqui retorna una lista de los datos de ritmo marcado por el usuario en un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/heart-rate/report1/{idUser}

Reporte 3: aqui retorna el promedio del ritmo del usuario mediante un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/heart-rate/report3/{idUser}

Nota: idUser es para retornar solo los datos de dicho usuario, puedes obtener el id cuando inicia sesion, ya que aqui retorno todo la informacion del usuario en un JSON y podrias guardarlo por localstorage para que se te facilite manejar esta informacion para las validaciones     

### Oxigeno (Son metodos GET)
Reporte 1: aqui retorna una lista de los datos de oxigeno marcado por el usuario en un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/oxygen/report1/{idUser}

Reporte 3: aqui retorna el promedio del oxigeno del usuario mediante un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/oxygen/report3/{idUser}

Nota: idUser es para retornar solo los datos de dicho usuario, puedes obtener el id cuando inicia sesion, ya que aqui retorno todo la informacion del usuario en un JSON y podrias guardarlo por localstorage para que se te facilite manejar esta informacion para las validaciones     

### Temperatura (Son metodos GET)
Reporte 1: aqui retorna una lista de los datos de temperatura marcado por el usuario en un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/temperature/report1/{idUser}

Reporte 3: aqui retorna el promedio de la temperatura del usuario mediante un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/temperature/report3/{idUser}

Reporte 4: aqui retorna la temperatura maxima del usuario mediante un JSON 

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/temperature/report4/{idUser}

Report 5: aqui retorna la temperatura minima del usuario mediante un JSON

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/reports/temperature/report5/{idUser}

## Proyecto Reportes 
Reporte 2: Velocidad alcanzada aqui devuelvo el siguiente JSON con la siguiente estructura.
    
    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/get-velocity-report/{idUser}

1. max
2. min
3. avgtiempo
4. avgvelocidad
5. repeticion
    

Nota: idUser es para retornar solo los datos de dicho usuario, puedes obtener el id cuando inicia sesion, ya que aqui retorno todo la informacion del usuario en un JSON y podrias guardarlo por localstorage para que se te facilite manejar esta informacion para las validaciones     

## Nota 
1. Falta aun la parte de reportes.

