// Variable para asignar un ID a los ejercicios leídos
let idEjercicios = 1;

function reiniciaIds(){
    idEjercicios = 1;
}

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
let vigas = [];
reiniciaIds();
export function cargaEjVigas(){
    vigas.push(new Ejercicio(1,'Prueba 1'));
    vigas.push(new Ejercicio(3,'Prueba 2'));
    return vigas;
}

export function borrarEjViga(id){
    vigas.splice(id-1,1);
    reiniciaIds();
    let copy = [];
    vigas.forEach(ej => {
        copy.push(new Ejercicio(ej.dificultad, ej.desc));
    })
    console.log(vigas)
    vigas = [...copy]
    return vigas;
}
// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE MATRICES DE LA BBDD