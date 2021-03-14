<template>
<div>
    <mdb-card>
        <mdb-card-body>
            <mdb-card-title>Datos del ejercicio</mdb-card-title>
            <mdb-card-text>Introduce los datos requeridos. Cuando los hayas introducido verificalos para continuar, si todos los datos han sido verificados se habilitará la opción de crear ejercicio.</mdb-card-text>
            <h4 class="text-center"><small class="text-muted">DIFICUALTAD</small></h4>
            <mdb-card-text class="text-center">Seleccione una dificultad:</mdb-card-text>
            <select class="browser-default custom-select" v-model="dificultad">
                <option selected value="undefined">Selecciona una dificultad</option>
                <option :value="1">Fácil</option>
                <option :value="2">Normal</option>
                <option :value="3">Difícil</option>
            </select>
            <h4 class="text-center"><small class="text-muted">ENUNCIADO</small></h4>
            <enunciado/>
            <h4 class="text-center mt-3"><small class="text-muted">DATOS</small></h4>
            <mdb-card-text>Seleccione los datos que se van a introducir:</mdb-card-text>
            <select class="browser-default custom-select" v-model="tipo">
                <option :value="1">Tipo 1 (&sigma;x, &sigma;y, &tau;xy, &beta;)</option>
                <option :value="2">Tipo 2 (&sigma;1, &sigma;2, &alpha;)</option>
            </select>

            <mdbRow class="my-3" v-if="tipo == 1">
                <mdbCol col="md">
                    <mdb-input placeholder="en MPa" type="number" :step="1" class="mb-3" v-model="datos.sx">
                        <span class="input-group-text md-addon" slot="prepend">&sigma;<sub>x</sub></span>
                    </mdb-input>
                </mdbCol>
                <mdbCol col="md">
                    <mdb-input placeholder="en MPa" type="number" :step="1" class="mb-3" v-model="datos.sy">
                        <span class="input-group-text md-addon" slot="prepend">&sigma;<sub>y</sub></span>
                    </mdb-input>
                </mdbCol>
                <mdbCol col="md">
                    <mdb-input placeholder="en MPa" type="number" :step="1" class="mb-3" v-model="datos.txy">
                        <span class="input-group-text md-addon" slot="prepend">&tau;<sub>xy</sub></span>
                    </mdb-input>
                </mdbCol>
                <mdbCol col="md">
                    <mdb-input placeholder="en grados(º)" type="number" :min="0"  :max="180" :step="1" class="mb-3" v-model="datos.B">
                        <span class="input-group-text md-addon" slot="prepend">&beta;</span>
                    </mdb-input>
                </mdbCol>
            </mdbRow>

            <mdbRow class="my-3" v-if="tipo == 2">
                <mdbCol col="md">
                    <mdb-input placeholder="en MPa" type="number" :step="1" class="mb-3">
                        <span class="input-group-text md-addon" slot="prepend">&sigma;<sub>1</sub></span>
                    </mdb-input>
                </mdbCol>
                <mdbCol col="md">
                    <mdb-input placeholder="en MPa" type="number" :step="1" class="mb-3">
                        <span class="input-group-text md-addon" slot="prepend">&sigma;<sub>2</sub></span>
                    </mdb-input>
                </mdbCol>
                <mdbCol col="md">
                    <mdb-input placeholder="en grados(º)" type="number" :min="0" :max="180" :step="1" class="mb-3">
                        <span class="input-group-text md-addon" slot="prepend">&alpha;</span>
                    </mdb-input>
                </mdbCol>
            </mdbRow>

            <mdbRow class="my-3">
                <mdbCol col="md">
                    <mdb-btn v-if="!dibujar" class="my-3" block color="secondary" @click="actualizaDatos"><mdb-icon size="lg" icon="pencil-alt"/> Dibujar</mdb-btn>
                    <mdb-btn v-if="dibujar" class="my-3" block color="secondary" @click="actualizaDatos"><mdb-icon size="lg" icon="edit"/> Actualizar dibujo</mdb-btn>
                </mdbCol>
                <mdbCol col="md" v-if="dibujar">
                    <mdb-btn class="my-3" block color="blue-grey" @click="dibujar = false"><mdb-icon size="lg" icon="eye-slash"/> Ocultar</mdb-btn>
                </mdbCol>
            </mdbRow>
            
            <dibujos v-if="dibujar" :datos="this.datos"/>
        </mdb-card-body>
    </mdb-card>
    <mdb-btn v-if="!modificando" class="my-3" block color="default" @click="crear"><mdb-icon size="lg" icon="plus"/> Crear</mdb-btn>
    <mdb-btn v-if="modificando" class="my-3" block color="unique" @click="modificar"><mdb-icon size="lg" icon="sync-alt"/> Modificar</mdb-btn>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbBtn, mdbIcon, mdbInput, mdbRow, mdbCol
         } from 'mdbvue';
import enunciado from '@/components/editor/enunciado';
import dibujos from '@/components/visualizar/circulosMohr/dibujos';
import { ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
import * as cal from '@/assets/js/mohr/calculos.js';
import * as dib from '@/assets/js/mohr/dibujarCirculo.js';
import * as cua from '@/assets/js/mohr/dibujarCuadrado.js';
// import {URL} from '@/assets/js/auxiliares/api.config.js';
export default {
    name: 'formularioViga',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbBtn, mdbIcon, mdbInput, mdbRow, mdbCol,
       enunciado, dibujos
    },
    props:{
        modificando: Boolean
    },
    data(){
        return{
            dificultad: ejViga.dificultad,
            tipo: 1,
            datos: { sx: undefined , sy: undefined, txy: undefined, B: undefined,
                     s1: undefined, s2: undefined, a: undefined},
            dibujar: false
        }
    },
    methods:{
        verificar(){
            console.log(this.datos);
        },
        crear(){
            this.verificar();
        },
        modificar(){

        },
        toNumber(){
            if(this.tipo === 1){
                this.datos.sx = parseFloat(this.datos.sx);
                this.datos.sy = parseFloat(this.datos.sy);
                this.datos.txy = parseFloat(this.datos.txy);
                this.datos.B = parseFloat(this.datos.B);
                this.datos.s1 = undefined;
                this.datos.s2 = undefined;
                this.datos.a = undefined;
            }else{
                this.datos.s1 = parseFloat(this.datos.s1);
                this.datos.s2 = parseFloat(this.datos.s2);
                this.datos.a = parseFloat(this.datos.a);
                this.datos.sx = undefined;
                this.datos.sy = undefined;
                this.datos.txy = undefined;
                this.datos.B = undefined;
            }
        },
        actualizaDatos(){
            this.dibujar = false;
            this.toNumber();
            cal.actualizaDatos(this.datos);
            cal.calcular();
            this.resultado = cal;
            this.formula = cal.calculaTensor();
            this.dibujar = true;
            dib.calculaPlano();
            cua.dibujaCuadradoRotado(this.datos.B);
        },
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