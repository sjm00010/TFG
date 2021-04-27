import * as dibujo from '@/assets/js/vigas/dibujar.js';
import * as val from './variables';

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {Object} outerCanvasContainer Contenedor del canvas (div)
 */
export function resizeCanvas(outerCanvasContainer) {
    if(outerCanvasContainer == undefined) return;
    dibujo.canvas.setDimensions({width: outerCanvasContainer.clientWidth});
    redibuja(outerCanvasContainer);
}

/**
 * Función para resetear los datos
 * @param {Object} outerCanvasContainer Contenedor del canvas (div)
 */
export function clearDatos(outerCanvasContainer){
    val.limpiaElementos();
    redibuja(outerCanvasContainer);
}

/**
 * Función para inicializar el canvas
 * @param {Object} outerCanvasContainer Contenedor del canvas (div)
 */
export function vinculaCanvas(outerCanvasContainer){
    dibujo.vincularCanvas(outerCanvasContainer);
}

/**
 * Función que vuelve a dibujar todo
 * @param {canvas} outerCanvasContainer Contenedor del canvas (div)
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
            case 'Apoyo fijo':
                dibujo.addSoporteFijo(val.calculaSegmento(elemento.segmento));
                break;
            case 'Apoyo simple':
                dibujo.addSoporteSimple(val.calculaSegmento(elemento.segmento));
                break;
            case 'Apoyo móvil':
                dibujo.addSoporteMovil(val.calculaSegmento(elemento.segmento));
                break;
            case 'Carga puntual':
                dibujo.addPuntoCarga( val.calculaSegmento(elemento.segmento), elemento.magnitud);
                break;
            case 'Voladizo vertical':
                dibujo.addBarra( val.calculaSegmento(elemento.segmento), elemento.magnitud, elemento.d);
                break;
            case 'Momento':
                dibujo.addMomento( val.calculaSegmento(elemento.segmento), elemento.magnitud);
                break;
            case 'Carga distribuida':
                dibujo.addCargaDistribuida( val.calculaSegmento(elemento.segmento), val.calculaSegmento(elemento.segmentoFinal), elemento.magnitud);
                break;
            case 'Axil':
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
    val.pushElemento("Viga", {nombre: 'L', magnitud : tam});
}

/**
 * Función que dibuja un soporte para la viga
 * @param {String} nom Nombre del elemento
 * @param {String} tipo Tipo de soporte
 * @param {Number} seg Posición del vector tramos del segmento asociado
 */
export function addSoporte(nom, tipo, seg){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaSoporte(tipo, coorX);
    if(error.existe) return error;
    val.pushElemento("Apoyo " + tipo, 
                    {nombre: nom, magnitud: tipo, segmento: seg});
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
 * @param {String} nom Nombre del elemento
 * @param {Number} seg Posición del vector tramos del segmento asociado
 * @param {Number} P Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 */
export function addPuntoCarga(nom, seg, P, min, max){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaPuntoC(P, min, max);
    if(error.existe) return error;
    dibujo.addPuntoCarga(coorX, P);
    val.pushElemento("Carga puntual", { nombre: nom, magnitud: P, segmento: seg, min:  min, max: max});
}

/**
 * Función que dibuja una barra
 * @param {String} nom Nombre del elemento
 * @param {Number} seg Posición del vector tramos del segmento asociado
 * @param {Number} H Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 * @param {Number} d Distancia respecto a la viga
 * @param {Number} minD Distancia mínima respecto a la viga
 * @param {Number} maxD Distancia máxima respecto a la viga
 * @param {Boolean} orientacion Indica la orientación del voladizo
 */
export function addBarra(nom,  seg, H, min, max, d, minD, maxD, orientacion){
    let error = val.verificaBarra(H, min, max, d, minD, maxD);
    if(error.existe) return error;
    let coorX = val.calculaSegmento(seg);
    dibujo.addBarra(coorX, H, d, orientacion);
    val.pushElemento("Voladizo vertical", {
        nombre: nom,
        magnitud: H,
        min: min,
        max: max,
        segmento: seg,
        d: d,
        minD: minD,
        maxD: maxD,
        orientacion: orientacion
    });
}

/**
 * Función que dibuja la normal
 * @param {String} nom Nombre del elemento
 * @param {Number} seg Posición del vector tramos del segmento asociado
 * @param {Number} N Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 */
export function addNormal(nom, seg, N, min, max){
    let error = val.verificaNormal(N, min, max);
    if(error.existe) return error;
    dibujo.addNormal( val.calculaSegmento(seg), N);
    val.pushElemento("Axil", {nombre: nom, segmento: seg, magnitud: N, min: min, max: max});
}

/**
 * Función que dibuja un momento
 * @param {String} nom Nombre del elemento
 * @param {Number} seg Posición del vector tramos del segmento asociado
 * @param {Number} M Valor del momento
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 */
export function addMomento(nom, seg, M, min, max){
    let coorX = val.calculaSegmento(seg);
    let error = val.verificaMomento(M, min, max);
    if(error.existe) return error;
    dibujo.addMomento(coorX, M);
    val.pushElemento("Momento", {
                            nombre: nom,
                            segmento: seg,
                            magnitud: M,
                            min: min,
                            max: max
                            });
}

/**
 * Función que dibuja una carga distribuida
 * @param {String} nom Nombre del elemento
 * @param {Number} desdeSeg Posición inicial del vector tramos del segmento asociado
 * @param {Number} hastaSeg Posición final del vector tramos del segmento asociado
 * @param {Number} q Valor de la carga
 * @param {Number} min Valor mínimo de la carga
 * @param {Number} max Valor máximo de la carga
 */
export function addCargaDistribuida(nom, desdeSeg, hastaSeg, q, min, max){
    let desdeX = val.calculaSegmento(desdeSeg);
    let hastaX = val.calculaSegmento(hastaSeg);
    let error = val.verificaCargaD(desdeX, hastaX, q, min, max);
    if(error.existe) return error;
    dibujo.addCargaDistribuida(desdeX, hastaX, q);
    val.pushElemento("Carga distribuida", {
                                      nombre: nom,
                                      magnitud: q, 
                                      min: min,
                                      max: max,
                                      segmento: desdeSeg,
                                      segmentoFinal: hastaSeg});
}