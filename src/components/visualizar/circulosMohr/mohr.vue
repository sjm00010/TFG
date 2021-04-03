<template>
<mdb-container class="my-4">
    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con las distintas entradas de datos para ver como cambia el círculo de Mohr.</p>
    </blockquote>  

    <mdb-card class="my-2">
        <mdb-card-body>
            <mdb-card-title class="text-center">Variables calculadas</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md">
                    &sigma;<sub>1</sub> : {{this.resultado.s1.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    &sigma;<sub>2</sub> : {{this.resultado.s2.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    &alpha; : {{this.resultado.alfa.toFixed(2)}}º
                </mdb-col>
                <mdb-col md="3" col="md">
                    &tau;<sub>xy,max</sub> : {{this.resultado.radio.toFixed(2)}} MPa
                </mdb-col>
            </mdb-row>
            <mdb-row class="mt-3">
                <mdb-col md="3" col="md">
                    &gamma; : {{this.resultado.gamma.toFixed(2)}}º
                </mdb-col>
                <mdb-col md="3" col="md">
                    &sigma;<sub>A</sub> : {{this.resultado.sA.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    &tau;<sub>A</sub> : {{this.resultado.tA.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    &sigma;<sub>A'</sub> : {{this.resultado.sAprima.toFixed(2)}} MPa
                </mdb-col>
            </mdb-row>
            <mdb-row>
                <mdb-col md="3" col="md">
                    &tau;<sub>A'</sub> : {{this.resultado.tA.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    Radio C. Mohr : {{this.resultado.radio.toFixed(2)}} MPa
                </mdb-col>
                <mdb-col md="3" col="md">
                    Centro C. Mohr : {{this.resultado.centro.toFixed(2)}} MPa
                </mdb-col>
            </mdb-row>
            <mdb-row class="my-3">
                <mdb-col md="3" col="md">
                    &epsilon;<sub>1</sub> : {{this.resultado.e1.toFixed(6)}}
                </mdb-col>
                <mdb-col md="3" col="md">
                    &epsilon;<sub>2</sub> : {{this.resultado.e2.toFixed(6)}}
                </mdb-col>
                <mdb-col md="3" col="md">
                    <i>u</i> : {{this.resultado.u.toFixed(2)}} J/m<sup>3</sup>
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title class="text-center">Tensor de tensiones</mdb-card-title>
            <hr/>
            <katex-element :expression="formula" :throwOnError="false" :display-mode="true"/>
            <hr/>
            <mdb-card-title class="text-center">Angulo &beta;</mdb-card-title>
            <div>
                <mdb-input type="number" label="Angulo β" :min="0" :max="360" 
                            :step="0.1" v-model.number="datos.B" @input="cambio()"/>
                <input  type="range" :min="0" :max="360" :step="1" class="custom-range"
                        v-model="datos.B" @input="cambio()" aria-label="Angulo β">
            </div>
            <hr/>

            <dibujos :datos="this.datos"/>
        </mdb-card-body>
    </mdb-card>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbCard, mdbCardBody,
         mdbCardTitle, mdbRow, mdbCol, mdbInput } from 'mdbvue';
import * as cal from '@/assets/js/mohr/calculos.js';
import * as dib from '@/assets/js/mohr/dibujarCirculo.js';
import * as cua from '@/assets/js/mohr/dibujarCuadrado.js';
import { ejMohr, limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';
import dibujos from '@/components/visualizar/circulosMohr/dibujos';
import 'katex/dist/katex.min.css';
export default {
    name: 'Morh',
    components: { mdbContainer, mdbCard, mdbCardBody,
                  mdbCardTitle, mdbRow, mdbCol, mdbInput,
                  dibujos },
    data(){
        return {
            datos: ejMohr,
            resultado: cal,
            formula: ''
        };
    },
    methods:{
        calcularDatos(){
            cal.actualizaDatos(this.datos);
            cal.calcular();
            this.resultado = cal;
            this.formula = cal.calculaTensor();
        },
        cambio(){
            if(this.datos.B >= 0 && this.datos.B <= 360 ){
                cal.actualizar(parseFloat(this.datos.B));
                this.formula = cal.calculaTensor();
                dib.calculaPlano();
                cua.dibujaCuadradoRotado(this.datos.B);
            } 
        }
    },
    beforeMount() {
        this.calcularDatos();
    },
    beforeDestroy(){
        limpiar();
    }

}
</script>

<style>
.katex { font-size: 1.5em; }
</style>