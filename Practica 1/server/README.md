# APIS 

## Table of contents
* [Login](#Login)
* [Usuarios](#Usuarios)
* [Sensores](#Sensores)
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
6. usuario
7. password

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
4. idUser

### Metodo GET
este va a ser para poder hacer los reportes

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors/{type}

- type: este campo va a ser por si se quieren obtener todos los campos entonces se coloca (all) o si solo uno (single) este todavia lo tengo que ver como lo dejo 

Nota: single solo retorna un registro

### Metodo DELETE
este va a ser para eliminar algun registro de lo que marquen los sensores

    https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors


## Nota 
Ya esta terminada la conexion con la base de datos. prueben y cualquier onda me avisan

