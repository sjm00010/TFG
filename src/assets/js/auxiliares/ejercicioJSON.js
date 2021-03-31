import {Ejercicio, Viga, Mohr} from '@/assets/js/auxiliares/ejercicio.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';

export let ejercicio = new Ejercicio();
export let ejViga = new Viga();
export let ejMohr = new Mohr();
export function limpiar(){
    ejercicio = new Ejercicio();
    ejViga = new Viga();
    ejMohr = new Mohr();
}

export async function cargaEjercicio(id, tipo){

    let url = '';

    switch(tipo){
        case 'Vigas':
        case 'viga':
            url = URL+'/ejercicio/viga/'+id;
            break;
        case 'Mohr':
        case 'mohr':
            url = URL+'/ejercicio/mohr/'+id;
            break;
    }

    if(url != ''){
        const ej = await fetch(url, { 
            headers: {'Content-Type': 'application/json'},
            method: 'GET'
        });

        if(ej.ok){
            switch(tipo){
                case 'Vigas':
                case 'viga':
                    ejViga = await ej.json();
                    cargaDatos(ejViga);
                    break;
                case 'Mohr':
                case 'mohr':
                    ejMohr = await ej.json();
                    cargaDatos(ejMohr);
                    break;
            }
            return true;
        }else {
            return false;
        }
    }else{
        return false;
    }  
}

function cargaDatos(datos){
    ejercicio.enunciado = datos.enunciado;
    ejercicio.video = datos.video;
    ejercicio.ayuda = datos.ayuda;
}