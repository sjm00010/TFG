[ ![Seguidores](https://img.shields.io/github/followers/sjm00010?label=Seguir&style=social) ](https://github.com/sjm00010)
![Estrellas](https://img.shields.io/github/stars/sjm00010/TFG?label=Favoritos&style=flat-square)

# TFG (WIPACE)

Este TFG (Trabajo de Fin de Grado) tiene como fin el desarrollo de una aplicación **w**eb **i**nteractiva **p**ara el **a**prendizaje del **c**álculo de **e**structuras ([WIPACE](https://wipace.ujaen.es/#/)). La web permite realizar tres tipos de ejercicios diferentes: diagramas de esfuerzos en vigas, matrices y círculos de Mohr. La web facilita las operaciones CRUD de los ejercicios, gracias a la APIRest realizada en [este proyecto](https://github.com/sjm00010/API-TFG) auxiliar a este trabajo. Este trabajo persigue un doble objetivo, por el lado docente facilitar la creación/gestión de los ejercicios, y por el lado del alumnado facilitar la comprensión de la materia relacionada con los ejercicios presentes en esta web.

## Dependencias
Para el desarrollo de la web se usa [Vue.js](https://vuejs.org/), en su versión 2, ya que la 3 presenta incompatibilidades con librerías que se van a necesitar. 

### Librerías
Las librerías necesarias han sido:

- [Fabric.js](http://fabricjs.com/): utilizada para la representación de las figuras en los distintos ejercicios.
- [Highcharts](https://www.highcharts.com/): para la representación de las leyes de esfuerzos.
- [Katex](https://katex.org/): utilizada para visualizar latex.
- [Evaluatex.js](https://arthanzel.github.io/evaluatex/): permite evaluar fórmulas introducidas en latex, utilizada para la evaluacion de las fórmulas de las leyes de esfuerzos y las deformadas.
- [Math.js](https://mathjs.org/): popular librería para realizar operaciones matemáticas en JavaScript.

Para la parte visual de la web se ha ultilizado [MDB](https://mdbootstrap.com/docs/vue/) (Material Design for Bootstrap en la versión de Vue), ya que tiene una versión gratuita fácil de utilizar y visualmente resulta bastante llamativa.

## Instalación y configuración del servidor
Para hospedar la web se utilizara [Apache](http://httpd.apache.org/), en su [versión compilada para Windows](https://www.apachelounge.com/download/) o su versión para [Linux](https://www.digitalocean.com/community/tutorials/como-instalar-el-servidor-web-apache-en-ubuntu-18-04-es). Dependiendo de la versión del SO seran distintas las rutas de los archivos, por lo que solo se indicará la carpeta u archivo que se debe modificar. Si no se corresponden las rutas o configuraciones con tu versión de Apache, o no deseas utilizar Apache como servidor te recomiendo que busques información sobre como hacer un Proxy y habilitar HTTPS para tu versión. Una vez instalado se debe modificar la configuración de Apache, el archivo *https.conf*, del que se deben modifcar las siguientes líneas (quitandoles *#* para activarlas): 
```
ServerName wipace.ujaen.es:443
```
A partir de este punto se debe elegir uno de los siguientes apartados (HTTP o HTTPS), en función de sí se dispone de los certificados SSL necesarios. 

### HTTP
El código de la API y de la aplicación web está preparado para HTTPS y habría que adaptarlo. Para adaptar el código de la API se puede ver el [Readme](https://github.com/sjm00010/API-TFG#readme) de su repositorio. Para la aplicación web habría que buscar cambiar la URL del fichero *src/assets/js/auxiliares/api.config.js* cambiando ` https://wipace.ujaen.es/api ` por ` http://wipace.ujaen.es/api `. En el archivo *https.conf* se debe activar:

```
# Virtual hosts
Include conf/extra/httpd-vhosts.conf
```

En el fichero *httpd-vhosts.conf* escribimos:
```
<VirtualHost *:80>
    ServerName wipace.ujaen.es
    ProxyRequests On
    ProxyPass /api http://localhost:8081/api
    ProxyPassReverse /api http://localhost:8081/api
</VirtualHost>
```
### HTTPS
Si se dispone de certificados no será necesario hacer ningún ajuste en el código de la API o la aplicación web. En el fichero *https.conf* activar:

```
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
LoadModule ssl_module modules/mod_ssl.so

Include conf/extra/httpd-ssl.conf
```

Tras esto, se debe configurar el archivo *httpd-ssl.conf*, del que se deben modificar las siguientes líneas (donde 8081 deberá sustituirse por el puerto elegido para la API):
```
SSLProxyEngine on
ProxyPass /api http://localhost:8081/api
ProxyPassReverse /api http://localhost:8081/api
```

Por último, en el mismo fichero se deben configurar las rutas para los certificados, en mi caso ha sido:
```
SSLCertificateFile "${SRVROOT}/certificados/wipace_ujaen_es_cert.cer"
SSLCertificateKeyFile "${SRVROOT}/certificados/wipace.ujaen.es_privatekey.pem"
SSLCertificateChainFile "${SRVROOT}/certificados/wipace_ujaen_es_interm.cer"
```

## Configuración del servidor
Antes de nada es necesario tener lista la [API](https://github.com/sjm00010/API-TFG), ya que además de que es necesaria para la web, comparte dependencias con la misma. La aplicación web necesita de [Node.js](https://nodejs.org/es/download/) (para la realización se utilizó la versión 14.15.1 de 64 bits). Una vez que tenga lista la API debe clonar el repositorio, de manera analoga a como se clonaba el de la API. Para la [clonación](https://git-scm.com/book/es/v2/Fundamentos-de-Git-Obteniendo-un-repositorio-Git#:~:text=Si%20deseas%20obtener%20una%20copia,en%20vez%20de%20%22checkout%22.) es necesario usar [Git](https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git), si se desea también se puede descargar el código directamente. Una vez clonado el repositorio, los pasos a seguir son:

1. **Compilar el proyecto para producción**: esto quita los *logs* usados durante el desarrollo y deja la web mucho más optimizada que si trabajásemos directamente con el código de la fase de desarrollo. Para ello ejecutamos el siguiente comando desde una terminal en la carpeta del proyecto ` npm run build `, que creará una carpeta *dist* con el proyecto compilado.

2. **Copiar la carpeta compilada**: una vez compilada la web se debe copiar el contenido de la carpeta *dist* a la carpeta *htdocs* de Apache. Esa carpeta contiene la web que debe lanzar Apache, en caso de no encontrarla o utilizar otro servidor buscar la informacion correspondiente al sistema o versión utilizada.

## Configuración del dominio
En este caso el dominio ha sido proporcionado por la Universidad de Jaén, por lo que no ha sido necesaria la administración del mismo. De igual manera, si se desea configurar un dominio existen varias alternativas, voy a recomendar una alternativa gratuita aunque existen más si se desea buscar información al respecto.

Lo primero de todo el dominio sirve, explicado de manera sencilla, para no tener que acceder mediante la dirección IP del servidor al contenido del mismo (la web). De esta forma en vez de acceder a la web mediante la URL ficticia *http://88.51.18.1* podemos acceder como *http://wipace.ujaen.es*, por ejemplo. Esto facilita el acceso a la web, para ello podemos utilizar herramientas como [Freenom](http://www.freenom.com/en/index.html) para conseguir un dominio gratuito durante un año, renovable tras la caducidad del mismo de manera gratuita, y [FreeDNS](https://freedns.afraid.org/) para el mapeo autimático de la IP del servidor, de esta forma el dominio adquirido se actualizara automáticamente cuando cambien la IP del servidor. Para usar FreeDNS de manera autimática se puede utilizar alguno de los [clientes](https://freedns.afraid.org/scripts/freedns.clients.php) de los que dispone la web.

Es importante destacar también que se deben abrir los puertos para poder acceder a la web, HTTP utiliza por defecto el puerto 80 y HTTPS el 443. Si se cambian esto puertos se deberá acceder especificando el nuevo puerto, por ejemplo *http://ejemplo.ejemplo:8080*. En internet hay gran cantidad de tutoriales sobre como abrir los puertos del router para configurar servidores 😉

## Automatización (Opcional)
Si se desea automatizar el arranque del servidor se puede configurar el inicio automático del siguiente script:
```
cd C:\Apache24\bin
httpd
```
Esto arrancara automáticamente Apache, si el caso de Windows, en Linux la ejecución debería ser automática.