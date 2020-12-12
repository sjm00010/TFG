/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 * @param dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
 * @param desc Breve descripcion del ejercicio que aparecera en el listado.
 * @param enunciado Enunciado completo del ejercicio en HTML.
 * @param imagen URL de la imagen que se quiere incluir en el enunciado del ejercicio.
 */
export class Ejercicio {
    constructor( dificultad, desc, enunciado, imagen) {
        this.dificultad = dificultad;
        this.desc = desc;
        this.enunciado = enunciado;
        this.imagen = imagen;
    }
}