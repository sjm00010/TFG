import { fabric } from 'fabric';

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
export function escribir(canvas, x, y, texto, color = 'black') {
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
export function addMarcaX(canvas, coorX, coorY, texto){
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
        stroke: 'rgba(175,175,175,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.sendToBack(canvas.getObjects()[canvas.getObjects().length-1]);
}

/**
 * Función que añade una marca en el eje Y
 * @param {int} coorX Donde añadir la marca X
 * @param {int} coorX Donde añadir la marca Y
 * @param {string} texto Valor de la marca
 * @param {string} color Color de la marca
 */
export function addMarcaY(canvas, coorX, coorY, texto){
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
        stroke: 'rgba(175,175,175,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.sendToBack(canvas.getObjects()[canvas.getObjects().length-1]);
}

export function addTooltip(canvas, objeto, texto, inSub, finSub){
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

export function addPunto(canvas, top, color,  centroEjes, centroMohr, incrementoX, incPuntoX ){
    let coorX = incrementoX/incPuntoX*Math.abs(centroMohr);
    coorX = centroMohr < 0 ? centroEjes - coorX : centroEjes + coorX;

    let punto = new fabric.Circle({ 
        radius: 5, 
        fill: color,
        stroke: 'black',
        top: top,
        left: coorX,
        selectable: false
    });
    canvas.add(punto);
    
    return punto;
}

export function addCaja(canvas, top, left, texto, color, toX, toY){
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


export function addCajaFlotante(canvas, texto, color, coorX, coorY){

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

export function addDesc(canvas, objeto, s, t, sigma, tau, letra, x, y, angulo){
    let rect = new fabric.Rect({
        originX: 'top',
        originY: 'top',
        width: 120,
        height: 120,
        fill: 'rgba(221, 221, 221, 0.7)',
        stroke: 'rgb(75, 75, 75)',
        transparentCorners: true
    });

    let text1 = new fabric.Text( s, {
        fontSize: 16,
        top: 75,
        left: -20,
        fill: '#B10DC9'
    });

    let text2 = new fabric.Text( t, {
        fontSize: 15,
        top: 70,
        left: 40,
        fill: '#3D9970'
    });

    let text3 = new fabric.Text( 'σ'+letra+' ('+s+', '+t+')', {
        fontSize: 16,
        top: 100,
        left: 20,
        fill: 'black'
    }).setSubscript(1, 1+letra.length);

    let linea1 = new fabric.Line([ 10, 50, 70, 50 ], {
        stroke: '#3D9970',
        strokeWidth: 2
    });

    let linea2 = new fabric.Line([ -20, 10, -20, 60 ], {
        stroke: '#B10DC9',
        strokeWidth: 2
    });

    let triangulo1 = new fabric.Triangle({
        top: 50,
        left: tau ? 5 : 70,
        width: 5, 
        height: 5,
        fill: '#3D9970', 
        stroke: '#3D9970', 
        strokeWidth: 3,
        angle: tau ? -90 : 90,
        originY: 'top'
    });

    let triangulo2 = new fabric.Triangle({
        top: sigma ? 60 : 10,
        left: -20,
        width: 5, 
        height: 5,
        fill: '#B10DC9', 
        stroke: '#B10DC9', 
        strokeWidth: 3,
        angle: sigma ? 180 : 0
    });

    let group = new fabric.Group([ rect, text1, text2, text3,
                                   linea1, linea2, triangulo1,
                                   triangulo2 ], {
        left: 0,
        top: 0,
        selectable : false,
        visible: false,
    });

    let angle = addAngulo(canvas, x, y, angulo);

    canvas.add(group, angle);
    canvas.sendToBack(angle)

    let color;

    objeto.on('mouseover', function(e) {
        if (e.target != null)
            e.target.hoverCursor = canvas.defaultCursor;
        
        color = e.target._objects[0].stroke;

        for (let i = 0; i < e.target._objects.length; i++) {
            e.target._objects[i].set({stroke: '#7FDBFF', fill: '#7FDBFF'});    
        }

        let p = canvas.getPointer(e.e);
        angle.set({
            visible: true
        });
        group.set({
            left: p.x,
            top: p.y-15,
            visible: true
        });
        canvas.renderAll();
    });
    
    objeto.on('mouseout', function(e) {
        for (let i = 0; i < e.target._objects.length; i++) {
            e.target._objects[i].set({stroke: color, fill: color});    
        }

        group.set({
            visible: false
        });
        angle.set({
            visible: false
        });
        canvas.renderAll();
    });
}

function addAngulo( canvas, x, y, angulo){
    let coor = rotate(canvas, x, y, angulo);
    let linea1 = new fabric.Line([ canvas.width/2, canvas.height/2, coor.x, coor.y ], {
        stroke: 'rgba(0,0,0,0.4)',
        strokeWidth: 1
    });

    let linea2 = new fabric.Line([ canvas.width/2, canvas.height/2, x,  y ], {
        stroke: 'rgba(0,0,0,0.4)',
        strokeWidth: 1
    });

    let inicio = 0, fin = 0;
    if(x > canvas.width/2 && y == canvas.height/2){
        inicio = angulo != 0 ? (360 - angulo)*Math.PI/180 : 0;
        fin = 0;
    }else if(x < canvas.width/2 && y == canvas.height/2){
        inicio = angulo != 0 ? (180 - angulo)*Math.PI/180 : Math.PI;
        fin = Math.PI;
    }else if(x == canvas.width/2 && y > canvas.height/2){
        inicio = angulo != 0 ? (90 - angulo)*Math.PI/180 : Math.PI/2;
        fin = Math.PI/2;
    }else{
        inicio = angulo != 0 ? (270 - angulo)*Math.PI/180 : 2*Math.PI;
        fin = -Math.PI/2;
    }

    let radio = new fabric.Circle({
        radius: 20,
        left: canvas.width/2,
        top: canvas.height/2,
        startAngle: inicio,
        endAngle: fin,
        stroke: 'orange',
        strokeWidth: 1,
        fill: ''
    });

    let text = new fabric.Text( angulo+'º', {
        fontSize: 13,
        top:  y - canvas.height/2 > 0 ? canvas.height/2+30 : canvas.height/2-30,
        left: x - canvas.width/2 > 0 ? canvas.width/2+30 : canvas.width/2-30,
        fill: 'orange'
    });

    let group = new fabric.Group([ linea1, linea2, radio, text ], {
        selectable : false,
        evented : false,
        visible: false,
    });

    canvas.add(group);

    return group;
}

function rotate(canvas, x, y, angulo) {
    let radians = (Math.PI / 180) * angulo,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - canvas.width/2)) + (sin * (y - canvas.height/2)) + canvas.width/2,
        ny = (cos * (y - canvas.height/2)) - (sin * (x - canvas.width/2)) + canvas.height/2;
    return { x: nx, y: ny};
}

// function calculaAngulo(oX, oY, dX, dY){
//     let delta_x = dX - oX;
//     let delta_y = dY - oY;
//     return Math.atan2(delta_y, delta_x)* (180/Math.PI);
// }