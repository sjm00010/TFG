import {URL} from '@/assets/js/auxiliares/api.config.js';

/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 * @param id ID numerico del ejercicio.
 * @param dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
 * @param enunciado Enunciado completo del ejercicio en HTML.
 * @param imagen URL de la imagen que se quiere incluir en el enunciado del ejercicio.
 */
export class Ejercicio {
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '') {
        this.id = id;
        this.dificultad = dificultad;
        this.enunciado = enunciado;
        this.ayuda = ayuda;
        this.video = video;
    }
}

export class Viga extends Ejercicio {
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '', tramos = [], elementos = [], formulas = [], auxiliares = []) {
        super(id, dificultad, enunciado, ayuda, video);
        this._tramos = tramos;
        this._elementos = elementos;
        this._formulas = formulas;
        this._auxiliares = auxiliares;
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

    set auxiliares(nAuxiliares){
        this._auxiliares.splice(0, this._auxiliares.length, ...nAuxiliares);
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

    get auxiliares(){
        return this._auxiliares;
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

export class Mohr extends Ejercicio {
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '', sx, sy, txy, s1, s2, a, B, E, v) {
        super(id, dificultad, enunciado, ayuda, video);
        this.sx = sx;
        this.sy = sy;
        this.txy = txy;
        this.s1 = s1;
        this.s2 = s2;
        this.a = a;
        this.B = B;
        this.E = E;
        this.v = v;
    }
}

// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE VIGAS DE LA BBDD
export var vigas = [];
export async function cargaEjVigas(){
    console.log(URL)
    const respuesta = await fetch(URL+'/ejViga/', { 
        headers: {'Content-Type': 'application/json'},
        method: 'GET'
    });

    vigas.splice(0, vigas.length, ...await respuesta.json());
}

// FUNCION PARA BORRAR UN EJERCICIO DE VIGAS DE LA BBDD
export async function borrarEjViga(id){
    const respuesta = await fetch(URL+'/ejViga/'+id, { 
        headers: {'Content-Type': 'application/json', 
                  'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
        },
        method: 'DELETE'
    });
    
    if(respuesta.ok){
        cargaEjVigas();
        return true;
    }else
        return false;
}
// FUNCION PARA LISTAR TODOS LOS EJERCICIOS DE MATRICES DE LA BBDD