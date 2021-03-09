import { fabric } from 'fabric';
import {Mohr} from '@/assets/js/auxiliares/ejercicio.js';
import {canvas} from '@/assets/js/mohr/dibujarCirculo.js';

export function cargaDatos(){
    let datos = new Mohr('1', 2, 'Prueba', '', '');
    datos.sx = -28;
    datos.sy = 27;
    datos.txy = -22;
    datos.B = 71;
    datos.E = 210000;
    datos.v = 0.3;

    return datos;
}

export let maxX, minX, maxY;

export function actualizaValores(s1, s2, radio){
    maxX = (s1 < 0 ? -1 : 1)*Math.ceil((s1 < 0 ? -s1 : s1)/10)*10;
    minX = (s2 < 0 ? -1 : 1)*Math.ceil((s2 < 0 ? -s2 : s2)/10)*10;
    maxY = Math.ceil(radio/10)*10;
}

/**
 * Función que dibuja texto en el canvas
 * @param {string} texto Texto a dibujar
 * @param {float} x Posición X
 * @param {float} y Posición Y
 * @param {string} color Color del texto
 */
export function escribir(x, y, texto, color = 'black') {
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
    return text;
}

/**
 * Función que añade una marca en el eje X
 * @param {int} coorX Donde añadir la marca X
 * @param {int} coorX Donde añadir la marca Y
 * @param {string} texto Valor de la marca
 * @param {string} color Color de la marca
 */
export function addMarcaX(coorX, coorY, texto){
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

    canvas.add(new fabric.Line([ coorX, canvas.width*0.10, coorX, canvas.height-canvas.width*0.10 ], {
        stroke: '#CAC8C8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
}

/**
 * Función que añade una marca en el eje Y
 * @param {int} coorX Donde añadir la marca X
 * @param {int} coorX Donde añadir la marca Y
 * @param {string} texto Valor de la marca
 * @param {string} color Color de la marca
 */
export function addMarcaY(coorX, coorY, texto){
    canvas.add(new fabric.Line([ coorX-5, coorY, coorX+5, coorY ], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.add(new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: 'black',
        fontSize: canvas.width < 500 ? 10 : 15,
        left: coorX-18,
        top: coorY,
        selectable: false,
        evented: false
    }));

    canvas.add(new fabric.Line([ canvas.width*0.10, coorY, canvas.width-canvas.width*0.10, coorY ], {
        stroke: '#CAC8C8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
}

export function addTooltip(objeto, texto, inSub, finSub){
    let rect = new fabric.Rect({
        originX: 'top',
        originY: 'top',
        width: 110,
        height: 25,
        fill: 'rgba(190,190,190,0.8)',
        transparentCorners: true
    });
    let text = new fabric.Text( texto, {
        fontSize: 20,
        originX: 'top',
        originY: 'top'
    }).setSubscript(inSub, finSub);

    let group = new fabric.Group([ rect, text ], {
        left: 0,
        top: 0,
        selectable : false,
        visible: false,
    });

    canvas.add(group);
    canvas.renderAll();

    objeto.on('mouseover', function(e) {
        if (e.target != null)
            e.target.hoverCursor = canvas.defaultCursor;
        let p = canvas.getPointer(e.e);
        group.set({
            left: p.x,
            top: p.y-10,
            visible: true
        });
        canvas.renderAll();
    });
    
    objeto.on('mouseout', function() {
        group.set({
            visible: false
        })
        canvas.renderAll();
    });
}

export function addPunto(top, color,  centroEjes, centroMohr, incrementoX, incPuntoX ){
    let coorX = incrementoX/incPuntoX*Math.abs(centroMohr);
    coorX = centroMohr < 0 ? centroEjes - coorX : centroEjes + coorX;

    canvas.add(new fabric.Circle({ 
        radius: 5, 
        fill: color,
        stroke: 'black',
        top: top,
        left: coorX,
        selectable: false
    }));
}

export function addCaja(top, left, texto, color, toX, toY){
    let coorX, coorY;

    coorY = top ? 13 : canvas.height-13;
    coorX = left ? 45 : canvas.width-45;

    let rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width: 90,
        height: 25,
        fill: 'rgb(255,255,255)',
        stroke: color,
        transparentCorners: true
    });

    let text = new fabric.Text( texto, {
        fontSize: 12,
        originX: 'center',
        originY: 'center'
    });

    let group = new fabric.Group([ rect, text ], {
        originX: 'center',
        originY: 'center',
        left: coorX,
        top: coorY,
        selectable : false,
        evented: false
    });

    canvas.add(group);

    canvas.add(new fabric.Line([ coorX, coorY, toX, toY], {
        stroke: color,
        selectable : false,
        evented: false
    }));
    canvas.sendToBack(canvas.getObjects()[canvas.getObjects().length - 1]);

    canvas.renderAll();
}


export function addCajaFlotante(texto, color, coorX, coorY){

    let rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width: 110,
        height: 25,
        fill: 'rgb(255,255,255)',
        stroke: color,
        transparentCorners: true
    });

    let text = new fabric.Text( texto, {
        fontSize: 12,
        originX: 'center',
        originY: 'center'
    });

    let group = new fabric.Group([ rect, text ], {
        originX: 'center',
        originY: 'center',
        left: coorX,
        top: coorY,
        selectable : false,
        evented: false
    });

    canvas.add(group);

    canvas.renderAll();
    return group;
}