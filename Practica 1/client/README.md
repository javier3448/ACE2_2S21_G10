# Cliente (frontend) - ReactJS
El cliente web se desarrollo usando ReactJS. La aplicación consiste en las siguientes pantallas:

- [Inicio de sesión](#SignIn)
- [Registrar usuario](#SignUp)
- [Atletas a cargo](#Coach)
- [Dashboard](#Dashboard)
- [Perfil de usuario](#Perfil)
- Estadísticas
    - [Corazón](#Corazon)
    - [Oxígeno](#Oxigeno)
    - [Temperatura](#Temperatura)
## SignIn
Cuando no haya sesión activa la aplicación iniciará en esta pantalla. Desde acá se puede acceder a la aplicación indicando el usuario y contraseña. Si las credenciales son válidas, la aplicación redigirá al [Dashboard](#Dashboard). Si no, mostrará una alerta indicando que las credenciales no son correctas.

Si se quiere registrar un usuario, se deberá presionar <b>Registrar usuario</b>. La aplicación redirigirá a [Registro usuario](#SignUp).

![Inicio de sesión](img/signin.png?raw=true "")
## SignUp
Cuando no haya sesión activa, la aplicación mostrará un formulario a llenar para crear un nuevo usuario. Todos los campos son obligatorios.

En particular, deberá indicar si el usuario a registrar es un coach o un atleta. Si es un atleta, en la parte inferior del formulario se habilitará un listado en donde deberá seleccionar el coach que supervisará las estadísticas del nuevo atleta.

Una vez rellenado todos los campos, y al presionar <b>Registrar usuario</b> se mostrará una alerta indicando si el registro fue existoso o no. Si el registro fue exitoso la aplicación redirigirá a [Inicio de sesión](#SignIn).
![Registro de usuario](img/signup.png?raw=true "")
## Coach
Cuando haya sesión activa, la aplicación mostrará tarjetas con información de los atletas que, el coach que haya inicido sesión, tenga a cargo. 

Para visualizar información del atleta, deberá presionar en el botón con un 'ojo' y redirigirá al [Dashboard del atleta](##Dashboard)
![Vista de coach](img/coach.png?raw=true "")
## Dashboard
Cuando haya sesión activa, la aplicación iniciará en esta pantalla. Desde acá el usuario podrá visualizar su perfil, estadísticas en tiempo real y su historial de métricas.

Al presionar <b>Perfil</b> se redirigirá a [Perfil](##Perfil). Además cuando el usuario logeado se un coach, se mostrará el botón <b>Atletas</b> (Ver la imagen de abajo) que al ser presionado redirigirá a [Vista de coach](##Coach). Se podrá cerrar sesión en todo momento, al presionar el botón <strong>Salir</strong> y redirigirá a [Inicio de sesión](##SingIn).
![Dashboard](img/dashboard.png?raw=true "")
Cuando el usuario logeado sea un coach, y sea redirigido a esta pantalla desde la pantalla de coach, se podrá visualizar información del atleta en cuestión presionando en 'Ver perfil', o cualquiera de los botones de 'Tiempo real' o 'Historial'.
![Dashboard de coach](img/dashboard-atleta.png?raw=true "")
## Perfil
Cuando haya sesión activa, se mostrará información del usuario logeado o del atleta que algún coach (que tenga sesión activa) tenga a su cargo.
![Perfil](img/perfil.png?raw=true "")
![Perfil de atleta](img/perfil-atleta.png?raw=true "")
## Estadísticas
Cuando haya sesión activa, se mostrará información del usuario logeado o bien de algún atleta que un coach tenga a su cargo.

El diseño de estas pantallas son las mismas para las estadísticas en tiempo real y la estadística de historial. Se usa una gráfica de líneas para mostrar las estadísticas.
### Corazon
Muestra la estadística con una gráfica de líneas. Si la vista es en tiempo real, el promedio será el promedio de las mediciones de los últimos 60 segs. Si la vista es del historial, el promedio será el promedio de todas las mediciones registradas. 

El icono del corazón cambiará de color dependiendo del valor promedio. Si está por debajo de las 60 pulsaciones el corazón será <strong style="color: #ffc107">amarillo</strong>; si está entre 60 - 100 pulsaciones, el corazón será <strong style="color: #198754">verde</strong>; si es mayor a 100 pulsaciones, el corazón será <strong style="color: #dc3545">rojo</strong>. Si el promedio es 0, el corazón será <strong style="color: #6c757d ">gris</strong>.
![Corazon](img/corazon.png?raw=true "")
### Oxigeno
Muestra la estadística con una gráfica de líneas. Si la vista es en tiempo real, el promedio será el promedio de las mediciones de los últimos 60 segs. Si la vista es del historial, el promedio será el proemdio de todas las mediciones registradas. 
![Oxigeno](img/oxigeno.png?raw=true "")
### Temperatura
Muestra la estadística con una gráfica de líneas. Si la vista es en tiempo real, el promedio será el promedio de las mediciones de los últimos 60 segs. Si la vista es del historial, el promedio será el promedio de todas las mediciones registradas. Lo mismo se cumple con los datos de temperatura máxima y temperatura mínima.

El icono del termómetro cambiará de color dependiendo del valor promedio. Si está por debajo de las 36°C (pero mayor a 0°C) el termómetro será <strong style="color: #17a2b8">azul claro</strong>; si está entre 36°C - 37°C , el termómetro será <strong style="color: #0d6efd">azul</strong>; si está entre 37°C - 38°C , el termómetro será <strong style="color: #ffc107">amarillo</strong>; si es mayor a 38°C, el termómetro será <strong style="color: #dc3545">rojo</strong>. Si el promedio es 0, el termómetro será <strong style="color: #6c757d ">gris</strong>.
![Temperatura](img/temperatura.png?raw=true "")
