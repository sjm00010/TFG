import { fabric } from 'fabric';
// import * as datos from '@/assets/js/mohr/calculos.js';

let canvas;

export function vinculaCanvas(nCanvas, angulo){
    // Creo el canvas de fabric
    canvas = new fabric.Canvas('cuadrado', {
        width: nCanvas.$el.clientWidth-30,
        height: nCanvas.$el.clientWidth-30,
        selection: false
    });
    dibujaCuadrado(angulo);
}

/**
 * Función que escala el canvas a partir del tamaño de la ventana
 * @param {*} nCanvas Contenedor del canvas (div)
 */
export function resizeCanvas(nCanvas, angulo) {
    if(nCanvas == undefined) return;
    canvas.setDimensions({width: nCanvas.$el.clientWidth-30, height: nCanvas.$el.clientWidth-30});
    canvas.remove(...canvas.getObjects());
    dibujaCuadrado(angulo);
}

export function dibujaCuadrado(angulo){
    canvas.remove(...canvas.getObjects());
    canvas.add(new fabric.Rect({
        top: canvas.height/2, 
        left: canvas.width/2, 
        width: canvas.width/3, 
        height: canvas.height/3, 
        fill: 'white',
        stroke: 'black',
        selectable : false,
        evented: false
    }));
    
    canvas.getObjects()[canvas.getObjects().length - 1].rotate(angulo*2)

}