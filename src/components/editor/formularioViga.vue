<template>
    <mdb-card>
        <mdb-card-body>
            <mdb-card-title>Datos del ejercicio</mdb-card-title>
            <mdb-card-text>Introduce los datos requeridos.</mdb-card-text>
            <hr/>
            <h4 class="text-center"><small class="text-muted">DATOS DE LOS TRAMOS DE LA FIGURA</small></h4>
            <mdb-row>
                <mdb-col md="12">
                    <mdb-input type="number" label="Número de tramos" :min="0" :step="1" v-model="numTramos" @change="crearTramos"/>
                </mdb-col>
                <mdb-col md="12">
                    <section class="preview" v-for="(tramo, i) in tramos" :key="i">
                        <mdb-input type="number" :min="undefined" :step="0.1" aria-label="Mínimo" class="my-0" placeholder="Mínimo" v-model="tramo.min">
                        <span class="input-group-text md-addon" slot="prepend">Tramo {{i+1}}</span>
                        <mdb-input type="number" :min="undefined" :step="0.1" noWrapper aria-label="Máximo" placeholder="Máximo" v-model="tramo.max"/>
                        </mdb-input>
                    </section>
                </mdb-col>
            </mdb-row>
            <hr/>
            <dibujar/>
        </mdb-card-body>
    </mdb-card>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbInput, mdbRow, mdbCol } from 'mdbvue';
import dibujar from '@/components/editor/dibujaViga';
// import { compruebaTramos } from '@/assets/js/ejercicio.js';
export default {
    name: 'formularioViga',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbRow, mdbCol,
       dibujar
    },
    data(){
        return{
            numTramos: undefined,
            tramos: []
        }
    },
    methods:{
        crearTramos(){
            this.tramos.splice(0);
            for (let i = 0; i < this.numTramos; i++) {
                this.tramos.push({min: undefined, max: undefined});
            }
        },
    }
}
</script>