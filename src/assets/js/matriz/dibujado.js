import { fabric } from 'fabric';
import { getDvtot } from '@/assets/js/matriz/calculoMatrices.js';

/////////////////
//  Variables  //
/////////////////

let canvas;
let X = {min: 0, max: 0};
let Y = {min: 0, max: 0};
let dimX = {inicio: 0, fin: 0};
let dimY = {inicio: 0, fin: 0};

////////////////////////
//  Funciones canvas  //
////////////////////////

/**
 * Función para vincular el canvas
 * @param {*} outerCanvasContainer 
 */
 export function vincularCanvas(outerCanvasContainer){    
    // Creo el canvas de fabric
    canvas = new fabric.Canvas('dibujo', {
            width: outerCanvasContainer.clientWidth,
            height: 300,
            selection: false
        });

    canvas.hoverCursor = 'pointer';
    canvas.on({
        'mouse:down': function(e) {
            if (e.target) {
                e.target.opacity = 0.5;
                canvas.renderAll();
            }
        },
        'mouse:up': function(e) {
            if (e.target) {
              e.target.opacity = 1;
              canvas.renderAll();
            }
        }
    });

    // Establezco las proporciones
    reinicia(outerCanvasContainer);
}

/**
 * Función que reinicia el inicio y fin del dibujo
 * @param {*} outerCanvasContainer Contenedor del canvas
 */
 export function reinicia(outerCanvasContainer){
    dimX.inicio = outerCanvasContainer.clientWidth*0.15;
    dimX.fin = outerCanvasContainer.clientWidth*0.85;
    dimY.inicio = outerCanvasContainer.clientHeight*0.15;
    dimY.fin = outerCanvasContainer.clientHeight*0.85;
}

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} outerCanvasContainer Contenedor del canvas (div)
 */
 export function resizeCanvas(outerCanvasContainer) {
    if(outerCanvasContainer == undefined) return;
    limpiarTodo();
    canvas.setDimensions({width: outerCanvasContainer.clientWidth});
    if(outerCanvasContainer != null)
        reinicia(outerCanvasContainer);
}

/**
 * Función para limpiar el canvas
 */
export function limpiarTodo() {
    canvas.remove(...canvas.getObjects());
}

/////////////////////////////
//  Funciones de dibujado  //
/////////////////////////////

function movilVertical(coorX, coorY, espejo){
    canvas.add(new fabric.Circle({
        left: coorX,
        top: coorY,
        strokeWidth: 2,
        radius: 7,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ espejo ? coorX-10 : coorX+10, coorY-15,  espejo ? coorX-10 : coorX+10, coorY+15 ], {
        stroke: 'rgba(140, 140, 140, 0.5)',
        strokeWidth: 7,
        selectable: false,
        evented: false
    }));
}

function movilHorizontal(coorX, coorY){
    canvas.add(new fabric.Circle({
        left: coorX,
        top: coorY,
        strokeWidth: 2,
        radius: 7,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX-15, coorY+10, coorX+15, coorY+10 ], {
        stroke: 'rgba(140, 140, 140, 0.5)',
        strokeWidth: 7,
        selectable: false,
        evented: false
    }));
}

function codo(coorX, coorY){
    canvas.add(new fabric.Line([ coorX-15, coorY-10, coorX+15, coorY-10 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));
    
    canvas.add(new fabric.Line([ coorX-15, coorY+10, coorX+15, coorY+10 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX-10, coorY-15, coorX-10, coorY+15 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX+10, coorY-15, coorX+10, coorY+15 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));
}

function fijo(coorX, coorY){
    canvas.add(new fabric.Triangle({
        left: coorX,
        top: coorY,
        originX: 'center',
        originY: 'center',
        pointType: 'arrow_start',
        angle: 0,
        width: 15,
        height: 15,
        stroke: '#1C7D29',
        fill: 'white',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX-15, coorY+10, coorX+15, coorY+10 ], {
        stroke: 'rgba(140, 140, 140, 0.5)',
        strokeWidth: 7,
        selectable: false,
        evented: false
    }));
}

function rollVertical(coorX, coorY, espejo){
    canvas.add(new fabric.Circle({
        left: coorX+3,
        top: coorY-10,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));
    canvas.add(new fabric.Circle({
        left: coorX+3,
        top: coorY,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));
    canvas.add(new fabric.Circle({
        left: coorX+3,
        top: coorY+10,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));
    espejo ? coorX+10 : coorX-5
    canvas.add(new fabric.Line([ espejo ? coorX-5 : coorX+10, coorY-15, espejo ? coorX-5 : coorX+10, coorY+15 ], {
        stroke: 'rgba(140, 140, 140, 0.5)',
        strokeWidth: 7,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ espejo ? coorX+10 : coorX-3, coorY-15, espejo ? coorX+10 : coorX-3, coorY+15 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));
}

function rollHorizontal(coorX, coorY){
    canvas.add(new fabric.Circle({
        left: coorX-10,
        top: coorY+3,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));
    canvas.add(new fabric.Circle({
        left: coorX,
        top: coorY+3,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));
    canvas.add(new fabric.Circle({
        left: coorX+10,
        top: coorY+3,
        strokeWidth: 2,
        radius: 4,
        fill: 'white',
        stroke: '#1C7D29',
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX-15, coorY+10, coorX+15, coorY+10 ], {
        stroke: 'rgba(140, 140, 140, 0.5)',
        strokeWidth: 7,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ coorX-15, coorY-3, coorX+15, coorY-3 ], {
        stroke: 'rgba(140, 140, 140, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));
}

function cuadrado(coorX, coorY){
    canvas.add(new fabric.Rect({
        left: coorX,
        top: coorY,
        originX: 'center',
        originY: 'center',
        width: 20,
        height: 20,
        stroke: 'rgba(140, 140, 140, 0.7)',
        fill: 'rgba(10, 90, 145, 0.4)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));
}

/////////////////////////////
//  Funciones de los ejes  //
/////////////////////////////

export function calculaDimensiones(datos){
    let minY = datos[0][2].valor, minX = datos[0][1].valor, maxY = 0, maxX = 0;
    datos.forEach((nodo) => {
        if(nodo[1].valor < minX) minX = parseFloat(nodo[1].valor);
        if(nodo[2].valor < minY) minY = parseFloat(nodo[2].valor);
        if(nodo[1].valor > maxX) maxX = parseFloat(nodo[1].valor);
        if(nodo[2].valor > maxY) maxY = parseFloat(nodo[2].valor);
    });
    Y.min = minY;
    Y.max = maxY;
    X.min = minX;
    X.max = maxX;
}

/**
 * Función que calcula una cordenada X para el eje ficticio
 * @param {Number} coorX Coordenada de la viga
 */
function calculaX(coorX){
    if(X.max === X.min) return dimX.inicio;
    return (coorX-X.min)*(dimX.fin-dimX.inicio)/(X.max-X.min) + dimX.inicio;
}

/**
 * Función que calcula una cordenada Y para el eje ficticio
 * @param {Number} coorY Coordenada de la viga
 */
function calculaY(coorY){
    if(Y.max === Y.min) return dimY.fin;
    return dimY.fin - (coorY-Y.min)*(dimY.fin-dimY.inicio)/(Y.max-Y.min) ;
}

export function dibujaNodos(barras, nodos, bc, cargas){
    conectaNodos(barras, nodos, bc);
    nodos.forEach((nodo, i) => {
        canvas.add(new fabric.Circle({
            left: calculaX(parseFloat(nodo[1].valor)),
            top: calculaY(parseFloat(nodo[2].valor)),
            strokeWidth: 3,
            radius: 2,
            fill: 'grey',
            stroke: 'grey',
            selectable: false,
            evented: false
        }));

        escribir(calculaX(parseFloat(nodo[1].valor)), calculaY(parseFloat(nodo[2].valor))+25, (i+1).toString());

        dibujaCondiciones(bc, i, calculaX(parseFloat(nodo[1].valor)), calculaY(parseFloat(nodo[2].valor)), nodos[i+1]);
    });

    cargas.forEach((carga) => {
        dibujaFuerzas(calculaX(parseFloat(nodos[carga[0]-1][1].valor)), 
                      calculaY(parseFloat(nodos[carga[0]-1][2].valor)),
                      carga[1],
                      carga[2].valor
                      );
    });
}

function conectaNodos(barras, nodos){
    barras.forEach((barra) => {
        let x1 = calculaX(nodos[barra[1]-1][1].valor),
            y1 = calculaY(nodos[barra[1]-1][2].valor),
            x2 = calculaX(nodos[barra[2]-1][1].valor),
            y2 = calculaY(nodos[barra[2]-1][2].valor);
        canvas.add(new fabric.Line([ x1, y1, x2, y2 ], {
            stroke: '#1A1313',
            strokeWidth: 2,
            selectable: false,
            evented: false
        }));

        dibujaFlecha(x1, x2, y1, y2);
    });
}

function dibujaFlecha(x1, x2, y1, y2){
    let x = Math.abs(x2-x1)/2 + Math.min(x1, x2);
    let alfa = Math.atan(Math.abs(y2-y1)/Math.abs(x2-x1)) * (180/Math.PI);
    let stringAlfa = 0;
    let m = Math.abs(y2-y1)/Math.abs(x2-x1);
    let y1prima = m*Math.abs((x-20)-x1)+Math.min(y1, y2)-20;
    let y2prima = m*Math.abs((x+20)-x1)+Math.min(y1, y2)-20;

    let ty = y1prima;
    if(x2 > x1){
        if(y1 > y2){
            let aux = y1prima;
            y1prima = Math.max(y1prima, y2prima);
            y2prima = Math.min(aux, y2prima);
            stringAlfa = alfa;
            alfa = 90 - alfa;
            ty = Math.min(y1prima, y2prima);
        }else{
            let aux = y1prima;
            y1prima = Math.min(y1prima, y2prima);
            y2prima = Math.max(aux, y2prima);
            stringAlfa = 360 - alfa;
            alfa = 90 + alfa;
            ty = Math.max(y1prima, y2prima);
        }
    } else {
        if(y2 > y1){
            let aux = y1prima;
            y1prima = Math.max(y1prima, y2prima);
            y2prima = Math.min(aux, y2prima);
            stringAlfa = 270-alfa;
            alfa = 270 - alfa;
            ty = Math.max(y1prima, y2prima);
        }else{
            let aux = y1prima;
            y1prima = Math.min(y1prima, y2prima);
            y2prima = Math.max(aux, y2prima);
            stringAlfa = 180-alfa;
            alfa = 270+alfa;
            ty = Math.min(y1prima, y2prima);
        }
    }

    canvas.add(new fabric.Line([ x-20, y1prima, x+20, y2prima ], {
        stroke: 'rgba(80, 165, 185, 0.7)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        top: ty,
        left: x2 > x1 ? x+20 : x-20,
        fill: 'rgba(80, 165, 185, 1)', 
        stroke: 'rgba(80, 165, 185, 1)',
        width: 10, 
        height: 10,
        angle: alfa,
        strokeWidth: 1,
        selectable: false,
        evented: false
    }));

    stringAlfa = stringAlfa === 360 ? 0 : stringAlfa;
    escribir(x-15, (y1prima+y2prima)/2 -15, parseFloat(stringAlfa.toFixed(2))+' º', 'rgba(80, 165, 185, 1)');
}

function dibujaCondiciones(bc, i, x, y, nextNodo){
    let espejo = false;
    let estado = ''+bc[i][1]+'-'+bc[i][2]+'-'+bc[i][3];
    switch(estado){
        case 'true-false-false':
            if(nextNodo)
                espejo = calculaX(nextNodo[1].valor) > x;
            movilVertical(x, y, espejo);
            break;
        case 'false-true-false':
            movilHorizontal(x, y);
            break;
        case 'false-false-true':
            codo(x, y);
            break;
        case 'true-true-false':
            fijo(x, y);
            break;
        case 'true-false-true':
            if(nextNodo)
                espejo = calculaX(nextNodo[1].valor) > x;
            rollVertical(x, y, espejo);
            break;
        case 'false-true-true':
            rollHorizontal(x, y);
            break;
        case 'true-true-true':
            cuadrado(x, y);
            break;
    }
}

/**
 * Función que dibuja texto en el canvas
 * @param {string} texto Texto a dibujar
 * @param {float} x Posición X
 * @param {float} y Posición Y
 * @param {string} color Color del texto
 */
function escribir(x, y, texto, color = 'black') {
    let text = new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: color,
        fontSize: canvas.width < 500 ? 10 : 17,
        left: x,
        top: y,
        selectable: false,
        evented: false
    });
    canvas.add(text);
}


export function dibujaFuerzas(x, y, tipo, mag){
    let x1, x2, y1, y2, rot, tx, ty;
    switch(tipo){
        case 1: // Horizontal
            x1 = x-50;
            x2 = x-20;
            tx = mag > 0 ? x1 : x2;
            y1 = y;
            y2 = y;
            ty = y;
            rot = mag > 0 ? 270 : 90;
            dibujaFuerzaHV(x1, x2, y1, y2, tx, ty, rot, mag);
            break;
        case 2: // Vertical
            x1 = x;
            x2 = x;
            tx = x;
            y1 = y-50;
            y2 = y-20;
            ty = mag > 0 ? y1 : y2;
            rot = mag > 0 ? 0 : 180;
            dibujaFuerzaHV(x1, x2, y1, y2, tx, ty, rot, mag);
            break;
        case 3: // Momento
            dibujaMomento(x, y, mag);
            break;
    }
}

function dibujaFuerzaHV(x1, x2, y1, y2, tx, ty, rot, mag){
    let color = x1 === x2 ? 'rgba(40, 80, 170, 0.7)' : 'rgba(125, 33, 129,0.7)';
    canvas.add(new fabric.Line([ x1, y1, x2, y2 ], {
        stroke: color,
        strokeWidth: 2,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        top: ty,
        left: tx,
        fill: color, 
        stroke: color,
        width: 10, 
        height: 10,
        angle: rot,
        strokeWidth: 1,
        selectable: false,
        evented: false
    }));
        escribir(x1, y1-15, parseFloat(Math.abs(mag).toFixed(2))+' kN', color);
}

function dibujaMomento(x, y, mag){
    canvas.add(new fabric.Circle({
        radius: 20,
        left: x,
        top: y,
        angle: 0,
        startAngle: Math.PI + Math.PI/2,
        endAngle: Math.PI/2,
        stroke: "rgba(255,157,65,0.7)",
        strokeWidth: 3,
        fill: '',
        selectable: false,
        evented: false
    }));

    let yFlecha = y-20;
    if(mag > 0){
        yFlecha = y+20;
    }
    canvas.add(new fabric.Triangle({
        left: x-5,
        top: yFlecha,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: 270,
        width: 15,
        height: 15,
        fill: "rgba(255,157,65,0.7)",
        selectable: false,
        evented: false
    }));
    
    escribir( x+50, y+15, parseFloat(Math.abs(mag).toFixed(2))+' kN', 'rgba(255,157,65,0.7)');
}

const FACTOR = 60;

export function dibujaDesplazamientos(nodos){
    let deformada = getDvtot();
    
    nodos.forEach((nodo, i) => {
        let x = calculaX(parseFloat(nodo[1].valor+deformada[i*3]*FACTOR));
        let y = calculaY(parseFloat(nodo[2].valor+deformada[i*3+1]*FACTOR));
        canvas.add(new fabric.Circle({
            left: x,
            top: y,
            strokeWidth: 3,
            radius: 2,
            fill: 'rgba(230, 10, 40, 0.7)',
            stroke: 'rgba(230, 10, 40, 0.7)',
            selectable: false,
            evented: false
        }));
        escribir( x, y-15, 'θ'+(i+1)+' = '+deformada[i*3+2].toFixed(4)+' rad', 'rgba(230, 10, 40, 0.7)');
    });
}