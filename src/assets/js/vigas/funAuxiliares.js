import {redibuja} from '@/assets/js/vigas/main.js';
import {vincularCanvas} from '@/assets/js/vigas/dibujar.js';
import { canvas, elementos, borraElemento, limpiaElementos, pushElemento, reiniciaIds } from './variables';

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} outerCanvasContainer Contenedor del canvas (div)
 */
export function resizeCanvas(outerCanvasContainer) {
    if(outerCanvasContainer == undefined) return;
    canvas.setDimensions({width: outerCanvasContainer.clientWidth});
    reiniciaIds();
    redibuja(outerCanvasContainer);
}

/**
 * Función que obtiene el tamaño mínimo de la viga
 */
export function tamMin(){
    let min = 1;
    elementos.forEach( e => {
        if(parseFloat(e.posX) > min) min = parseFloat(e.posX);
        if(e.posX2 != undefined && e.posX2 > min) min = e.posX2;
    });
    return min;
}

/**
 * Función para resetear los datos
 * @param {*} outerCanvasContainer 
 */
export function clearDatos(outerCanvasContainer){
    limpiaElementos();
    reiniciaIds();
    redibuja(outerCanvasContainer);
}

/**
 * Función que comprueba si un id existe
 * @param {int} id Id a buscar
 * @returns True si existe, False si no
 */
export function existeId(id){
    if( elementos.findIndex(e => e.id == id) == -1)
        return false;
    return true;
}

/**
 * Función que devuelve el elemento con id proporcionado
 * @param {int} id 
 */
export function obtenEl(id){
    return elementos[elementos.findIndex(e => e.id == id)];
}

/**
 * Función que borra un objeto tras modificarlo
 * @param {int} id Id del objeto a borrar 
 * @param {*} outerCanvasContainer
 */
export function borrar(id){
    borraElemento(id);
}

/**
 * Función que borra un objeto
 * @param {int} id Id del objeto a borrar 
 * @param {*} outerCanvasContainer
 */
export function borrarDato(id){
    if(elementos[elementos.findIndex(e => e.id == id)].tipo == 'Viga'){
        return false;
    }else{
        borraElemento(id);
        return true;
    }
}

/**
 * Función que guarga un elemento dibujado
 * @param {string} tipo Tipo de elemento dibujado
 * @param {*} props Propiedades del elemento
 */
export function addElemento(tipo, props){
    pushElemento(tipo, props);
}

export function vinculaCanvas(outerCanvasContainer){
    vincularCanvas(outerCanvasContainer);
}

/**
 * Funión que vuelve a dibujar todo
 * @param {canvas} outerCanvasContainer Canvas
 */
export function redibuja(outerCanvasContainer, elementos){
    dibujo.reinicia(outerCanvasContainer);
    canvas.remove(...canvas.getObjects());
    elementos.forEach( elemento => {
        switch(elemento.tipo){
            case 'Viga':
                addViga();
                break;
            case 'Soporte fijo':
                addSoporte('fijo', elemento.segmento);
                break;
            case 'Soporte simple':
                addSoporte('simple', elemento.segmento);
                break;
            case 'Soporte móvil':
                addSoporte('móvil', elemento.segmento);
                break;
            case 'Punto de carga':
                addPuntoCarga( elemento.alternativa, elemento.segmento, elemento.magnitud);
                break;
            case 'Barra':
                addBarra( elemento.alternativa, elemento.segmento, elemento.magnitud, elemento.segmentoFinal, elemento.idBarra);
                break;
            case 'Momento':
                addMomento( elemento.segmento, elemento.alternativa, elemento.magnitud);
                break;
            case 'Carga distribuida':
                addCargaDistribuida( elemento.segmento, elemento.segmentoFinal, elemento.magnitud);
                break;
            case 'Normal':
                addNormal(elemento.posX, elemento.magnitud);
                break;
        }
    });
}