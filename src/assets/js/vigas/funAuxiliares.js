import * as dibujo from '@/assets/js/vigas/dibujar.js';
import * as val from './variables';

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} outerCanvasContainer Contenedor del canvas (div)
 */
export function resizeCanvas(outerCanvasContainer) {
    if(outerCanvasContainer == undefined) return;
    dibujo.canvas.setDimensions({width: outerCanvasContainer.clientWidth});
    redibuja(outerCanvasContainer);
}

/**
 * Función para resetear los datos
 * @param {*} outerCanvasContainer 
 */
export function clearDatos(outerCanvasContainer){
    val.limpiaElementos();
    redibuja(outerCanvasContainer);
}

export function vinculaCanvas(outerCanvasContainer){
    dibujo.vincularCanvas(outerCanvasContainer);
}

/**
 * Funión que vuelve a dibujar todo
 * @param {canvas} outerCanvasContainer Canvas
 */
export function redibuja(outerCanvasContainer){
    if(outerCanvasContainer != null)
        dibujo.reinicia(outerCanvasContainer);
    dibujo.canvas.remove(...dibujo.canvas.getObjects());
    val.elementos.forEach( elemento => {
        switch(elemento.tipo){
            case 'Viga':
                dibujo.addViga(elemento.magnitud);
                break;
            case 'Soporte fijo':
                dibujo.addSoporteFijo(val.calculaSegmento(elemento.segmento));
                break;
            case 'Soporte simple':
                dibujo.addSoporteSimple(val.calculaSegmento(elemento.segmento));
                break;
            case 'Soporte móvil':
                dibujo.addSoporteMovil(val.calculaSegmento(elemento.segmento));
                break;
            case 'Punto de carga':
                dibujo.addPuntoCarga( val.calculaSegmento(elemento.segmento), elemento.magnitud);
                break;
            case 'Barra':
                dibujo.addBarra( val.calculaSegmento(elemento.segmento), elemento.magnitud, elemento.segmentoFinal);
                break;
            case 'Momento':
                dibujo.addMomento( val.calculaSegmento(elemento.segmento), elemento.magnitud);
                break;
            case 'Carga distribuida':
                dibujo.addCargaDistribuida( val.calculaSegmento(elemento.segmento), val.calculaSegmento(elemento.segmentoFinal), elemento.magnitud);
                break;
            case 'Normal':
                dibujo.addNormal(val.calculaSegmento(elemento.segmento), elemento.magnitud);
                break;
        }
    });
}

/********************************
 *      Funciones dibujado      *
 ********************************/

 /**
  * Función que dibuja una viga
  */
 export function addViga(){
    let tam = val.calculaSegmento(val.numTramos()); // Tamaño de la viga
    dibujo.addViga(tam);
    val.vinculaViga(tam);
    val.pushElemento("Viga", {magnitud : tam});
}

/**
 * Función que dibuja un soporte para la viga
 * @param {String} tipo Tipo de soporte
 * @param {Int} seg Posición del vector tramos del segmento asociado
 */
export function addSoporte(tipo, seg){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaSoporte(tipo, coorX);
    if(error.existe) return error;
    val.pushElemento("Soporte " + tipo, 
                    {magnitud: tipo, segmento: seg});
    switch(tipo){
        case 'simple':
            dibujo.addSoporteSimple(coorX);
            break;
        case 'móvil':
            dibujo.addSoporteMovil(coorX);
            break;
        case 'fijo':
            dibujo.addSoporteFijo(coorX);
            break;  
    }
}

/**
 * Función que dibuja una carga
 * @param {Int} seg Posición del vector tramos del segmento asociado
 * @param {Int} P Valor de la carga
 * @param {Int} min Valor mínimo de la carga
 * @param {Int} max Valor máximo de la carga
 */
export function addPuntoCarga(seg, P, min, max){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaPuntoC(P, min, max);
    if(error.existe) return error;
    dibujo.addPuntoCarga(coorX, P);
    val.pushElemento("Punto de carga", { magnitud: P, segmento: seg, min:  min, max: max});
}

/**
 * Función que dibuja una barra
 * @param {String} id ID de la barra
 * @param {Int} seg Posición del vector tramos del segmento asociado
 * @param {Int} H Valor de la carga
 * @param {Int} min Valor mínimo de la carga
 * @param {Int} max Valor máximo de la carga
 * @param {Int} d Distancia respecto a la viga
 * @param {Int} minD Distancia mínima respecto a la viga
 * @param {Int} maxD Distancia máxima respecto a la viga
 */
export function addBarra(id, seg, H, min, max, d, minD, maxD){
    let error = val.verificaBarra(H, min, max, d, minD, maxD);
    if(error.existe) return error;
    let coorX = val.calculaSegmento(seg);
    dibujo.addBarra(coorX, H, d);
    val.pushElemento("Barra", {
        idBarra: id,
        magnitud: H,
        min: min,
        max: max,
        segmento: seg,
        d: d,
        minD: minD,
        maxD: maxD
    });
}

/**
 * Función que dibuja la normal
 * @param {Int} seg Posición del vector tramos del segmento asociado
 * @param {Int} N Valor de la carga
 * @param {Int} min Valor mínimo de la carga
 * @param {Int} max Valor máximo de la carga
 */
export function addNormal(seg, N, min, max){
    let error = val.verificaNormal(N, min, max);
    if(error.existe) return error;
    dibujo.addNormal( seg == "inicio" ? true : false, N);
    val.pushElemento("Normal", {segmento: seg, magnitud: N, min: min, max: max});
}

/**
 * Función que dibuja un momento
 * @param {Int} seg Posición del vector tramos del segmento asociado
 * @param {Int} M Valor del momento
 * @param {Int} min Valor mínimo de la carga
 * @param {Int} max Valor máximo de la carga
 */
export function addMomento(seg, M, min, max){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaMomento(M, min, max);
    if(error.existe) return error;
    dibujo.addMomento(coorX, M);
    val.pushElemento("Momento", {
                            segmento: seg,
                            magnitud: M,
                            min: min,
                            max: max
                            });
}

/**
 * Función que dibuja una carga distribuida
 * @param {Int} desdeSeg Posición inicial del vector tramos del segmento asociado
 * @param {Int} hastaSeg Posición final del vector tramos del segmento asociado
 * @param {Int} q Valor de la carga
 * @param {Int} min Valor mínimo de la carga
 * @param {Int} max Valor máximo de la carga
 */
export function addCargaDistribuida(desdeSeg, hastaSeg, q, min, max){
    let desdeX = val.calculaSegmento(desdeSeg);
    let hastaX = val.calculaSegmento(hastaSeg);
    let error = val.verificaCargaD(desdeX, hastaX, q, min, max);
    if(error.existe) return error;
    dibujo.addCargaDistribuida(desdeX, hastaX, q);
    val.pushElemento("Carga distribuida", {
                                      magnitud: q, 
                                      min: min,
                                      max: max,
                                      segmento: desdeSeg,
                                      segmentoFinal: hastaSeg});
}