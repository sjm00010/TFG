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

export class Viga {
    constructor( ejercicio, tramos, elementos) {
        this.enunciado = ejercicio;
        this.tramos = tramos;
        this.elementos = elementos;
    }
}

export function compruebaTramos(tramos){
    let error = [];
    tramos.forEach((tramo, pos) => {
        if(tramo.min=='' || parseFloat(tramo.min) > parseFloat(tramo.max))
            error.push(('min'+(pos+1)));
        if (tramo.max=='' || parseFloat(tramo.max) < parseFloat(tramo.min))
            error.push(('max'+(pos+1)));
        if (tramo.valor=='' || parseFloat(tramo.valor) < parseFloat(tramo.min) || parseFloat(tramo.valor) > parseFloat(tramo.max))
            error.push(('valor'+(pos+1)));
    });
    return error;
}

// FUNCION PARA CARGAR TODOS LOS EJERCICIOS DE LA BBDD

// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE VIGAS DE LA BBDD
let vigas = [];
export function cargaEjVigas(){
    reiniciaIds();
    vigas.splice(0);
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