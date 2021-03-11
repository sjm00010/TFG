import {Mohr} from '@/assets/js/auxiliares/ejercicio.js';

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