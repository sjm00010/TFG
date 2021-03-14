import {Ejercicio, Viga} from '@/assets/js/auxiliares/ejercicio.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';

export let ejercicio = new Ejercicio();
export let ejViga = new Viga();
export function limpiar(){
    ejercicio = new Ejercicio();
    ejViga = new Viga();
}

export async function cargaEjercicio(id, tipo){

    let url = '';

    switch(tipo){
        case 'Vigas':
        case 'viga':
            url = URL+'/ejViga/'+id;
            break;
    }

    if(url != ''){
        const ejercicio = await fetch(url, { 
            headers: {'Content-Type': 'application/json'},
            method: 'GET'
        });

        if(ejercicio.ok){
            ejViga = await ejercicio.json();
            return true;
        }else {
            return false;
        }
    }else{
        return false;
    }
    
    
}