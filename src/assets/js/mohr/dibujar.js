import { fabric } from 'fabric';
import * as datos from '@/assets/js/mohr/calculos.js';

// Configuracion de fabric
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

let canvas, maxX, minX;

function actualizaValores(){
    maxX = (datos.s1 < 0 ? -1 : 1)*Math.ceil((datos.s1 < 0 ? -datos.s1 : datos.s1)/10)*10;
    minX = (datos.s2 < 0 ? -1 : 1)*Math.ceil((datos.s2 < 0 ? -datos.s2 : datos.s2)/10)*10;
}

export function vinculaCanvas(nCanvas){
    // Creo el canvas de fabric
    canvas = new fabric.Canvas('circulo', {
        width: nCanvas.clientWidth,
        height: nCanvas.clientWidth/2,
        selection: false
    });
    dibujarEjes();
}

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} nCanvas Contenedor del canvas (div)
 */
 export function resizeCanvas(nCanvas) {
    if(nCanvas == undefined) return;
    canvas.setDimensions({width: nCanvas.clientWidth, height: nCanvas.clientWidth/2});
    canvas.remove(...canvas.getObjects());
    dibujarEjes();
}

function dibujarEjes(){
    actualizaValores();
    let puntos = Math.abs( maxX - minX)/10;
    let incremento = (canvas.width-160) / puntos;

    canvas.add(new fabric.Line([calculaCentro(incremento), 0, calculaCentro(incremento), canvas.height], {
        stroke: 'black',
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'default'
    }));
    canvas.add(new fabric.Line([0, canvas.height/2, canvas.width, canvas.height/2], {
        stroke: 'black',
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'default'
    }));

    escribir(canvas.width < 500 ? canvas.width-30 : canvas.width-40, canvas.width < 500 ? canvas.height/2-12 : canvas.height/2-15, 'σ(MPa)');
    escribir(canvas.width < 500 ? canvas.width/2+30 : canvas.width/2+40, canvas.width < 500 ? 10 : 15, 'τ(MPa)');

    actualizaValores();

    console.log(calculaCentro(incremento))

    let punto = minX, x = 80;
    for(let i = 0; i <= puntos ; i++){
        addMarcaX( x, canvas.height/2, punto.toString());
        punto += 10;
        x += incremento;
    }
}

/**
 * Función que añade una marca en el eje X
 * @param {int} coorX Donde añadir la marca X
 * @param {int} coorX Donde añadir la marca Y
 * @param {string} texto Valor de la marca
 * @param {string} color Color de la marca
 */
function addMarcaX(coorX, coorY, texto){
    canvas.add(new fabric.Line([ coorX, coorY-5, coorX, coorY+5 ], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.add(new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: 'black',
        fontSize: canvas.width < 500 ? 10 : 15,
        left: coorX,
        top: coorY+15,
        selectable: false,
        evented: false
    }));
}

/**
 * Función que dibuja texto en el canvas
 * @param {string} texto Texto a dibujar
 * @param {float} x Posición X
 * @param {float} y Posición Y
 * @param {string} color Color del texto
 */
function escribir(x, y, texto) {
    let text = new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: 'black',
        fontSize: canvas.width < 500 ? 15 : 20,
        left: x,
        top: y,
        selectable: false,
        evented: false
    });
    canvas.add(text);
    return text;
}

function calculaCentro(incremento){
    let x = Math.abs(minX) / 10 + 1;
    return x*incremento+4;
}