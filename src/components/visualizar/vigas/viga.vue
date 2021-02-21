<template>
<mdb-container class="my-4">
    <!-- Jumbotron con el enunciado del problema -->
    <mdb-jumbotron class="mb-0 text-center">
        <mdb-card-title class="pb-2 h4"><strong>Ejercicio de vigas</strong></mdb-card-title>
        <p class="card-text" v-html="datos.enunciado"></p>
        <mdb-row class="justify-content-center">
            <mdb-col col="md" class="my-2" v-show="datos.ayuda && datos.ayuda.length !== 0">
                <mdb-btn block color="elegant" @click.native="modal1 = true"><mdb-icon class="align-middle" size="2x" icon="journal-whills" /> Explicación</mdb-btn>
            </mdb-col>
            <mdb-col col="md" class="my-2" v-show="datos.video && datos.video.length !== 0">
                <mdb-btn block color="secondary" @click.native="modal2 = true"><mdb-icon class="align-middle" fab size="2x" icon="youtube" /> Vídeo explicativo</mdb-btn>
            </mdb-col>
        </mdb-row>
    </mdb-jumbotron>

    <!-- Modal de la explicación -->
    <mdb-modal size="lg" v-if="datos.ayuda && datos.ayuda.length !== 0"  :show="modal1" @close="modal1 = false">
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
    <mdb-modal size="lg" v-if="datos.video && datos.video.length !== 0" :show="modal2" @close="modal2 = false">
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
                    <mdb-input type="number" :label="'Tramo '+(i+1)+'(m)'" :min="tramo.min" :max="tramo.max" :step="0.1" v-model.number="tramo.valor" @input="cambioTramos(0, i)"/>
                    <input type="range" :min="tramo.min" :max="tramo.max" :step="0.1" class="custom-range" v-model="tramo.valor" @input="cambioTramos(0, i)">
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
                <mdb-col md="3" col="md" v-for="(ditancia, i) in d" :key="'d'+i">
                    <mdb-input type="number" :label="'Distancia de la barra '+(ditancia.pos+1)" :min="ditancia.minD" :max="ditancia.maxD" 
                                :step="0.01" v-model.number="ditancia.d" @input="cambio(ditancia.pos, ditancia.d, ditancia.minD, ditancia.maxD)"/>
                    <input  type="range" :min="ditancia.minD" :max="ditancia.maxD" :step="0.01" class="custom-range"
                            v-model="ditancia.d" @input="cambio(ditancia.pos, ditancia.d, ditancia.minD, ditancia.maxD)">
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>

    <mdb-card class="my-3">
        <mdb-card-body>
            <mdb-row>
                <mdb-col xl="6" class="mb-3">
                    <p class="lead">Módulo elástico <i>E</i> (· 10<sup>7</sup> kN/m<sup>2</sup>)</p>
                    <select class="browser-default custom-select" v-model="E">
                        <option value="null" selected>Selecciona un módulo...</option>
                        <option value="Aluminio">Aluminio (7)</option>
                        <option value="Cobre">Cobre (10)</option>
                        <option value="Acero">Acero (21)</option>
                    </select>
                </mdb-col>
                <mdb-col xl="6" class="mb-3">
                    <p class="lead">Momento de inercia <i>I</i> (· 10<sup>-8</sup> kN/m<sup>4</sup>)</p>
                    <select class="browser-default custom-select" v-model="I">
                        <option value="null" selected>Selecciona un momento...</option>
                        <option value="120">IPN 120 (328)</option>
                        <option value="160">IPN 160 (935)</option>
                        <option value="200">IPN 200 (2140)</option>
                        <option value="240">IPN 240 (4250)</option>
                        <option value="280">IPN 280 (7590)</option>
                        <option value="320">IPN 320 (12510)</option>
                        <option value="360">IPN 360 (19610)</option>
                        <option value="400">IPN 400 (29210)</option>
                    </select>
                </mdb-col>
            </mdb-row>
            <mdb-row>
                <mdb-col xl="6" class="mb-3" v-show="this.giro != null">
                    <p class="lead blue-grey-text">Giro en C : {{this.giro}} rad</p>
                </mdb-col>
                <mdb-col xl="6" class="mb-3" v-show="this.flecha != null">
                    <p class="lead blue-grey-text">Fecha en D : {{this.flecha}} metros</p>
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>

    <div class="d-flex">
        <mdb-popover class="ml-auto" trigger="hover">
            <span slot="header">Sabías que...</span>
            <span slot="body">Si quieres ocultar una ley solo tienes que pinchar en su nombre.</span>
            <mdb-btn color="info" class="my-3" slot="reference">
                <mdb-icon size="2x" icon="question-circle" />
            </mdb-btn>
        </mdb-popover>
    </div>

    <grafica :datos="this.datosGraficas.axiles" titulo="Esfuerzo de axiles" color="rgb(41, 128, 185)" :invertida="false" ></grafica>
    <grafica :datos="this.datosGraficas.cortantes" titulo="Esfuerzo cortantes" color="rgb(231, 76, 60)" :invertida="false" ></grafica>
    <grafica :datos="this.datosGraficas.flectores" titulo="Momentos flectores" color="rgb(82, 190, 128)" :invertida="true" ></grafica>

</mdb-container>
</template>

<script>
import { mdbContainer, mdbJumbotron, mdbCardTitle, mdbInput,
         mdbBtn, mdbRow, mdbCol, mdbModal, mdbModalBody, mdbCard, 
         mdbModalTitle, mdbModalFooter, mdbModalHeader, mdbIcon,
         mdbCardBody, mdbPopover} from 'mdbvue';
import grafica from '@/components/visualizar/vigas/grafica';

import { vinculaCanvas, resizeCanvas, redibuja } from '@/assets/js/vigas/funAuxiliares.js';
import { setElementos, modificaElemento, calculaSegmento, vincularTramos } from '@/assets/js/vigas/variables.js';
import { ejViga, limpiar } from '@/assets/js/ejercicioJSON.js';
import { inicializar, actualizaTramo, actualizaElemento, calcular } from '@/assets/js/vigas/calculos.js';
export default {
    name: "EjercicioViga",
    data(){
        return {
            datos: ejViga,
            modal1: false,
            modal2: false,
            elementos: [],
            d: [],
            E: null,
            I: null,
            giro: null,
            flecha: null,
            datosGraficas: {
                axiles: [],
                cortantes: [],
                flectores: [],
            },
            editado: true,
            programada: setInterval( this.actualizaGrafica, 1000)
        };
    },
    components:{
        mdbContainer, mdbJumbotron, mdbCardTitle, mdbInput,
        mdbBtn, mdbRow, mdbCol, mdbModal, mdbModalHeader,
        mdbModalTitle, mdbModalBody, mdbModalFooter, mdbIcon,
        mdbCardBody, mdbCard, mdbPopover,
        grafica
    },
    methods:{
        cambioTramos(pos, i){
            modificaElemento( pos, calculaSegmento(this.datos.tramos.length));
            redibuja();
            actualizaTramo(i+1, this.datos.tramos[i].valor);
            this.editado = true;
        },
        cambio(pos, mag, min, max){
            if(!(mag < min || mag > max)){
                modificaElemento( pos, mag);
                redibuja();
                actualizaElemento(this.datos.elementos[pos].nombre, mag);
                this.editado = true;
            }
        },
        actualizaGrafica(){
            if(this.editado){
                let resultado = calcular();
                this.datosGraficas.axiles.splice(0, this.datosGraficas.axiles.length, ...resultado.axiles);
                this.datosGraficas.cortantes.splice(0, this.datosGraficas.cortantes.length, ...resultado.cortantes);
                this.datosGraficas.flectores.splice(0, this.datosGraficas.flectores.length, ...resultado.flectores);
                this.editado = false;
            }
        }
    },
    mounted() {
        for(let i = 0; i < ejViga.elementos.length; i++){
            if(!isNaN(ejViga.elementos[i].magnitud) && ejViga.elementos[i].tipo !== 'Viga'){
                this.elementos.push({
                    pos: i, 
                    min: ejViga.elementos[i].min, 
                    max: ejViga.elementos[i].max, 
                    magnitud: ejViga.elementos[i].magnitud,
                    tipo: ejViga.elementos[i].tipo
                });

                if(ejViga.elementos[i].tipo === 'Barra'){
                    this.d.push({
                        pos: i, 
                        minD: ejViga.elementos[i].minD, 
                        maxD: ejViga.elementos[i].maxD, 
                        d: ejViga.elementos[i].d
                    });
                }
            }
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
        this.actualizaGrafica(inicializar());
    },
    beforeDestroy(){
        window.removeEventListener('resize', () => resizeCanvas(this.$refs.editor));
        clearInterval(this.polling);
        limpiar();
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