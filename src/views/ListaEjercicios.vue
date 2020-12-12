<template>
    <mdb-container class="mt-4">
        <h1 class="text-muted text-center mb-4">Listado de ejercicios</h1>
        <hr/>        
        <tipo class="mb-3" titulo="Cálculo de apoyo en vigas" color="aqua-gradient"></tipo>
        <mdb-row>
            <mdb-col col="md" v-for="(ej, i) in ejVigas" :key="i">
                <tarjeta :titulo="'Ejercio' + ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.desc" :enlace="'/ejercicios/ej'+ ej.id"></tarjeta>
            </mdb-col>
        </mdb-row>
    </mdb-container>
</template>

<script>
import tarjeta from '@/components/TarjetaEjercicio';
import tipo from '@/components/TipoEjercicios';
import {mdbContainer, mdbRow, mdbCol} from 'mdbvue';

import {Ejercicio} from '@/assets/js/ejercicio.js';
export default {
    components: {
        mdbContainer, mdbRow, mdbCol,
        tarjeta,
        tipo
    },
    data(){
        return{
            ejVigas: []
        }
    },
    created(){
        this.ejVigas.push(new Ejercicio(1,'Prueba 1'));
        this.ejVigas.push(new Ejercicio(3,'Prueba 2'));
    }
}
</script>