import {URL} from '@/assets/js/auxiliares/api.config.js';

/**
 * Clase con la información básica de un ejercicio
 * @type Ejercicio
 */
export class Ejercicio {
    /**
     * Constructor de ejercicio
     * @param {String} id ID numerico del ejercicio.
     * @param {Number} dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
     * @param {String} enunciado Enunciado del ejercicio en HTML.
     * @param {String} ayuda Explicación del ejercicio en HTML.
     * @param {String} video URL del vídeo explicativo
     */
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '') {
        this.id = id;
        this.dificultad = dificultad;
        this.enunciado = enunciado;
        this.ayuda = ayuda;
        this.video = video;
    }
}

/**
 * Clase con la información de un ejercicio de vigas
 * @type Viga
 */
export class Viga extends Ejercicio {
    /**
     * Constructor de ejercicio de vigas
     * @param {String} id ID numerico del ejercicio.
     * @param {Number} dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
     * @param {String} enunciado Enunciado del ejercicio en HTML.
     * @param {String} ayuda Explicación del ejercicio en HTML.
     * @param {String} video URL del vídeo explicativo
     * @param {Array} tramos Vector con los tramos de la viga
     * @param {Array} elementos Vector con los elementos del ejercicio
     * @param {Array} formulas Vector con las formulas para los tramos de la viga
     * @param {Array} auxiliares Vector con las variables auxiliares
     * @param {Number} E Módulo elástico
     * @param {Number} I Momento de inercia
     */
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '', tramos = [], elementos = [], formulas = [], auxiliares = [], E, I) {
        super(id, dificultad, enunciado, ayuda, video);
        this._tramos = tramos;
        this._elementos = elementos;
        this._formulas = formulas;
        this._auxiliares = auxiliares;
        this.E = E;
        this.I = I;
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

/**
 * Clase con la información de un ejercicio de círculos de Mohr
 * @type Mohr
 */
export class Mohr extends Ejercicio {
    /**
     * Constructor de ejercicio de vigas
     * @param {String} id ID numerico del ejercicio.
     * @param {Number} dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
     * @param {String} enunciado Enunciado del ejercicio en HTML.
     * @param {String} ayuda Explicación del ejercicio en HTML.
     * @param {String} video URL del vídeo explicativo 
     * @param {Number} sx 
     * @param {Number} sy 
     * @param {Number} txy 
     * @param {Number} s1 
     * @param {Number} s2 
     * @param {Number} a 
     * @param {Number} B 
     * @param {Number} E 
     * @param {Number} v 
     */
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

/**
 * Clase con la información de un ejercicio de matrices
 * @type Matriz
 */
 export class Matriz extends Ejercicio {
    /**
     * Constructor de ejercicio de matrices
     * @param {String} id ID numerico del ejercicio.
     * @param {Number} dificultad Número de lapices, del 1 al 3. Si se sale el ejercicio tendra el color blanco pero el número de lápices especificado.
     * @param {String} enunciado Enunciado del ejercicio en HTML.
     * @param {String} ayuda Explicación del ejercicio en HTML.
     * @param {String} video URL del vídeo explicativo
     * @param {Array} materiales Matriz con los materiales
     * @param {Array} secciones Matriz con las secciones
     * @param {Array} nodos Matriz con los nodos
     * @param {Array} barras Matriz con las barras
     * @param {Array} bc Matriz con las condiciones de contorno
     * @param {Array} cargas Matriz con las cargas
     */
    constructor( id, dificultad, enunciado = '', ayuda = '', video = '', materiales = [], secciones = [], nodos = [], barras = [], bc = [], cargas = []) {
        super(id, dificultad, enunciado, ayuda, video);
        this._materiales = materiales;
        this._secciones = secciones;
        this._nodos = nodos;
        this._barras = barras;
        this._bc = bc;
        this._cargas = cargas;
    }

    set materiales(nMateriales){
        this._materiales.splice(0, this._materiales.length, ...nMateriales);
    }

    set secciones(nSecciones){
        this._secciones.splice(0, this._secciones.length, ...nSecciones);
    }

    set nodos(nNodos){
        this._nodos.splice(0, this._nodos.length, ...nNodos);
    }

    set barras(nBarras){
        this._barras.splice(0, this._barras.length, ...nBarras);
    }

    set bc(nBc){
        this._bc.splice(0, this._bc.length, ...nBc);
    }

    set cargas(nCargas){
        this._cargas.splice(0, this._cargas.length, ...nCargas);
    }

    get materiales(){
        return this._materiales;
    }

    get secciones(){
        return this._secciones;
    }

    get nodos(){
        return this._nodos;
    }

    get barras(){
        return this._barras;
    }

    get bc(){
        return this._bc;
    }

    get cargas(){
        return this._cargas;
    }
}

///////////////////////////
//  Funciones auxiliares //
///////////////////////////

/**
 * Función que valida los tramos introducidos para un ejercicio de vigas
 * @param {Array} tramos Vector de tramos
 * @returns Vector de errores
 */
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

/**
 * Función que carga todos los ejercicios
 * @returns True si todo se cargó correctamente, false en caso de que haya algún error.
 */
export async function cargarEjercicios(){
    if(await cargaEjercicio('viga') === null) return false;
    if(await cargaEjercicio('matriz') === null) return false;
    if(await cargaEjercicio('mohr') === null) return false;
    return true;
}

// Vectores para la información básica cada tipo de ejercicio
export var vigas = [], mohr = [], matriz = [];

/**
 * Función para cargar todos los ejercicios de un tipo
 * @param {String} tipo Tipo del ejercicio a cargar
 * @returns Null en caso de error
 */
export async function cargaEjercicio(tipo){
    const respuesta = await fetch(URL+'/ejercicio/'+tipo, { 
        headers: {'Content-Type': 'application/json'},
        method: 'GET'
    });

    if(!respuesta.ok) return null;

    switch(tipo){
        case 'viga':
            vigas.splice(0, vigas.length, ...await respuesta.json());
            break;
        case 'matriz':
            matriz.splice(0, matriz.length, ...await respuesta.json());
            break;
        case 'mohr':
            mohr.splice(0, mohr.length, ...await respuesta.json());
            break;
        default:
            return null;
    }
}

/**
 * Función para el borrado de ejercicios
 * @param {String} id ID del ejercicio a borrar
 * @param {String} tipo Tipo de ejercicio
 * @returns True si tiene éxito, false en caso contrario
 */
export async function borrarEjercicio(id, tipo){
    const respuesta = await fetch(URL+'/ejercicio/'+tipo+'/'+id, { 
        headers: {'Content-Type': 'application/json', 
                  'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
        },
        method: 'DELETE'
    });
    
    if(respuesta.ok){
        if(await cargaEjercicio(tipo) === null) return false;
        return true;
    }else
        return false;
}