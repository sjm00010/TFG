import { fabric } from 'fabric';

export let maxX, minX; // maxY;

/**
 * Funcion para actualizar los datos del círculo
 * @param {Number} s1 Sigma 1
 * @param {Number} s2 Sigma 2
 */
export function actualizaValores(s1, s2){
    maxX = (s1 < 0 ? -1 : 1)*Math.ceil((s1 < 0 ? -s1 : s1)/10)*10;
    if(Math.trunc(s2)%10 !== 0)
        s2 = s2-10;
    minX = (s2 < 0 ? -1 : 1)*Math.ceil((s2 < 0 ? -s2 : s2)/10)*10;
}

/**
 * Función que dibuja texto en el canvas
 * @param {String} texto Texto a dibujar
 * @param {Number} x Posición X
 * @param {Number} y Posición Y
 * @param {String} color Color del texto
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
 * @param {Object} canvas Canvas donde dibijar
 * @param {Number} coorX Coordenada X
 * @param {Number} coorY Corrdenada Y
 * @param {String} texto Valor de la marca
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

    canvas.add(new fabric.Line([ coorX, canvas.width*0.1, coorX, canvas.height*0.9 ], {
        stroke: 'rgba(175,175,175,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.sendToBack(canvas.getObjects()[canvas.getObjects().length-1]);
}

/**
 * Función que añade una marca en el eje Y
 * @param {Object} canvas Canvas donde dibijar
 * @param {Number} coorX Coordenada X
 * @param {Number} coorY Corrdenada Y
 * @param {String} texto Valor de la marca
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

    canvas.add(new fabric.Line([ canvas.width*0.1, coorY, canvas.width*0.9, coorY ], {
        stroke: 'rgba(175,175,175,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
    }));
    canvas.sendToBack(canvas.getObjects()[canvas.getObjects().length-1]);
}

/**
 * Función para añadir un tooltip
 * @param {Object} canvas Canvas donde dibujar
 * @param {Object} objeto Objeto fabric donde poner el tooltip
 * @param {String} texto Texto del tooltil
 * @param {Number} inSub Indice del inicio del subindice (si lo hay, en caso contrario 0)
 * @param {Number} finSub Indice del fin del subindice (si lo hay, en caso contrario 0)
 */
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

/**
 * Función que añade un punto en el círculo
 * @param {Object} canvas Canvas donde dibujar
 * @param {String} color Color del punto
 * @param {Number} top Coordenada Y
 * @param {Number} left Coordenada X
 * @returns {fabric.Circle} Objeto fabric creado
 */
export function addPunto(canvas, color, top, left){
    let punto = new fabric.Circle({ 
        radius: 5, 
        fill: color,
        stroke: 'black',
        top: top,
        left: left,
        selectable: false
    });
    canvas.add(punto);
    
    return punto;
}

/**
 * Función que añade una caja con las coordenadas de los planos
 * @param {Object} canvas Canvas donde dibujar
 * @param {String} texto Texto de la caja
 * @param {String} color Color de la caja
 * @param {Number} toX Coordenada X de inicio
 * @param {Number} toY Coordenada Y de inicio
 */
export function addCaja(canvas, texto, color, toX, toY){
    let coorX, coorY;

    coorY = toY > canvas.height/2 ? canvas.height-13 : 13;
    coorX = toX > canvas.width/2 ? canvas.width-45 : 45;

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

/**
 * Funcion que añade una caja flotante para el plano
 * @param {Object} canvas Canvas donde dibujar
 * @param {String} texto Texto de la caja
 * @param {String} color Color de la caja
 * @param {Number} coorX Coordenada X
 * @param {Number} coorY Coordenada Y
 * @returns Grupo fabric creado con la caja y el texto
 */
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

/**
 * Función que añade los datos al dibujo
 * @param {Object} canvas Canvas donde dibujar
 * @param {Object} objeto Objeto donde se va a añadir la info
 * @param {Number} s Valor de sigma
 * @param {Number} t Valor de tau
 * @param {Number} sigma Coordenada de Sigma
 * @param {Number} tau Coordenada de Tau
 * @param {String} letra Letra de Sigma y Tau
 * @param {Number} x Coordenada X
 * @param {Number} y Coordenada Y
 * @param {Number} angulo Angulo de rotación
 * @param {Number} rotacion Angulo de rotación de las flechas
 */
export function addDesc(canvas, objeto, s, t, sigma, tau, letra, x, y, angulo, rotacion){
    let rect = new fabric.Rect({
        originX: 'top',
        originY: 'top',
        width: 150,
        height: 150,
        fill: 'rgba(221, 221, 221, 0.7)',
        stroke: 'rgb(75, 75, 75)',
        transparentCorners: true
    });

    let text1 = new fabric.Text( 'σ' +letra+':'+s, {
        fontSize: 16,
        top: 75,
        left: -20,
        fill: '#B10DC9'
    }).setSubscript(1, 1+letra.length);

    let text2 = new fabric.Text( 'τ' +letra+':'+t, {
        fontSize: 16,
        top: 75,
        left: 40,
        fill: '#1C7D29'
    }).setSubscript(1, 1+letra.length);

    let text3 = new fabric.Text( 'σ' +letra+' ('+s+', '+t+')', {
        fontSize: 18,
        top: 120,
        left: 0,
        fill: 'black'
    }).setSubscript(1, 1+letra.length);

    let linea1 = new fabric.Line([ 10, 40, 55, 40 ], {
        stroke: '#3D9970',
        strokeWidth: 2
    });

    let triangulo1 = new fabric.Triangle({
        top: 40,
        left: tau ? 10 : 55,
        width: 5, 
        height: 5,
        fill: '#3D9970', 
        stroke: '#3D9970', 
        strokeWidth: 3,
        angle: tau ? -90 : 90,
        originY: 'top'
    });

    let linea2 = new fabric.Line([ -20, 10, -20, 50 ], {
        stroke: '#B10DC9',
        strokeWidth: 2
    });

    let triangulo2 = new fabric.Triangle({
        top: sigma ? 50 : 10,
        left: -20,
        width: 5, 
        height: 5,
        fill: '#B10DC9', 
        stroke: '#B10DC9', 
        strokeWidth: 3,
        angle: sigma ? 180 : 0
    });

    let flecha1 = new fabric.Group([ linea1, triangulo1 ]);
    let flecha2 = new fabric.Group([ linea2, triangulo2 ]);

    flecha1.rotate(rotacion);
    flecha2.rotate(rotacion);

    let linea3 = new fabric.Line([ -60, 110, -40, 110 ], {
        stroke: 'black',
        strokeWidth: 1
    });

    let triangulo3 = new fabric.Triangle({
        top: 110,
        left: -40,
        width: 3, 
        height: 3,
        fill: 'black', 
        stroke: 'black', 
        strokeWidth: 1,
        angle: 90
    });

    let flecha3 = new fabric.Group([ linea3, triangulo3 ]);

    let group = new fabric.Group([ rect, text1, text2, text3,
                                   flecha1, flecha2, flecha3 ], {
        left: 0,
        top: 0,
        selectable : false,
        visible: false,
    });

    let angle = addAngulo(canvas, x, y, angulo);


    canvas.add(group, angle);
    canvas.sendToBack(angle)

    let color;

    objeto.on('mousemove', function(e) {
        if (e.target != null)
            e.target.hoverCursor = canvas.defaultCursor;
        
        if(e.target._objects[0].stroke !== '#7FDBFF') color = e.target._objects[0].stroke;

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

/**
 * Función que dibuja el angulo de rotación de la viga
 * @param {Object} canvas Canvas donde dibujar
 * @param {Number} x Coordenada X
 * @param {Number} y Coordenada X
 * @param {Number} angulo Angulo de rotación
 * @returns Grupo fabric creado
 */
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
        inicio = angulo != 0 ? (270 - angulo)*Math.PI/180 : -Math.PI/2;
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

/**
 * Función que calcula las coordenadas X e Y tras la rotación
 * @param {Object} canvas Canvas para las dimensiones
 * @param {Number} x Coordenada X
 * @param {Number} y Coordenada X
 * @param {Number} angulo Angulo de rotación
 * @returns {Object} Coordenadas X e Y rotadas
 */
function rotate(canvas, x, y, angulo) {
    let radians = (Math.PI / 180) * angulo,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - canvas.width/2)) + (sin * (y - canvas.height/2)) + canvas.width/2,
        ny = (cos * (y - canvas.height/2)) - (sin * (x - canvas.width/2)) + canvas.height/2;
    return { x: nx, y: ny};
}