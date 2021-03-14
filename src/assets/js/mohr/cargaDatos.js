import {Mohr} from '@/assets/js/auxiliares/ejercicio.js';

export function cargaDatos(){
    let datos = new Mohr('1', 2, 'Prueba', '', '');
    // datos.sx = -28;
    datos.sy = 27;
    datos.txy = -22;
    datos.s1 = 34.72;
    datos.s2 = -35.72;
    datos.a = 70.67;
    datos.B = 71;
    datos.E = 210000;
    datos.v = 0.3;

    return datos;
}