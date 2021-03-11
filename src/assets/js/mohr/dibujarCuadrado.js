import { fabric } from 'fabric';
import * as datos from '@/assets/js/mohr/calculos.js';
import {addDesc} from '@/assets/js/mohr/funAux.js';

let canvas;

export function vinculaCanvas(nCanvas, angulo1){
    // Creo el canvas de fabric
    canvas = new fabric.Canvas('cuadrado', {
        width: nCanvas.$el.clientWidth-30,
        height: nCanvas.$el.clientWidth-30,
        selection: false
    });
    dibujaCuadrado(angulo1);
}

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} nCanvas Contenedor del canvas (div)
 */
export function resizeCanvas(nCanvas, angulo1) {
    if(nCanvas == undefined) return;
    canvas.setDimensions({width: nCanvas.$el.clientWidth-30, height: nCanvas.$el.clientWidth-30});
    canvas.remove(...canvas.getObjects());
    dibujaCuadrado(angulo1);
}

///////////////////////////
// Funciones de dibujado //
///////////////////////////

let cuadradoRotado, flecha1, flecha2, flecha3, flecha4;

export function dibujaCuadrado(angulo1){
    // Eje Y
    canvas.add( new fabric.Line([ canvas.width/2, 0, canvas.width/2, canvas.height ], {
        stroke: 'rgba(175,175,175,0.7)',
        strokeWidth: 1,
        selectable : false,
        evented: false
    }));
    canvas.add(new fabric.Text( 'Y', {
        fontSize: 12,
        left: canvas.width/2 +10,
        top: 10,
        fill: 'rgba(175,175,175,0.7)',
        selectable : false,
        evented: false
    }));

    // Eje X
    canvas.add( new fabric.Line([ 0, canvas.height/2, canvas.width, canvas.height/2 ], {
        stroke: 'rgba(175,175,175,0.7)',
        strokeWidth: 1,
        selectable : false,
        evented: false
    }));

    canvas.add(new fabric.Text( 'X', {
        fontSize: 12,
        left: canvas.width -10,
        top: canvas.height/2 -10,
        fill: 'rgba(175,175,175,0.7)',
        selectable : false,
        evented: false
    }));

    canvas.add(new fabric.Rect({
        top: canvas.height/2, 
        left: canvas.width/2, 
        width: canvas.width/3, 
        height: canvas.height/3, 
        fill: 'white',
        stroke: 'rgba(175,175,175,0.7)',
        selectable : false,
        evented: false
    }));
    
    dibujaCuadradoRotado(angulo1);
}

export function dibujaCuadradoRotado(angulo1){
    canvas.remove(cuadradoRotado, flecha1, flecha2, flecha3, flecha4);
    cuadradoRotado = new fabric.Rect({
        top: canvas.height/2, 
        left: canvas.width/2, 
        width: canvas.width/3, 
        height: canvas.height/3, 
        fill: 'rgba(0,0,0,0)',
        stroke: 'red',
        selectable : false,
        evented: false
    });

    dibujaLineas();
    let grupo = new fabric.Group([cuadradoRotado, flecha1, flecha2, flecha3, flecha4]);
    grupo.rotate(angulo1*2);
    canvas.add(...grupo.getObjects());

    addDesc(canvas, flecha1, datos.sA.toFixed(1), (-datos.tA).toFixed(1), datos.sA < 0, (-datos.tA) < 0, 'A');
    addDesc(canvas, flecha2, datos.sA.toFixed(1), (-datos.tA).toFixed(1), datos.sA < 0, (-datos.tA) < 0, 'A');
    addDesc(canvas, flecha3, datos.sAprima.toFixed(1), datos.tA.toFixed(1), datos.sAprima < 0, datos.tA < 0, "A'");
    addDesc(canvas, flecha4, datos.sAprima.toFixed(1), datos.tA.toFixed(1), datos.sAprima < 0, datos.tA < 0, "A'");
}

function dibujaLineas(){
    let ratio1X = Math.abs(datos.sA)/(datos.radio + Math.abs(datos.centro));
    let ratio1Y = Math.abs(datos.tA)/(datos.radio + Math.abs(datos.centro));
    let ratio2X = Math.abs(datos.sAprima)/(datos.radio + Math.abs(datos.centro));
    let l1 = { x: 0, y: 0}, l2 = { x: 0, y: 0}, l3 = { x: 0, y: 0}, l4 = { x: 0, y: 0};

    l1.x = 6.5*canvas.width/9 + 2*canvas.width/9*ratio1X;
    l1.y = -datos.tA <= 0 ? canvas.height/2 + canvas.height/6*ratio1Y : canvas.height/2 - canvas.height/6*ratio1Y;

    l2.x = 2.5*canvas.width/9 - 2*canvas.width/9*ratio1X;
    l2.y = -datos.tA >= 0 ? canvas.height/2 + canvas.height/6*ratio1Y : canvas.height/2 - canvas.height/6*ratio1Y;

    l3.x = datos.sAprima >=0 && datos.tA <= 0 || datos.sAprima <=0 && datos.tA >= 0 ? canvas.width/2 - canvas.width/6*ratio2X : canvas.width/2 + canvas.width/6*ratio2X;
    l3.y = 2.5*canvas.height/9 - 2*canvas.height/9*ratio1Y;

    l4.x = datos.sAprima >=0 && datos.tA <= 0 || datos.sAprima <=0 && datos.tA >= 0 ? canvas.width/2 + canvas.width/6*ratio2X : canvas.width/2 - canvas.width/6*ratio2X;
    l4.y = 6.5*canvas.height/9 + 2*canvas.height/9*ratio1Y;

    let linea1 = new fabric.Line([ 2*canvas.width/3, canvas.height/2, l1.x, l1.y ], {
        stroke: 'red',
        strokeWidth: 3
    });
    
    let linea2 = new fabric.Line([ canvas.width/3, canvas.height/2, l2.x, l2.y ], {
        stroke: 'red',
        strokeWidth: 3
    });
    let linea3 = new fabric.Line([ canvas.width/2, canvas.height/3, l3.x, l3.y ], {
        stroke: '#EDB02A',
        strokeWidth: 3
    });
    let linea4 = new fabric.Line([ canvas.width/2, 2*canvas.height/3, l4.x, l4.y ], {
        stroke: '#EDB02A',
        strokeWidth: 3
    });

    let  x = l1.x > 2*canvas.width/3 ? l1.x - 2*canvas.width/3 : 2*canvas.width/3 - l1.x;
    let  y = l1.y > canvas.height/2 ? l1.y - canvas.height/2 : canvas.height/2 - l1.y;
    let angulo1 = Math.asin( y /Math.sqrt(Math.pow( y, 2) + Math.pow( x, 2)))* 180/Math.PI;
    x = l3.x > canvas.width/2 ? l3.x - canvas.width/2 : canvas.width/2 - l3.x;
    y = l3.y > canvas.height/3 ? l3.y - canvas.height/3 : canvas.height/3 - l3.y;
    let angulo2 = Math.asin( y /Math.sqrt(Math.pow( y, 2) + Math.pow( x, 2)))* 180/Math.PI;

    let triangulo1, triangulo2, triangulo3, triangulo4;
    
    if( datos.sA >= 0)
        triangulo1 = new fabric.Triangle({
            top: l1.y,
            left: l1.x,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: 'red', 
            stroke: 'red', 
            strokeWidth: 3,
            angle: l1.y < canvas.height/2 ? 90-angulo1 : 90 + angulo1
        });
    else
        triangulo1 = new fabric.Triangle({
            originX: 'center',
            originY: 'top',
            top: canvas.height/2,
            left: 2*canvas.width/3,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: 'red', 
            stroke: 'red', 
            strokeWidth: 3,
            angle: l1.y < canvas.height/2 ? 270-angulo1 : 270 + angulo1
        });

    if( datos.sA >= 0)
        triangulo2 = new fabric.Triangle({
            top: l2.y,
            left: l2.x,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: 'red', 
            stroke: 'red', 
            strokeWidth: 3,
            angle: l2.y < canvas.height/2 ? 270+angulo1 : 270-angulo1
        });
    else
        triangulo2 = new fabric.Triangle({
            originX: 'center',
            originY: 'top',
            top: canvas.height/2,
            left: canvas.width/3,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: 'red', 
            stroke: 'red', 
            strokeWidth: 3,
            angle: l2.y < canvas.height/2 ? 90+angulo1 : 90-angulo1
        });

    if( datos.sAprima >= 0)
        triangulo3 = new fabric.Triangle({
            top: l3.y,
            left: l3.x,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: '#EDB02A', 
            stroke: '#EDB02A', 
            strokeWidth: 3,
            angle: l3.x < canvas.width/2 ? 270+angulo2 : 90-angulo2
        });
    else
        triangulo3 = new fabric.Triangle({
            originX: 'center',
            originY: 'top',
            top: canvas.height/3,
            left: canvas.width/2,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: '#EDB02A', 
            stroke: '#EDB02A', 
            strokeWidth: 3,
            angle: l3.x < canvas.width/2 ? 90+angulo2 : 270-angulo2
        });

    if( datos.sAprima >= 0)
        triangulo4 = new fabric.Triangle({
            top: l4.y,
            left: l4.x,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: '#EDB02A', 
            stroke: '#EDB02A', 
            strokeWidth: 3,
            angle: l4.x < canvas.width/2 ? 270-angulo2 : 90+angulo2
        });
    else
        triangulo4 = new fabric.Triangle({
            originX: 'center',
            originY: 'top',
            top: 2*canvas.height/3,
            left: canvas.width/2,
            width: canvas.width < 500 ? 5 : 10, 
            height: canvas.width < 500 ? 5 : 10,
            fill: '#EDB02A', 
            stroke: '#EDB02A', 
            strokeWidth: 3,
            angle: l4.x < canvas.width/2 ? 90-angulo2 : 270+angulo2
        }); 

    flecha1 = new fabric.Group([linea1, triangulo1],{selectable: false, hoverCursor: canvas.defaultCursor});
    flecha2 = new fabric.Group([linea2, triangulo2],{selectable: false, hoverCursor: canvas.defaultCursor});
    flecha3 = new fabric.Group([linea3, triangulo3],{selectable: false, hoverCursor: canvas.defaultCursor});
    flecha4 = new fabric.Group([linea4, triangulo4],{selectable: false, hoverCursor: canvas.defaultCursor});
}