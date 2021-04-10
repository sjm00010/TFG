<template>
    <mdb-container class="mt-4">
        <h1 class="text-muted text-center mb-4">Listado de ejercicios</h1>
        <div v-show="prof">
            <hr/>
            <router-link tag="button" class="btn btn-block success-color text-white" :to="{ path: 'nuevo' }" append><i class="fas fa-plus mr-1"></i>Crear ejercicio</router-link>
        </div>
        <mdb-btn block color="blue-grey" @click="cargarEjercicios"><mdb-icon icon="redo-alt" class="mr-1"/>Recargar ejercicios</mdb-btn>
        <hr/>        
        <tipo class="my-3" titulo="Diagramas de esfuerzos en vigas" color="aqua-gradient"></tipo>
        <mdb-row v-if="this.ejVigas.length > 0">
            <mdb-col col="md" v-for="(ej, i) in ejVigas" :key="ej.id">
                <tarjeta :id="i+1" :id_bd="ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.enunciado" enlace="viga" @borrar="borrar"></tarjeta>
            </mdb-col>
        </mdb-row>
        <div class="text-center my-5" v-else-if="this.ejVigas.length == 0">
            <h2>No existen ejercicios de diagramas de esfuerzos en vigas</h2>
        </div>

        <tipo class="my-3" titulo="Matrices" color="peach-gradient"></tipo>
        <mdb-row v-if="this.ejMatrices.length > 0">
            <mdb-col col="md" v-for="(ej, i) in ejMatrices" :key="ej.id">
                <tarjeta :id="i+1" :id_bd="ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.enunciado" enlace="matriz" @borrar="borrar"></tarjeta>
            </mdb-col>
        </mdb-row>
        <div class="text-center my-5" v-else-if="this.ejMatrices.length == 0">
            <h2>No existen ejercicios de matrices</h2>
        </div>

        <tipo class="my-3" titulo="Círculos de Mohr" color="purple-gradient"></tipo>
        <mdb-row v-if="this.ejMohr.length > 0">
            <mdb-col col="md" v-for="(ej, i) in ejMohr" :key="ej.id">
                <tarjeta :id="i+1" :id_bd="ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.enunciado" enlace="mohr" @borrar="borrar"></tarjeta>
            </mdb-col>
        </mdb-row>
        <div class="text-center my-5" v-else-if="this.ejMohr.length == 0">
            <h2>No existen ejercicios de círculos de Mohr</h2>
        </div>
    </mdb-container>
</template>

<script>
import tarjeta from '@/components/listado/TarjetaEjercicio';
import tipo from '@/components/listado/TipoEjercicios';
import {mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon} from 'mdbvue';

import {vigas, matriz, mohr, cargarEjercicios, borrarEjercicio} from '@/assets/js/auxiliares/ejercicio.js';
import {profesor, getUser} from '@/assets/js/login/identificacion.js';

export default {
    components: {
        mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon,
        tarjeta,
        tipo
    },
    data(){
        return{
            prof: false,
            ejVigas: vigas || [],
            ejMohr: mohr || [],
            ejMatrices: matriz || []
        }
    },
    methods:{
        borrar(num, id, tipo){
            if(confirm("¿Esta seguro de eliminar el ejercicio "+ num +"?"))
                if (!borrarEjercicio(id, tipo)) this.error();    
        },
        error(){
            this.$notify({
                group: 'app',
                title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al borrar el ejercicio</b>',
                text: '<i style="font-size:15px"> Ocurrió un error al tratar de borrar el ejercicio, inténtelo de nuevo.</i>',
                duration: 7000,
                type: 'error'
            });
        },
        async cargarEjercicios(){
            if(!await cargarEjercicios()){
                this.$notify({
                    group: 'app',
                    title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al cargar los ejercicios</b>',
                    text: '<i style="font-size:15px"> Ocurrió un error al tratar de cargar los ejercicios, recargue la página.</i>',
                    duration: 7000,
                    type: 'error'
                });
                this.$route.push('/');
            }
        }
    },
    created(){
        getUser();
        this.prof = profesor;
    },
    beforeMount(){
        this.cargarEjercicios();
    }
}
</script>