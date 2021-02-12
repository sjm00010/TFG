<template>
<div>
    <h4 class="text-center"><small class="text-muted">FORMULAS DE LAS LEYES</small></h4>
    <mdb-card-text class="text-center">Introduce las formulas (EN LATEX) para realizar el calculo de las gráficas. EJEMPLO \frac{a_i}{1+x}</mdb-card-text>
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
import { mdbCardText, mdbInput, mdbRow, mdbCol} from 'mdbvue';
import { ejViga } from '@/assets/js/ejercicioJSON.js';
export default {
    name: 'formulas',
    components:{
        mdbCardText, mdbInput, mdbRow, mdbCol
    },
    data(){
        return {
            formulas: ejViga.formulas
        };
    },
    methods:{
        cargaTramos(tramos){
            this.formulas.splice(0);
            for (let i = 0; i < tramos.length; i++) {
                this.formulas.push({axiles: '', cortantes: '', flectores: ''});
            }
        }
    }

}
</script>