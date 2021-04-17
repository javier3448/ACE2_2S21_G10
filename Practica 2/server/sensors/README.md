# APIS LOGIN Y SENSORES 

## API LOGIN 
### METODO GET 
La siguiente url es para lo que es el login, retorna los siguientes campos 
1. IdUser 
2. nombre
3. apellidos
4. altura
5. peso
6. carnet 
7. username
8. password
9. tipo
10. sexo
11. edad

        https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/login/{username}/{password}
## API SENSORES ALMACENAMIENTO 
### METODO POST
La siguiente url requiere los siguientes campos para almacenar la informacion. Tal como apararecen deben de ser para que funcione.
1. exhalado
2. inhalado
3. vo2
4. prueba
5. idUser

        https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensorsv2