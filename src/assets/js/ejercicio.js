// Variable para asignar un ID a los ejercicios leídos
let idEjercicios = 1;

/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 * @param id ID numerico del ejercicio.
 * @param dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
 * @param desc Breve descripción del ejercicio que aparecera en el listado.
 * @param enunciado Enunciado completo del ejercicio en HTML.
 * @param imagen URL de la imagen que se quiere incluir en el enunciado del ejercicio.
 */
export class Ejercicio {
    constructor( dificultad, desc, enunciado, imagen) {
        this.id = idEjercicios++;
        this.dificultad = dificultad;
        this.desc = desc;
        this.enunciado = enunciado;
        this.imagen = imagen;
    }
}

// FUNCION PARA CARGAR TODOS LOS EJERCICIOS DE LA BBDD

// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE VIGAS DE LA BBDD

// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE MATRICES DE LA BBDD