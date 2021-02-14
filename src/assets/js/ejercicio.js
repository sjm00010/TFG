/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 * @param id ID numerico del ejercicio.
 * @param dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
 * @param enunciado Enunciado completo del ejercicio en HTML.
 * @param imagen URL de la imagen que se quiere incluir en el enunciado del ejercicio.
 */
class Ejercicio {
    constructor( id, dificultad, enunciado, ayuda, video) {
        this.id = id;
        this.dificultad = dificultad;
        this.enunciado = enunciado;
        this.ayuda = ayuda;
        this.video = video;
    }
}

export class Viga extends Ejercicio {
    constructor( id, dificultad, enunciado, ayuda, video, tramos = [], elementos = [], formulas = []) {
        super(id, dificultad, enunciado, ayuda, video);
        this._tramos = tramos;
        this._elementos = elementos;
        this._formulas = formulas;
    }

    set tramos(nTramos){
        this._tramos.splice(0, this._tramos.length, ...nTramos);
    }

    set elementos(nElementos){
        this._elementos.splice(0, this._elementos.length, ...nElementos);
    }

    set formulas(nFormulas){
        this._formulas.splice(0, this._formulas.length, ...nFormulas);
    }

    get tramos(){
        return this._tramos;
    }

    get elementos(){
        return this._elementos;
    }

    get formulas(){
        return this._formulas;
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
        method: 'DELETE',
        body: JSON.stringify({  usuario: sessionStorage.getItem("user"), 
                                pass: sessionStorage.getItem("pass")})
    });
    
    if(respuesta.ok){
        cargaEjVigas();
        return true;
    }else
        return false;
}
// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE MATRICES DE LA BBDD