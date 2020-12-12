# TFG (WIPACE)

Este proyecto es un TFG para el desarrollo de una aplicación web interactiva para el aprendizaje del cálculo de estructuras. En la web se pueden realizar varios tipos de ejercicios y a todos ellos se les pueden realizar las operaciones básicas CRUD, gracias a un editor. El objetivo además de que se puedan realizar ejercicios con los que comprender mejor la materia mencionada es que el profesor responsable pueda modificar a su gusto dichos ejercicios.

## Dependencias
Para el desarrollo de la web se usa [Vue.js](https://vuejs.org/), en su versión 2, ya que la 3 presenta incompatibilidades con librerías que se van a necesitar. Además se usa [Vue Router](https://router.vuejs.org/) para la navegación por la web. Son necesarías también las dependencias de Vue, que se comentan en su propia página.

### Librerías
Las librerías necesarias han sido:

- [Fabric.js](http://fabricjs.com/) : utilizada principalmente para el dibujo de las figuras en el ejercicio de leyes.
- [Highcharts](https://www.highcharts.com/) : para la representación de las leyes de esfuerzos.

## Instalación y puesta en marcha
Para usar la web sin mayor problema recomiendo usar [Node.js](https://nodejs.org/es/) para el servidor, debido a que es el usado de forma nativa por Vue y tiene todo lo necesario para el correcto funcionamiento de este. Los pasos a seguir una vez clonado el repositorio son:

1. **Compilar el proyecto para producción**. Esto quita los *logs* usado durante el desarrollo y deja la web mucho más optimizada que si trabajásemos directamente con el código de la fase de desarrollo. Para ello ejecutamos el siguiente comando desde una terminal en la carpeta del proyecto:
```
npm run build
```
2. **Lanzar la carpeta compilada**.Esto creará una carpeta *dist* que es el proyecto compilado. Si se quiere probrar, o si ya se quiere *"lanzar"* se utiliza el siguiente comando:
```
serve -s dist -l puerto(recomiendo el 80 para mayor comodidad, pero debe poder abrirse desde el router)
```
3. **Configurar el acceso a la web**. Y ya está todo listo, la web ya esta online. Ahora hay que ponerla accesible para todo el mundo, para ello es necesario abrir el puerto en el que está configurada la página y recomiendo usar un DNS conectado a un dominio para mayor comodidad. Es importante saber que el protocolo HTTP usa el puerto 80 por defecto, por lo que si no se puedo configurar el puerto 80 se deberá especificar junto con el nombre del dominio.