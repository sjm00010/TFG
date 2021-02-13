<template>
<mdb-container class="my-4">
    <!-- Jumbotron con el enunciado del problema -->
    <mdb-jumbotron class="mb-0 text-center">
        <mdb-card-title class="pb-2 h4"><strong>Ejercicio de vigas</strong></mdb-card-title>
        <p class="card-text" v-html="datos.enunciado"></p>
        <mdb-row class="justify-content-center">
            <mdb-col col="md" class="my-2">
                <mdb-btn block color="elegant" @click.native="modal1 = true"><mdb-icon class="align-middle" size="2x" icon="journal-whills" /> Explicación</mdb-btn>
            </mdb-col>
            <mdb-col col="md" class="my-2">
                <mdb-btn block color="secondary" @click.native="modal2 = true"><mdb-icon class="align-middle" fab size="2x" icon="youtube" /> Vídeo explicativo</mdb-btn>
            </mdb-col>
        </mdb-row>
    </mdb-jumbotron>

    <!-- Modal de la explicación -->
    <mdb-modal size="lg"  :show="modal1" @close="modal1 = false">
        <mdb-modal-header>
            <mdb-modal-title>Explicación</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body v-html="datos.ayuda">
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="danger" @click.native="modal1 = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>



    <!-- Modal del vídeo -->
    <mdb-modal size="lg" :show="modal2" @close="modal2 = false">
        <mdb-modal-body class="p-0">
            <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
            <iframe class="embed-responsive embed-responsive-16by9 z-depth-1-half"
                        :src="'https://www.youtube.com/embed/'
                            +((datos.video.match(/(?:v=|\.be\/|embed\/)(?<url>\w+)/) 
                            && datos.video.match(/(?:v=|\.be\/|embed\/)(?<url>\w+)/).groups.url) 
                            || 'YgGzAKP_HuM')" 
                        allowfullscreen></iframe>
            </div>
        </mdb-modal-body>
        <mdb-modal-footer >
            <mdb-btn color="danger" @click.native="modal2 = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con los distintos elementos interactivos para observar como van cambiando los resultados.
        </p>
    </blockquote>

    <div class="my-4" ref="editor">
        <canvas id="editor" style="border: 1px solid rgb(211,211,211)"></canvas>
    </div>

    <mdb-card class="mb-2">
        <mdb-card-body>
            <mdb-card-title class="text-center">Edición de variables</mdb-card-title>
            <hr/>
            <mdb-card-title>Longitudes de los segmentos</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md" v-for="(tramo, i) in datos.tramos" :key="i">
                    <mdb-input type="number" :label="'Tramo '+(i+1)+'(m)'" :min="tramo.min" :max="tramo.max" :step="0.1" v-model.number="tramo.valor" @input="cambioTramos(0)"/>
                    <input type="range" :min="tramo.min" :max="tramo.max" :step="0.1" class="custom-range" v-model="tramo.valor" @input="cambioTramos(0)">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Magnitudes de los elementos</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md" v-for="(elemento, i) in elementos" :key="i">
                    <mdb-input type="number" :label="elemento.tipo+' '+(i+1)" :min="elemento.min" :max="elemento.max" 
                                :step="0.1" v-model.number="elemento.magnitud" @input="cambio(elemento.pos, elemento.magnitud, elemento.min, elemento.max)"/>
                    <input  type="range" :min="elemento.min" :max="elemento.max" :step="0.1" class="custom-range"
                            v-model="elemento.magnitud" @input="cambio(elemento.pos, elemento.magnitud, elemento.min, elemento.max)">
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbJumbotron, mdbCardTitle, mdbInput,
         mdbBtn, mdbRow, mdbCol, mdbModal, mdbModalBody, mdbCard, 
         mdbModalTitle, mdbModalFooter, mdbModalHeader, mdbIcon,
         mdbCardBody} from 'mdbvue';
import { vinculaCanvas, resizeCanvas, redibuja } from '@/assets/js/vigas/funAuxiliares.js';
import { setElementos, modificaElemento, calculaSegmento, vincularTramos } from '@/assets/js/vigas/variables.js';
import { ejViga } from '@/assets/js/ejercicioJSON.js';
export default {
    name: "EjercicioViga",
    data(){
        return {
            datos: ejViga,
            modal1: false,
            modal2: false,
            elementos: []
        };
    },
    components:{
        mdbContainer, mdbJumbotron, mdbCardTitle, mdbInput,
        mdbBtn, mdbRow, mdbCol, mdbModal, mdbModalHeader,
        mdbModalTitle, mdbModalBody, mdbModalFooter, mdbIcon,
        mdbCardBody, mdbCard
    },
    methods:{
        cambioTramos(pos){
            modificaElemento( pos, calculaSegmento(this.datos.tramos.length));
            redibuja();
        },
        cambio(pos, mag, min, max){
            if(!(mag < min || mag > max)){
                modificaElemento( pos, mag);
                redibuja();
            }
        }
    },
    mounted() {
        for(let i = 0; i < ejViga.elementos.length; i++){
            if(!isNaN(ejViga.elementos[i].magnitud) && ejViga.elementos[i].tipo !== 'Viga')
                this.elementos.push({
                    pos: i, 
                    min: ejViga.elementos[i].min, 
                    max: ejViga.elementos[i].max, 
                    magnitud: ejViga.elementos[i].magnitud,
                    tipo: ejViga.elementos[i].tipo
                });
        }
        vinculaCanvas(this.$refs.editor);
        window.addEventListener('resize', () => resizeCanvas(this.$refs.editor));
        if(this.datos.elementos.length > 0){
            setElementos(this.datos.elementos);
            vincularTramos(this.datos.tramos);
            redibuja();
        }else{
            this.$notify({
                group: 'log',
                title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al cargar el ejercicio</b>',
                text: '<i style="font-size:15px"> Ocurrio un problema al cargar los elementos del dibujo. Asegurese de que el ejercicio se creo correctamente.</i>',
                duration: 7000,
                type: 'error'
            });
        }
    },
    beforeDestroy(){
        window.removeEventListener('resize', () => resizeCanvas(this.$refs.editor));
    }
}
</script>

<style lang="css">
b{
    font-weight: bold;
}
ul, ol{
    text-align: left;
}
</style>