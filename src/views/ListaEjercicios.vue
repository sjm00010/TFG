<template>
    <mdb-container class="mt-4">
        <h1 class="text-muted text-center mb-4">Listado de ejercicios</h1>
        <div v-show="prof">
            <hr/>
            <router-link tag="button" class="btn btn-block success-color text-white" :to="{ path: 'nuevo' }" append>Crear ejercicio</router-link>
        </div>
        <mdb-btn block color="info" @click="cargarEjercicios">Recargar ejercicios</mdb-btn>
        <hr/>        
        <tipo class="mb-3" titulo="Cálculo de apoyo en vigas" color="aqua-gradient"></tipo>
        <mdb-row v-if="this.ejVigas.length > 0">
            <mdb-col col="md" v-for="(ej, i) in ejVigas" :key="ej.id">
                <tarjeta :id="i+1" :id_bd="ej.id" :dificultad="ej.dificultad"
                    :descripcion="ej.desc" enlace="viga" @borrar="borrar"></tarjeta>
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

import {vigas, cargaEjVigas, borrarEjViga} from '@/assets/js/ejercicio.js';
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
            if(confirm("¿Esta seguro de eliminar el ejercicio"+ id +"?"))
                if (!borrarEjViga(id))
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al borrar el ejercicio</b>',
                        text: '<i style="font-size:15px"> Ocurrio un error al tratar de borrar el ejercicio, intentelo de nuevo.</i>',
                        duration: 7000,
                        type: 'error'
                    });
        },
        async cargarEjercicios(){
            await cargaEjVigas();
        }
    },
    created(){
        getUser();
        this.prof = profesor;

        // Pruebas de carga de ejercicios
        this.ejVigas = vigas;
    }
}
</script>