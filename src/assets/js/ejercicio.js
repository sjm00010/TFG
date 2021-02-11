/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 * @param id ID numerico del ejercicio.
 * @param dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
 * @param enunciado Enunciado completo del ejercicio en HTML.
 * @param imagen URL de la imagen que se quiere incluir en el enunciado del ejercicio.
 */
export class Ejercicio {
    constructor( id, dificultad, enunciado, ayuda, video) {
        this.id = id;
        this.dificultad = dificultad;
        this.enunciado = enunciado;
        this.ayuda = ayuda;
        this.video = video;
    }
}

export class Viga {
    constructor( ejercicio, tramos, elementos, formulas) {
        this.datos = ejercicio;
        this.tramos = tramos;
        this.elementos = elementos;
        this.formulas = formulas;
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
export var vigas = [];
export async function cargaEjVigas(){
    const respuesta = await fetch('http://localhost:8080/api/ejViga/', { 
        headers: {'Content-Type': 'application/json'},
        method: 'GET'
    });

    vigas.splice(0, vigas.length, ...await respuesta.json());
}

// FUNCION PARA BORRAR UN EJERCICIO DE VIGAS DE LA BBDD
export async function borrarEjViga(id){
    const respuesta = await fetch('http://localhost:8080/api/ejViga/'+id, { 
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
    });
    
    if(respuesta.ok)
        cargaEjVigas();
    else
        this.$notify({
            group: 'app',
            title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al borrar el ejercicio</b>',
            text: '<i style="font-size:15px"> Ocurrio un error al tratar de borrar el ejercicio, intentelo de nuevo.</i>',
            duration: 7000,
            type: 'error'
        });
}
// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE MATRICES DE LA BBDD