<template>
    <mdb-container class="mt-4">
        <h1 class="text-muted text-center mb-4">Listado de ejercicios</h1>
        <div v-show="prof">
            <hr/>
            <mdb-btn block color="success">Crear ejercicio</mdb-btn>
        </div>
        <hr/>        
        <tipo class="mb-3" titulo="Cálculo de apoyo en vigas" color="aqua-gradient"></tipo>
        <mdb-row v-if="this.ejVigas.length > 0">
            <mdb-col col="md" v-for="(ej, i) in ejVigas" :key="i">
                <tarjeta :id="ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.desc" enlace="/ejercicios/ejercicioViga" @borrar="borrar"></tarjeta>
            </mdb-col>
        </mdb-row>
        <div class="text-center my-5" v-else-if="this.ejVigas.length == 0">
            <h2>No existen ejercicios de cálculo de apoyo en vigas</h2>
        </div>
    </mdb-container>
</template>

<script>
import tarjeta from '@/components/TarjetaEjercicio';
import tipo from '@/components/TipoEjercicios';
import {mdbContainer, mdbRow, mdbCol, mdbBtn} from 'mdbvue';

import {cargaEjVigas, borrarEjViga} from '@/assets/js/ejercicio.js';
import {profesor, getUser} from '@/assets/js/identificacion.js';

export default {
    components: {
        mdbContainer, mdbRow, mdbCol, mdbBtn,
        tarjeta,
        tipo
    },
    data(){
        return{
            prof: false,
            ejVigas: [],
            ejMatrices: []
        }
    },
    methods:{
        borrar(id){
            this.ejVigas = borrarEjViga(id);
        }
    },
    created(){
        getUser();
        this.prof = profesor;

        // Pruebas de carga de ejercicios
        this.ejVigas = cargaEjVigas();
    }
}
</script>