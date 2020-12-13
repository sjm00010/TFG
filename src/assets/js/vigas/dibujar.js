import { fabric } from 'fabric';
import { setInicio, setFin, setCanvas, canvas, inicio, fin, altura, colores} from '@/assets/js/vigas/variables.js';
import { vinculaContenedor } from './variables';

fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

let tamViga;

/**
  * Función que dibuja una viga
  * @param {int} tam Tamaño de la viga
  */
 export function addViga(tam){
    tamViga = tam;
    
    // Creo y añado la viga
    const viga = new fabric.Line([ inicio, altura, fin, altura ], {
        stroke: 'rgb(176,190,197)',
        strokeWidth: 20,
        selectable: false,
        evented: false,
    });
    const filo1 = new fabric.Line([ inicio-10, altura+10, fin+10, altura+10 ], {
        stroke: 'rgb(18,18,18)',
        strokeWidth: 4,
        selectable: false,
        evented: false,
    });
    const filo2 = new fabric.Line([ inicio-10, altura-10, fin+10, altura-10 ], {
        stroke: 'rgb(18,18,18)',
        strokeWidth: 4,
        selectable: false,
        evented: false,
    });
    canvas.add(viga);
    canvas.add(filo1);
    canvas.add(filo2);
    canvas.sendToBack(filo1);
    canvas.sendToBack(filo2);
    canvas.sendToBack(viga);
    
    // Creo y añado la fecha de longitudes
    const linea = new fabric.Line([ inicio, 250, fin+15, 250 ], {
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });
    const arrow = new fabric.Triangle({
        left: fin+20,
        top: 250,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: 90,
        width: 15,
        height: 15,
        fill: 'black',
        selectable: false,
        evented: false,
    });

    canvas.add(linea);
    canvas.add(arrow);

    escribir("x(m)", fin+50, 250, "black");
    addMarca(inicio, "0", 'black');
    addMarca(fin, tamViga.toString(), 'black');
}

/**
 * Función que dibuja un soporte fijo para la viga
 * @param {int} coorX Coordenada con respecto a la viga
 */
export function addSoporteFijo(coorX){
    const x = recalculaX(coorX);

    // Coordenadas
    const y1 = altura-40;
    const y2 = altura+40;
    const x1 = coorX > 0 ? x + 10 : x - 10;

    const filo = new fabric.Line([ x, y1, x, y2 ], {
        stroke: 'rgba(23, 32, 42, 0.9)',
        strokeWidth: 4,
        selectable: false,
        evented: false,
    });
    const pared = new fabric.Line([ x1, y1, x1, y2 ], {
        stroke: 'rgba(76, 133, 139, 0.7)',
        strokeWidth: 20,
        selectable: false,
        evented: false,
    });

    canvas.add(pared);
    canvas.add(filo);

    addMarca( x, coorX.toString(), 'rgb(76, 133, 139)');
}

/**
 * Función que dibuja un soporte simple para la viga
 * @param {int} coorX Coordenada con respecto a la viga
 */
export function addSoporteSimple(coorX){
    const x = recalculaX(coorX);

    const triangulo = new fabric.Triangle({
        left: x,
        top: altura+20,
        originX: 'center',
        originY: 'center',
        pointType: 'arrow_start',
        angle: 0,
        width: 15,
        height: 15,
        stroke: 'black',
        fill: 'white',
        strokeWidth: 2
    });
    const linea = new fabric.Line([ x-15, altura+30, x+15, altura+30 ], {
        stroke: 'grey',
        strokeWidth: 2,
    });

    const group = new fabric.Group([ triangulo, linea ], 
        { left: x, 
          top: altura+20,
          hasControls: false,
          hasBorders: false,
          centeredRotation: false,
          lockMovementY: true
        });
    canvas.add(group);

    group.on('mouseup', function(e) {
        console.log(e.pointer);
    });

    addMarca(x, coorX.toString(), 'grey');
}

/**
 * Función que dibuja un soporte movil para la viga
 * @param {int} coorX Coordenada con respecto a la viga
 */
export function addSoporteMovil(coorX){
    const x = recalculaX(coorX);

    const circulo = new fabric.Circle({
        left: x,
        top: altura+20,
        strokeWidth: 2,
        radius: 7,
        fill: 'white',
        stroke: 'black',
        selectable: false,
        evented: false
    });
    const linea = new fabric.Line([ x-15, altura+30, x+15, altura+30 ], {
        stroke: 'grey',
        strokeWidth: 2,
        selectable: false,
        evented: false
    });
    canvas.add(circulo);
    canvas.add(linea);
    
    addMarca(x, coorX.toString(), 'grey');
}

/**
 * Función que dibuja una carga
 * @param {int} coorX Coordenada con respecto a la viga
 * @param {boolean} sentido Sentido de la carga
 * @param {int} P Valor de la carga
 */
export function addPuntoCarga(coorX, sentido, P){
    const x = recalculaX(coorX);

    // Coordenadas
    const y1 = sentido ? altura-110 : altura+80;
    const y2 = sentido ? altura-20 : altura+20;

    const linea = new fabric.Line([ x, y1, x, y2], {
        stroke: colores.azul,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });
    const arrow = new fabric.Triangle({
        left: x,
        top: y2,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: y2 < altura ? 180 : 0,
        width: 15,
        height: 15,
        fill: colores.azul,
        selectable: false,
        evented: false,
    }); 
    
    canvas.add(linea);
    canvas.add(arrow);

    if(!sentido){
        escribir(P.toString()+" kN", x-30,  altura+60, colores.azul);
    }else{
        escribir(P.toString()+" kN", x,  altura-120, colores.azul);
    }
    addMarca(x, coorX.toString(), colores.azul);
}

/**
 * Función que dibuja una barra
 * @param {int} coorX Coordenada con respecto a la viga
 * @param {boolean} sentido Sentido de la carga
 * @param {int} H Valor de la carga
 * @param {int} d Valor de la carga
 */
export function addBarra(coorX, sentido, H, d){
    
    const x = recalculaX(coorX);
    const y1 = sentido ? altura-12 : altura+12;
    const y2 = sentido ? altura-60 : altura+60;

    const linea = new fabric.Line([ x, y1, x, y2 ], {
        stroke: colores.rojo,
        strokeWidth: 3,
        selectable: false,
        evented: false,
    });
    const linea2 = new fabric.Line([ x-15, y2, x-50, y2 ], {
        stroke: colores.rojo,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });
    const arrow = new fabric.Triangle({
        left: x-10,
        top: y2,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: 90,
        width: 15,
        height: 15,
        fill: colores.rojo,
        selectable: false,
        evented: false,
    });

    canvas.add(linea);
    canvas.add(linea2);
    canvas.add(arrow);

    if(!sentido){
        escribir(H.toString()+" kN", x-30,  altura+80, colores.rojo);
        escribir(d.toString()+" m", x+35,  altura+40, colores.rojo);
    }else{
        escribir(H.toString()+" kN", x-20,  altura-75, colores.rojo);
        escribir(d.toString()+" m", x+35,  altura-30, colores.rojo);
    }
    addMarca(x, coorX.toString(), colores.rojo);
}

/**
 * Función que dibuja un momento
 * @param {int} coorX Coordenada con respecto a la viga
 * @param {String} horario Sentido del momento
 * @param {int} M Valor del momento
 */
export function addMomento(coorX, horario, M){
    let x = recalculaX(coorX);

    let arco = new fabric.Circle({
        radius: 20,
        left: x,
        top: altura,
        angle: 0,
        startAngle: Math.PI + Math.PI/2,
        endAngle: Math.PI/2,
        stroke: colores.naranja,
        strokeWidth: 3,
        fill: '',
        selectable: false,
        evented: false
    });
    let yFlecha = altura-20;
    if(horario == "horario"){
        yFlecha = altura+20;
    }
    let arrow = new fabric.Triangle({
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
        fill: colores.naranja,
        selectable: false,
        evented: false
    });

    canvas.add(arco);
    canvas.add(arrow);

    escribir(M.toString()+" kN·m", x, altura-40, colores.naranja);
    addMarca(x, coorX.toString(), colores.naranja);
}

/**
 * Función que dibuja una carga distribuida
 * @param {int} desdeX Coordenada de inicio
 * @param {int} hastaX Coordenada de fin
 * @param {int} q Valor de la carga
 */
export function addCargaDistribuida(desdeX, hastaX, q){
    let x1 = recalculaX(desdeX);
    let x2 = recalculaX(hastaX);

    // Flecha desde X
    let linea1 = new fabric.Line([ x1, altura-80, x1, altura-20 ], {
        stroke: colores.verde,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });
    let arrow1 = new fabric.Triangle({
        left: x1,
        top: altura-20,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: 180,
        width: 15,
        height: 15,
        fill: colores.verde,
        selectable: false,
        evented: false,
    });

    // Flecha desde X
    let linea2 = new fabric.Line([ x2, altura-80, x2, altura-20 ], {
        stroke: colores.verde,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });
    let arrow2 = new fabric.Triangle({
        left: x2,
        top: altura-20,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        pointType: 'arrow_start',
        angle: 180,
        width: 15,
        height: 15,
        fill: colores.verde,
        selectable: false,
        evented: false,
    });

    // Linea que une las cargas
    let lineaUnion = new fabric.Line([ x1, altura-80, x2, altura-80 ], {
        stroke: colores.verde,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    });

    let fondo = new fabric.Rect({
        left: x1,
        top: altura-10,
        originX: 'left',
        originY: 'top',
        width: x2-x1,
        height: -70,
        angle: 0,
        fill: "rgba(35,160,58,0.2)",
        transparentCorners: false,
        lockRotation: true,
        selectable: false,
        evented: false,
    });

    canvas.add(fondo);
    canvas.add(arrow1);
    canvas.add(linea2);
    canvas.add(arrow2);
    canvas.add(lineaUnion);
    canvas.add(linea1);

    escribir(q.toString()+" kN/m", (x2-x1)/2+x1, altura-90, colores.verde);
    addMarca(x1, desdeX.toString(), colores.verde);
    addMarca(x2, hastaX.toString(), colores.verde);
}

/**
 * Función que dibuja la normal
 * @param {boolean} derecha Donde dibujarla
 * @param {int} N Valor de la carga
 */
export function addNormal(derecha, N){
    let x, linea, arrow;

    if(derecha){
        x = recalculaX(tamViga);
        linea = new fabric.Line([ x+10, altura, x+50, altura ], {
            stroke: colores.morado,
            strokeWidth: 2,
            selectable: false,
            evented: false,
        });
        arrow = new fabric.Triangle({
            left: x+50,
            top: altura,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            pointType: 'arrow_start',
            angle: 90,
            width: 15,
            height: 15,
            fill: colores.morado,
            selectable: false,
            evented: false,
        });
    }else{
        x = recalculaX(0);
        linea = new fabric.Line([ x-50, altura, x-10, altura ], {
            stroke: colores.morado,
            strokeWidth: 2,
            selectable: false,
            evented: false,
        });
        arrow = new fabric.Triangle({
            left: x-50,
            top: altura,
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
            fill: colores.morado,
            selectable: false,
            evented: false,
        });
    }
    canvas.add(linea);
    canvas.add(arrow);

    if(derecha)
        escribir(N.toString()+" kN", x+40,  altura-15, colores.morado);
    else
        escribir(N.toString()+" kN", x-40,  altura-15, colores.morado);
    addMarca(x, derecha ? tamViga.toString() : '0', colores.morado);
}

// Funciones auxiliares al dibujo

/**
 * Función que añade una marca en el eje X
 * @param {int} coorX Donde añadir la carga
 * @param {string} texto Valor de la marca
 * @param {string} color Color de la marca
 */
function addMarca(coorX, texto, color){
    canvas.add(new fabric.Line([ coorX, 240, coorX, 260 ], {
        stroke: color,
        strokeWidth: 2,
        selectable: false,
        evented: false,
    }));
    canvas.add(new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: color,
        fontSize: 20,
        left: coorX,
        top: 275,
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
function escribir( texto, x, y, color) {
    let text = new fabric.Text(texto, {
        fontFamily: 'arial',
        fill: color,
        fontSize: 20,
        left: x,
        top: y,
        hasControls: false,
        hasBorders: false,
        centeredRotation: false,
    });
    canvas.add(text);
    return text;
}

/**
 * Función que recalcula una cordenada en relación a la viga al eje coordedado
 * @param {int} coorX Coordenada de la viga
 */
function recalculaX(coorX){
    return (fin-inicio)*coorX/tamViga + inicio;
}

/**
 * Función que recalcula una cordenada del eje coordedado en relación a la viga
 * @param {int} coorX Coordenada del eje
 */
export function recalculaCoorX(coorX){
    return (coorX-inicio)*tamViga/(fin-inicio);
}

/**
 * Función que reinicia el inicio y fin de la viga
 * @param {*} outerCanvasContainer Contenedor del canvas
 */
export function reinicia(outerCanvasContainer){
    setInicio(outerCanvasContainer.clientWidth*0.10);
    setFin(outerCanvasContainer.clientWidth*0.80);
}

/**
 * Función para vincular el canvas
 * @param {*} outerCanvasContainer 
 */
export function vincularCanvas(outerCanvasContainer){
    vinculaContenedor(outerCanvasContainer);

    // Creo el canvas de fabric
    setCanvas( new fabric.Canvas('editor', {
            width: outerCanvasContainer.clientWidth,
            height: 300,
            selection: false
        })
    );

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

    limitaMovimiento();
}

function limitaMovimiento(){
    // Limites para que no se salgan los objetos del canvas
    canvas.on ("object:moving", function (event) {
        let obj = event.target;
        
        // Límite superior-izquierdo
        if (obj.top < 0 || obj.left < 0) {
            obj.top = Math.max(obj.top, obj.height/2);
            obj.left = Math.max(obj.left, obj.width/2);
        }
        // Límite inferior-derecho
        if ( obj.top + obj.height/2 > obj.canvas.height ||
            obj.left + obj.width/2 > obj.canvas.width
        ) {
            obj.top = Math.min( obj.top, obj.canvas.height - obj.height/2);
            obj.left = Math.min( obj.left, obj.canvas.width - obj.width/2);
        }
    });
}