<template>
<mdb-container class="my-4">
    <h1>Enunciado...</h1><hr/>
    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con los distintos las entradas de datos para ver como cambia el circulo de Mohr.</p>
        <p> Los datos de entrada para la prueba son: </p>
        <ul>
            <li>&sigma;<sub>x</sub> : {{this.resultado.datos.sx}} MPa</li>
            <li>&sigma;<sub>y</sub> : {{this.resultado.datos.sy}} MPa</li>
            <li>&tau;<sub>xy</sub>  : {{this.resultado.datos.txy}} MPa</li>
            <li>&beta; : {{this.resultado.datos.B}}º</li>
            <li>E : 2,1 · 10<sup>5</sup> MPa</li>
            <li><i>v</i> : 0.3</li>
        </ul>
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

            <div class="my-4" ref="circulo">
                <canvas id="circulo" style="border: 1px solid rgb(211,211,211)"></canvas>
            </div>
        </mdb-card-body>
    </mdb-card>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbCard, mdbCardBody,
         mdbCardTitle, mdbRow, mdbCol } from 'mdbvue';
import * as calculo from '@/assets/js/mohr/calculos.js';
import * as dib from '@/assets/js/mohr/dibujar.js';
import 'katex/dist/katex.min.css';
export default {
    name: 'Morh',
    components: { mdbContainer, mdbCard, mdbCardBody,
                  mdbCardTitle, mdbRow, mdbCol },
    data(){
        return {
            resultado: calculo,
            formula: ''
        };
    },
    methods:{
        actualizaDatos(){
            calculo.prueba();
            this.resultado = calculo;
            this.formula = calculo.calculaTensor();
        }
    },
    beforeMount() {
        this.actualizaDatos();
    },
    mounted(){
        dib.vinculaCanvas(this.$refs.circulo);

        // Redimensionar
        window.addEventListener('resize', () => dib.resizeCanvas(this.$refs.circulo));
    }

}
</script>

<style>
.katex { font-size: 1.5em; }
</style>