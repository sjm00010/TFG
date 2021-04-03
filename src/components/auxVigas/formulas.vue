<template>
<div>
    <h4 class="text-center"><small class="text-muted">FÓRMULAS DE LAS LEYES</small></h4>
    <hr/>
    Para usar las variables anteriormente introducidas se debe introducir:
    <ul>
        <li><b>Tramos</b>: para referenciar el valor de un tramo se debe usar <i>L_N</i>, siendo <i>N</i> el número del tramo.</li>
        <li><b>Variables</b>: para referenciar el valor de un elemento del dibujo se debe usar el ID de la tabla (#), <br/> por ejemplo <i>P_1</i>, copiando el ID con el subíndice de la forma <i>X_N</i>.</li>
        <li><b>Variables auxiliares</b>: para referenciar el valor de una variables auxilar se debe usar <i>A_N</i>, siendo <i>N</i> el número de la variable auxiliar.</li>
    </ul>
    <small class="text-muted"><mdb-icon icon="info-circle" /> Para acceder a la distancia de las barras usar <i>d_X</i>, siendo <i>X</i> el nº de la barra.</small>
    <hr/>
    <h5 class="text-center"><small class="text-muted">VARIABLES AUXILIARES</small></h5>
    <mdb-card-text class="text-center">Introduce las fórmulas para las variables que necesites.</mdb-card-text>
    <mdb-btn block outline="success" @click="addAuxiliar"><mdb-icon size="lg" icon="plus-circle"/> Añadir variable</mdb-btn>
    <mdb-row class="my-3">
        <mdb-col md="12">
            <div class="md-form input-group" v-for="(aux, i) in auxiliares" :key="i">
                <div class="w-100">
                    <mdb-input class="mt-0 mb-3" type="text" placeholder="Fórmula auxiliar" v-model="auxiliares[i]" ariaDescribedBy="aux">
                        <mdb-btn outline="white" class="z-depth-0 px-0 py-0" group slot="prepend" flat size="lg" @click="delAuxiliar(i)"><mdb-icon color="red" size="lg" icon="minus-circle"/></mdb-btn>
                        <span class="input-group-text md-addon" slot="prepend"><b>A<sub>{{i+1}}</sub></b></span>
                    </mdb-input>
                </div>
                <div class="overflow-auto">
                    <katex-element :expression="'A_{'+(i+1)+'}='+aux" :throwOnError="false" :display-mode="true"/>
                </div>
            </div>
        </mdb-col>
    </mdb-row>
    <h5 class="text-center"><small class="text-muted">FUNCIONES DE LOS TRAMOS</small></h5>
    <mdb-card-text class="text-center">Introduce las fórmulas (EN LATEX) para realizar el cálculo de las gráficas. Si se quiere unir dos puntos con una recta se debe dar la ecuación en función de <i>x</i>.</mdb-card-text>
    <mdb-row>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Esfuerzos axiles</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <mdb-input class="mt-0 mb-3" type="text" placeholder="Fórmula del tramo" v-model="formula.axiles">
                    <span class="input-group-text md-addon" slot="prepend"><b>Tramo {{i+1}}</b></span>
                </mdb-input>
                <div class="container overflow-auto">
                    <katex-element :expression="formula.axiles" :throwOnError="false" :display-mode="true"/>
                </div>                
            </div>
        </mdb-col>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Esfuerzos cortantes</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <mdb-input class="mt-0 mb-3" type="text" placeholder="Fórmula del tramo" v-model="formula.cortantes">
                    <span class="input-group-text md-addon" slot="prepend"><b>Tramo {{i+1}}</b></span>
                </mdb-input>
                <div class="container overflow-auto">
                    <katex-element :expression="formula.cortantes" :throwOnError="false" :display-mode="true"/>
                </div>
            </div>
        </mdb-col>
        <mdb-col md="12">
            <mdb-card-text class="text-center">Momentos flectores</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <mdb-input class="mt-0 mb-3" type="text" placeholder="Fórmula del tramo" v-model="formula.flectores">
                    <span class="input-group-text md-addon" slot="prepend"><b>Tramo {{i+1}}</b></span>
                </mdb-input>
                <div class="container overflow-auto">
                    <katex-element :expression="formula.flectores" :throwOnError="false" :display-mode="true" :max-expand="10"/>
                </div>
            </div>
        </mdb-col>
    </mdb-row>
    
    <hr/>
    <h4 class="text-center"><small class="text-muted">DEFORMADA</small></h4>
    <hr/>
    <mdb-card-text class="text-center">Momento de inercia y Módulo de inercia</mdb-card-text>
    <mdb-row>
        <mdb-col md="6">
            <mdb-input class="mb-2 mt-0" v-model="E" placeholder="Valor por defecto">
                <span class="input-group-text md-addon" slot="prepend"><i>E = </i></span>
                <span class="input-group-text md-addon" slot="append">· 10<sup>7</sup> kN/m<sup>2</sup></span>
            </mdb-input>
        </mdb-col>
        <mdb-col md="6">
            <mdb-input class="mb-2 mt-0" v-model="I" placeholder="Valor por defecto">
                <span class="input-group-text md-addon" slot="prepend"><i>I = </i></span>
                <span class="input-group-text md-addon" slot="append">· 10<sup>-8</sup> m<sup>4</sup></span>
            </mdb-input>
        </mdb-col>
    </mdb-row>
    
    <mdb-row class="my-3">
        <mdb-col md="12">
            <mdb-card-text class="text-center">Formulas de la deformada</mdb-card-text>
            <div class="md-form input-group" v-for="(formula, i) in formulas" :key="i">
                <mdb-input class="mt-0 mb-3" type="text" placeholder="Fórmula del tramo" v-model="formula.deformada">
                    <span class="input-group-text md-addon" slot="prepend"><b>Tramo {{i+1}}</b></span>
                </mdb-input>
                <div class="container overflow-auto">
                    <katex-element :expression="formula.deformada" :throwOnError="false" :display-mode="true" :max-expand="10"/>
                </div>
            </div>
        </mdb-col>
    </mdb-row>
</div>
</template>

<script>
import 'katex/dist/katex.min.css';
import { mdbCardText, mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon} from 'mdbvue';
import { ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
export default {
    name: 'formulas',
    components:{
        mdbCardText, mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon
    },
    data(){
        return {
            formulas: ejViga.formulas,
            auxiliares: ejViga.auxiliares,
            E: ejViga.E,
            I: ejViga.I
        };
    },
    methods:{
        cargaTramos(tramos){
            this.auxiliares.splice(0);
            this.formulas.splice(0);
            for (let i = 0; i < tramos.length; i++) {
                this.formulas.push({axiles: '', cortantes: '', flectores: '', deformada: ''});
            }
        },
        addAuxiliar(){
            if(this.auxiliares.length < 10)
                this.auxiliares.push('');
        },
        delAuxiliar(pos){
            this.auxiliares.splice(pos, 1);
        },
        verificar(){
            let listo = true;
            for (let i = 0; i < this.formulas.length; i++) {
                if(this.formulas[i].axiles.length === 0 ||
                    this.formulas[i].cortantes.length === 0 || 
                    this.formulas[i].flectores.length === 0)
                    listo = false;
                if(this.E || this.I)
                    if(this.formulas[i].deformada.length === 0)
                        listo = false;
            }
            return listo;
        }
    }

}
</script>