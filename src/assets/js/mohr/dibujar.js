import { fabric } from 'fabric';
import * as datos from '@/assets/js/mohr/calculos.js';

// Configuracion de fabric
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

let canvas, maxX, minX, maxY;

function actualizaValores(){
    maxX = (datos.s1 < 0 ? -1 : 1)*Math.ceil((datos.s1 < 0 ? -datos.s1 : datos.s1)/10)*10;
    minX = (datos.s2 < 0 ? -1 : 1)*Math.ceil((datos.s2 < 0 ? -datos.s2 : datos.s2)/10)*10;
    maxY = Math.ceil(datos.radio/10)*10;
}

export function vinculaCanvas(nCanvas, datosIniciales){
    // Creo el canvas de fabric
    canvas = new fabric.Canvas('circulo', {
        width: nCanvas.$el.clientWidth-30,
        height: nCanvas.$el.clientWidth-30,
        selection: false
    });
    dibujarEjes(datosIniciales);
}

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} nCanvas Contenedor del canvas (div)
 */
 export function resizeCanvas(nCanvas, datosIniciales) {
    if(nCanvas == undefined) return;
    canvas.setDimensions({width: nCanvas.$el.clientWidth-30, height: nCanvas.$el.clientWidth-30});
    canvas.remove(...canvas.getObjects());
    dibujarEjes(datosIniciales);
}

function dibujarEjes(datosIniciales){
    actualizaValores();
    let incPuntosX = 0, incPuntosY = 0, puntosX, puntosY, punto, x, y;

    //  Calculo las marcas en el eje X
    do{
        incPuntosX += 10;
        puntosX = Math.abs( maxX - minX)/incPuntosX;
    }while(puntosX > 10);
    
    let incrementoX = (canvas.width-120) / puntosX;

    //  Calculo las marcas en el eje Y
    do{
        incPuntosY += 10;
        puntosY = maxY*2/incPuntosY;
    }while(puntosY > 10);
    
    let incrementoY = (canvas.width-120) / puntosY;

    // Calculo el centro de los ejes
    let centro = calculaCentro(incrementoX, incPuntosX);

    // Dibujo las marcas en el eje X
    punto = minX, x = 40;
    for(let i = 0; i <= puntosX ; i++){
        if(punto !== 0)
            addMarcaX( x, canvas.height/2, punto.toString());
        punto += incPuntosX;
        x += incrementoX;
    }

    // Dibujo las marcas en el eje Y
    punto = -maxY, y = canvas.height-60;
    for(let i = 0; i <= puntosY ; i++){
        if(punto !== 0)
            addMarcaY( centro, y, punto.toString());
        punto += incPuntosY;
        y -= incrementoY;
    }

    // Eje Y
    if(maxX >= 0 && minX <= 0 && centro > 20){
        canvas.add(new fabric.Line([centro, 0, centro, canvas.height], {
            stroke: 'black',
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'default'
        }));
    }else{
        canvas.add(new fabric.Line([ 20, 0, 20, canvas.height], {
            stroke: 'grey',
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'default'
        }));
    }

    // Eje X
    canvas.add(new fabric.Line([0, canvas.height/2, canvas.width, canvas.height/2], {
        stroke: 'black',
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'default'
    }));
    
    // Especifico las unidades del eje X e Y
    escribir(canvas.width < 500 ? centro+30 : centro+40, canvas.width < 500 ? 15 : 20, 'τ(MPa)', 'grey');
    escribir(canvas.width < 500 ? canvas.width-30 : canvas.width-40, canvas.width < 500 ? canvas.height/2-12 : canvas.height/2-15, 'σ(MPa)', 'grey');

    dibujaEsfera(incrementoX, incPuntosX, centro, datosIniciales);
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

    canvas.add(new fabric.Line([ coorX, 60, coorX, canvas.height-60 ], {
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
 function addMarcaY(coorX, coorY, texto){
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

    canvas.add(new fabric.Line([ 40, coorY, canvas.width-80, coorY ], {
        stroke: '#CAC8C8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
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
        fontSize: canvas.width < 500 ? 15 : 20,
        left: x,
        top: y,
        selectable: false,
        evented: false
    });
    canvas.add(text);
    return text;
}

function calculaCentro(incrementoX, incPuntoX){
    let x = 40+(Math.abs(minX) / incPuntoX)*incrementoX;
    return x;
}


function dibujaEsfera(incrementoX, incPuntoX, centro, datosIniciales){
    let nRadio = datos.radio*incrementoX/incPuntoX;
    let coorX = incrementoX/incPuntoX*Math.abs(datos.centro);
    coorX = datos.centro < 0 ? centro - coorX : centro + coorX;

    canvas.add(new fabric.Circle({ 
        radius: nRadio, 
        fill: 'rgba(0,0,0,0)',
        stroke: 'blue',
        top: canvas.width/2,
        left: coorX,
        selectable: false,
        evented: false 
    }));

    // Marca s1
    coorX = incrementoX/incPuntoX*Math.abs(datos.s1);
    coorX = datos.s1 < 0 ? centro - coorX : centro + coorX;
    canvas.add(new fabric.Circle({ 
        radius: 4, 
        fill: '#16961C',
        stroke: 'black',
        top: canvas.width/2,
        left: coorX,
        selectable: false,
        evented: false 
    }));

    canvas.add(new fabric.Line([ coorX, canvas.height/2, coorX+30, canvas.height/2+30 ], {
        stroke: '#16961C',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));

    escribir(canvas.width < 500 ? coorX+50 : coorX+60, canvas.height/2+30, datos.s1.toFixed(2), '#16961C');

    // Marca s2
    coorX = incrementoX/incPuntoX*Math.abs(datos.s2);
    coorX = datos.s2 < 0 ? centro - coorX : centro + coorX;
    canvas.add(new fabric.Circle({ 
        radius: 4, 
        fill: '#16961C',
        stroke: 'black',
        top: canvas.width/2,
        left: coorX,
        selectable: false,
        evented: false 
    }));

    canvas.add(new fabric.Line([ coorX, canvas.height/2, coorX-30, canvas.width < 500 ? canvas.height/2+35 : canvas.height/2+55 ], {
        stroke: '#16961C',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));

    escribir( coorX-20, canvas.width < 500 ? canvas.height/2+45 : canvas.height/2+70, datos.s2.toFixed(2), '#16961C');

    // Marca txymax
    coorX = incrementoX/incPuntoX*Math.abs(datos.centro);
    coorX = datos.centro < 0 ? centro - coorX : centro + coorX;
    canvas.add(new fabric.Circle({ 
        radius: 4, 
        fill: '#16961C',
        stroke: 'black',
        top: canvas.width/2-nRadio,
        left: coorX,
        selectable: false,
        evented: false 
    }));

    canvas.add(new fabric.Line([ coorX, canvas.width/2-nRadio, coorX, canvas.width/2-nRadio-30 ], {
        stroke: '#16961C',
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
    }));

    escribir( coorX, canvas.width/2-nRadio-40, datos.radio.toFixed(2), '#16961C');

    // Representacion Eje X e Y
    let ejeX = {x: datosIniciales.sx, y: -datosIniciales.txy};
    let ejeY = {x: datosIniciales.sy, y: datosIniciales.txy};

    // Calculo las coordenadas de la recta
    ejeX.x = incrementoX/incPuntoX*Math.abs(ejeX.x);
    ejeX.x = datosIniciales.sx < 0 ? centro - ejeX.x : centro + ejeX.x;
    ejeX.y = incrementoX/incPuntoX*Math.abs(ejeX.y);
    ejeX.y = -datosIniciales.txy < 0 ? canvas.height/2 + ejeX.y : canvas.height/2 - ejeX.y;

    ejeY.x = incrementoX/incPuntoX*Math.abs(ejeY.x);
    ejeY.x = datosIniciales.sy < 0 ? centro - ejeY.x : centro + ejeY.x;
    ejeY.y = incrementoX/incPuntoX*Math.abs(ejeY.y);
    ejeY.y = datosIniciales.txy < 0 ? canvas.height/2 + ejeY.y : canvas.height/2 - ejeY.y;

    canvas.add(new fabric.Line([ ejeX.x, ejeX.y, ejeY.x, ejeY.y ], {
        stroke: '#EDB02A',
        strokeWidth: 3,
        selectable: false,
        evented: false,
    }));

    canvas.add(new fabric.Circle({ 
        radius: 4, 
        fill: '#EDB02A',
        stroke: 'black',
        top: ejeX.y,
        left: ejeX.x,
        selectable: false,
        evented: false 
    }));

    // canvas.add(new fabric.Line([ ejeX.x, ejeX.y, ejeX.y < 0 ? ejeX.x : ejeX.x, canvas.width/2-nRadio-30 ], {
    //     stroke: '#16961C',
    //     strokeWidth: 1.5,
    //     selectable: false,
    //     evented: false,
    // }));

    canvas.add(new fabric.Circle({ 
        radius: 4, 
        fill: '#EDB02A',
        stroke: 'black',
        top: ejeY.y,
        left: ejeY.x,
        selectable: false,
        evented: false 
    }));

    // canvas.add(new fabric.Line([ coorX, canvas.width/2-nRadio, coorX, canvas.width/2-nRadio-30 ], {
    //     stroke: '#EDB02A',
    //     strokeWidth: 1.5,
    //     selectable: false,
    //     evented: false,
    // }));
}