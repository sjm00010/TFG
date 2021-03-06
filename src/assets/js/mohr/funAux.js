import {Mohr} from '@/assets/js/auxiliares/ejercicio.js';

export function cargaDatos(){
    let datos = new Mohr('1', 2, 'Prueba', '', '');
    datos.sx = 16;
    datos.sy = 44;
    datos.txy = -40;
    datos.B = 80;
    datos.E = 210000;
    datos.v = 0.3;

    return datos;
}