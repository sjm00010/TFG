<template>
<div>
    <h4 class="text-center"><small class="text-muted">FORMULAS DE LAS LEYES</small></h4>
    <hr/>
    Para usar las variables anteriormente introducidas se debe introducir:
    <ul>
        <li><b>Tramos</b>: para referenciar el valor de un tramo se debe usar <i>t_N</i>, siendo <i>N</i> el numero del tramo.</li>
        <li><b>Variables</b>: para referenciar el valor de un elemento del dibujo se debe usar el ID de la tabla (#), <br/> por ejemplo <i>P_1</i>, copiando el ID con el subindice de la forma <i>X_N</i>.</li>
        <li><b>Variables auxiliares</b>: para referenciar el valor de una varables auxilar se debe usar <i>A_N</i>, siendo <i>N</i> el numero de la variable auxiliar.</li>
    </ul>
    <small class="text-muted"><mdb-icon icon="info-circle" /> Para acceder a la distancia de las barras usar <i>d_X</i>, siendo <i>X</i> el nº de la barra.</small>
    <hr/>
    <h5 class="text-center"><small class="text-muted">VARIABLES AUXILIARES</small></h5>
    <mdb-card-text class="text-center">Introduce las formulas para las variables que necesites.</mdb-card-text>
    <mdb-btn block outline="success" @click="addAuxiliar"><mdb-icon size="lg" icon="plus-circle"/> Añadir variable</mdb-btn>
    <mdb-row class="my-3">
        <mdb-col md="12">
            <div class="md-form input-group" v-for="(aux, i) in auxiliares" :key="i">
                <div class="input-group-prepend">
                    <mdb-btn outline="white" class="z-depth-0 px-0 py-0" flat size="lg" @click="delAuxiliar(i)"><mdb-icon color="red" size="lg" icon="minus-circle"/></mdb-btn>
                    <span class="input-group-text md-addon"><b>A<sub>{{i+1}}</sub></b></span>
                </div>
                <mdb-input type="text" label="Formula del tramo" v-model="auxiliares[i]"/>
                <katex-element :expression="'A_{'+(i+1)+'}='+aux" :throwOnError="false" :display-mode="true"/>
            </div>
        </mdb-col>
    </mdb-row>
    <h5 class="text-center"><small class="text-muted">FUNCIONES DE LOS TRAMOS</small></h5>
    <mdb-card-text class="text-center">Introduce las formulas (EN LATEX) para realizar el cálculo de las gráficas.</mdb-card-text>
    <mdb-row>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Esfuerzos de axiles</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <div class="input-group-prepend">
                    <span class="input-group-text md-addon"><b>Tramo {{i+1}}</b></span>
                </div>
                <mdb-input type="text" label="Formula del tramo" v-model="formula.axiles"/>
                <katex-element :expression="formula.axiles" :throwOnError="false" :display-mode="true"/>
            </div>
        </mdb-col>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Esfuerzos de cortantes</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <div class="input-group-prepend">
                    <span class="input-group-text md-addon"><b>Tramo {{i+1}}</b></span>
                </div>
                <mdb-input type="text" label="Formula del tramo" v-model="formula.cortantes"/>
                <katex-element :expression="formula.cortantes" :throwOnError="false" :display-mode="true"/>
            </div>
        </mdb-col>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Momentos flectores</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <div class="input-group-prepend">
                    <span class="input-group-text md-addon"><b>Tramo {{i+1}}</b></span>
                </div>
                <mdb-input type="text" label="Formula del tramo" v-model="formula.flectores"/>
                <katex-element :expression="formula.flectores" :throwOnError="false" :display-mode="true"/>
            </div>
        </mdb-col>
    </mdb-row>
</div>
</template>

<script>
import 'katex/dist/katex.min.css';
import { mdbCardText, mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon} from 'mdbvue';
import { ejViga } from '@/assets/js/ejercicioJSON.js';
export default {
    name: 'formulas',
    components:{
        mdbCardText, mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon
    },
    data(){
        return {
            formulas: ejViga.formulas,
            auxiliares: ejViga.auxiliares
        };
    },
    methods:{
        cargaTramos(tramos){
            this.auxiliares.splice(0);
            this.formulas.splice(0);
            for (let i = 0; i < tramos.length; i++) {
                this.formulas.push({axiles: '', cortantes: '', flectores: ''});
            }
        },
        addAuxiliar(){
            if(this.auxiliares.length < 10)
                this.auxiliares.push('');
        },
        delAuxiliar(pos){
            this.auxiliares.splice(pos, 1);
        }
    }

}
</script>