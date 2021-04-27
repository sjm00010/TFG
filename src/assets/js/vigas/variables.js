import { ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
/*******************
 *     Variables   *
 *******************/

// Elementos dibujados
export const elementos = [];
export function setElementos(el){
    elementos.splice(0, elementos.length, ...el);
}

/**
 * Función que guarga un elemento dibujado
 * @param {String} tipo Tipo de elemento dibujado
 * @param {Object} props Propiedades del elemento
 */
export function pushElemento(tipo, props){
    elementos.push({
        tipo: tipo, // Tipo de elemento
        segmento: props.segmento, // Indice tramo inicio
        segmentoFinal: props.segmentoFinal, // Indice tramo fin (Opcional)
        magnitud: props.magnitud, // Magnitud del elemento por defecto
        min: props.min, // Valor mínimo de la magnitud (Opcional)
        max: props.max, // Valor máximo de la magnitud (Opcional)
        nombre: props.nombre, // Nombre (ID)
        d: props.d, // Magnitud d para la barra (Opcional)
        minD: props.minD, // Mínimo para d de la barra (Opcional)
        maxD: props.maxD, // Máximo para d de la barra (Opcional)
        orientacion: props.orientacion, // Orientación d de la barra (Opcional)
    });
}

/**
 * Funcion que actualiza la magnitud de un elemento
 * @param {Number} pos Número del elemento
 * @param {Number} nMagnitud Nueva magnitud
 */
export function modificaElemento( pos, nMagnitud){
    elementos[pos].magnitud = nMagnitud;
}

/**
 * Función que borra un elemento
 * @param {Number} pos Posición del elemento a borrar
 */
export function borraElemento(pos){
    elementos.splice(pos,1);
}

let tramos = [];

/**
 * Función que inicializa los tramos
 * @param {Array} nTramos Tramos nuevos
 */
export function vincularTramos(nTramos){
    tramos.splice(0, tramos.length, ...nTramos);
}

/**
 * Función que devuelve el número de tramos
 * @returns {Number} Número de tramos
 */
export function numTramos(){
    return tramos.length;
}

/**
 * Función que devuelve el numero de elementos de un tipo
 * @param {String} tipo Tipo del elemento
 * @returns Numero de elementos del tipo especificado
 */
export function num(tipo){
    let total = 1;
    elementos.forEach(elemento => {
        if (elemento.tipo === tipo) total++;
    });
    return total;
}

// Flecha y giro
export let E = 0, I = 0;

/**
 * Función que cambia el valor de E
 * @param {*} newE Nuevo valor
 */
export function setE(newE) {
    E = newE;
}

/**
 * Función que cambia el valor de I
 * @param {*} newI Nuevo valor
 */
export function setI(newI) {
    I = newI;
}

/**
 * Calcula la longitud hasta un tramo especificado
 * @param {Object} tramo Número del tramo hasta el que calcular
 * @returns Longitud calculada
 */
export function calculaSegmento(tramo){
    if(tramos.length === 0)
        tramos.splice(0, tramos.length, ...ejViga.tramos);
    
    let total = 0;
    for (let i = 0; i < tramo; i++) {
        total += parseFloat(parseFloat(tramos[i].valor).toFixed(2));
    }
    return total;
}

/**
 * Función que borra todos los elementos
 */
export function limpiaElementos(){ elementos.splice(0); }

/***********************************
 *     Funciones de validación     *
 ***********************************/

// Para la introducción de datos
let tamViga;


/**
 * Vinculación del tamaño de la viga
 * @param {Number} tam Tamaño que se desea asignar
 */
export function vinculaViga(tam){
    // Me quedo con el tamaño de la viga paras futuras validaciones
    tamViga = tam;
}

/**
 * Validación de un soporte
 * @param {String} tipo Tipo de soporte
 * @param {Number} pos Posición en la viga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaSoporte(tipo, pos){
    let error = {
        texto: '',
        existe: false
    };

    if(tipo === ''){
        error.texto = "Se debe seleccionar un tipo de soporte."
        error.existe = true;
        return error;
    }else if( isNaN(pos) || pos < 0 || pos > tamViga){
        error.texto = "Datos incorrectos: Revisa que estes dento de los límites de la viga."
        error.existe = true;
        return error;
    }

    return error;
}

/**
 * Validación de un punto de carga
 * @param {Number} magnitud Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaPuntoC(magnitud, min, max){
    let error = {
        texto: '',
        existe: false
    };

    if ( min > max){
        error.texto = "Datos incorrectos: El valor mínimo para la carga debe ser inferior al del máximo."
        error.existe= true;
    } else if (magnitud < min || magnitud > max){
        error.texto = "Datos incorrectos: El valor de la carga debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    } 

    return error;
}

/**
 * Validación de la normal
 * @param {Number} magnitud Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaNormal(magnitud, min, max){
    let error = {
        texto: '',
        existe: false
    };

    if ( min > max){
        error.texto = "Datos incorrectos: El valor mínimo para la carga debe ser inferior al del máximo."
        error.existe= true;
    } else if (magnitud < min || magnitud > max){
        error.texto = "Datos incorrectos: El valor de la carga debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    } 

    return error;
}

/**
 * Validación de la barra
 * @param {Number} magnitud Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @param {Number} d Valor de distancia de la carga
 * @param {Number} minD Valor de distancia mínimo de la carga
 * @param {Number} maxD Valor de distancia máximo de la carga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaBarra(magnitud, min, max, d, minD, maxD){
    let error = {
        texto: '',
        existe: false
    };

    if ( min > max){
        error.texto = "Datos incorrectos: El valor mínimo para la carga debe ser inferior al del máximo."
        error.existe= true;
    } else if (magnitud < min || magnitud > max){
        error.texto = "Datos incorrectos: El valor de la carga debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    } 

    if ( minD > maxD){
        error.texto = "Datos incorrectos: La longitud mínima del voladizo debe ser inferior a la máxima."
        error.existe= true;
    } else if (d <= 0){
        error.texto = "Datos incorrectos: La longitud debe ser mayor que 0."
        error.existe= true;
    } else if (d < minD || d > maxD){
        error.texto = "Datos incorrectos: La longitud del voladizo debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    }

    return error;
}

/**
 * Validación de un momento
 * @param {Number} magnitud Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaMomento(magnitud, min, max){
    let error = {
        texto: '',
        existe: false
    };

    if ( min > max){
        error.texto = "Datos incorrectos: El valor mínimo para la carga debe ser inferior al del máximo."
        error.existe= true;
    } else if (magnitud < min || magnitud > max){
        error.texto = "Datos incorrectos: El valor de la carga debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    } 

    return error;
}

/**
 * Validación de una carga distribuida
 * @param {Number} pos Posición de inicio en la viga
 * @param {Number} posf Posición final en la viga
 * @param {Number} magnitud Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @returns {Object} error{texto, existe}, existe sera false si todo ha ido bien
 */
export function verificaCargaD(pos, posf, magnitud, min, max){
    let error = {
        texto: '',
        existe: false
    };

    if( pos < 0 || pos > tamViga || posf < 0 || posf > tamViga){
        error.texto = "Datos incorrectos: Revisa que estes dento de los límites de la viga."
        error.existe= true;
    } else if( posf <= pos){
        error.texto = "Datos incorrectos: Revisa que la posición final sea mayor que la inicial.";
        error.existe= true;
    } else if ( min > max){
        error.texto = "Datos incorrectos: El valor mínimo para la carga debe ser inferior al del máximo."
        error.existe= true;
    } else if (magnitud < min || magnitud > max){
        error.texto = "Datos incorrectos: El valor de la carga debe estar entre el mínimo y el máximo indicados."
        error.existe= true;
    } 

    return error;
}