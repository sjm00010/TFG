<template>
<div>
    <mdb-card>
        <mdb-card-body>
            <mdb-card-title>Datos del ejercicio</mdb-card-title>
            <mdb-card-text>Introduce los datos requeridos. Cuando los hayas introducido verificalos para continuar, si todos los datos han sido verificados se habilitaró la opción de crear ejercicio.</mdb-card-text>
            <h4 class="text-center"><small class="text-muted">ENUNCIADO</small></h4>
            <enunciado/>
            <h4 class="text-center mt-3"><small class="text-muted">DATOS DE LOS TRAMOS</small></h4>
            <mdb-row>
                <mdb-col md="12">
                    <mdb-input type="number" label="Número de tramos" :min="0" :step="1" v-model="numTramos" @change="crearTramos"/>
                </mdb-col>
                <mdb-col md="12">
                    <mdb-card-text v-show="tramos.length > 0" class="text-center">Introduce el mínimo, el maximo y un valor por defecto para cada tramo.</mdb-card-text>
                    <div class="md-form input-group" v-for="(tramo, i) in tramos" :key="i">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon"><b>Tramo {{i+1}}</b></span>
                        </div>
                        <input :ref="'min'+(i+1)" type="number" min="0.1" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="tramo.min">
                        <input :ref="'max'+(i+1)" type="number" min="0.2" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="tramo.max">
                        <input :ref="'valor'+(i+1)" type="number" min="0.1" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="tramo.valor">
                    </div>
                </mdb-col>
            </mdb-row>
            <dibujar ref="dibujo" v-show="compTramos"/>
        </mdb-card-body>
    </mdb-card>
    <mdb-btn class="my-3" block color="light-green" @click="comprobar"><mdb-icon size="lg" icon="check"/> Verificar</mdb-btn>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon,
         } from 'mdbvue';
import enunciado from '@/components/editor/enunciado';
import dibujar from '@/components/editor/dibujaViga';
import { vincularTramos } from '@/assets/js/vigas/variables.js';
import { compruebaTramos, Ejercicio } from '@/assets/js/ejercicio.js';
export default {
    name: 'formularioViga',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon, 
       enunciado,
       dibujar,
    },
    data(){
        return{
            ejercicio: Ejercicio,
            numTramos: undefined,
            tramos: [],
            compTramos: false,
        }
    },
    methods:{
        crearTramos(){
            this.tramos.splice(0);
            for (let i = 0; i < this.numTramos; i++) {
                this.tramos.push({min: '', max: '', valor: ''});
            }
        },
        comprobarTramos(){
            if(this.tramos.length == 0){
                this.compTramos = false;
                this.$notify({
                    group: 'app',
                    title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Número de tramos invalido</b>',
                    text: '<i style="font-size:15px; text-align: center;"> Se debe introducir al menos 1 tramo para la viga.</i>',
                    duration: 7000,
                    type: 'warn'
                });
            }else{
                let error = compruebaTramos(this.tramos);
                for (const [campo, value] of Object.entries(this.$refs)) {
                    if(error.includes(campo)){
                        value[0].classList.remove('valid');
                        value[0].classList.add('invalid');
                    }else if(value[0]){
                        value[0].classList.remove('invalid');
                        value[0].classList.add('valid');
                    }
                }
                if(error.length != 0){
                    this.compTramos = false;
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error en los tramos</b>',
                        text: '<i style="font-size:15px"> Revisa el mínimo, el máximo y el valor por defecto de los tramos marcados en rojo.</i>',
                        duration: 7000,
                        type: 'error'
                    });
                }else{
                    this.compTramos = true;
                    setTimeout(() => { this.$refs.dibujo.actualiza(); }, 300);
                    vincularTramos(this.tramos);
                }
            }
        },
        comprobar(){
            this.comprobarTramos();
        }
    }
}
</script>

<style>
  .placement {
    position: fixed;
    right: 1rem;
    top: 1rem;
  }
</style>