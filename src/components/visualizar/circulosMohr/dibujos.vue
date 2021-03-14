<template>
    <mdb-row class="my-3" style="box-sizing: none;">
        <mdb-col class="my-2" md="6" col="md" ref="circulo">
            <canvas id="circulo" style="border: 1px solid rgb(211,211,211)"></canvas>
        </mdb-col>
        <mdb-col class="my-2" md="6" col="md" ref="cuadrado">
            <canvas id="cuadrado" style="border: 1px solid rgb(211,211,211)"></canvas>
        </mdb-col>
    </mdb-row>
</template>

<script>
import { mdbRow, mdbCol } from 'mdbvue';
import * as dib from '@/assets/js/mohr/dibujarCirculo.js';
import * as cua from '@/assets/js/mohr/dibujarCuadrado.js';
export default {
    name: 'Dibujos',
    components: { mdbRow, mdbCol },
    props: ['datos'],
    methods: {
        resize(){
            dib.resizeCanvas(this.$refs.circulo, this.datos);
            cua.resizeCanvas(this.$refs.cuadrado, this.datos.B);
        }
    },
    mounted(){
        dib.vinculaCanvas(this.$refs.circulo, this.datos);
        cua.vinculaCanvas(this.$refs.cuadrado, this.datos.B);

        // Redimensionar
        window.addEventListener('resize', () => this.resize());
    },
    beforeDestroy(){
        window.removeEventListener('resize', () => this.resize());
    }
}
</script>