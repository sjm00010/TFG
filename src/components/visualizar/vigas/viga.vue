<template>
<mdb-container class="my-4">
    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con los distintos elementos interactivos para observar como van cambiando los resultados.</p>
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
                    <mdb-input :class="tramo.min === tramo.max ? 'disabled' : ''" type="number" :label="'Tramo '+(i+1)+'(m)'" :min="tramo.min" :max="tramo.max" :step="0.1" v-model.number="tramo.valor" @change="cambioTramos(i)"/>
                    <input v-if="tramo.min !== tramo.max" :aria-label="'Tramo '+(i+1)+'(m)'" type="range" :min="tramo.min" :max="tramo.max" :step="0.1" class="custom-range" v-model="tramo.valor" @change="cambioTramos(i)">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Magnitudes de los elementos</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md" v-for="(elemento, i) in elementos" :key="i">
                    <mdb-input :class="elemento.min === elemento.max ? 'disabled' : ''" type="number" :label="elemento.tipo+' '+(i+1)" :min="elemento.min" :max="elemento.max" 
                                :step="0.1" v-model.number="elemento.magnitud" @change="cambio(elemento.pos, elemento.magnitud, elemento.min, elemento.max)"/>
                    <input v-if="elemento.min !== elemento.max" type="range" :min="elemento.min" :max="elemento.max" :step="0.1" class="custom-range" :aria-label="elemento.tipo+' '+(i+1)"
                            v-model="elemento.magnitud" @change="cambio(elemento.pos, elemento.magnitud, elemento.min, elemento.max)">
                </mdb-col>
                <mdb-col md="3" col="md" v-for="(ditancia, i) in d" :key="'d'+i">
                    <mdb-input :class="ditancia.minD === ditancia.maxD ? 'disabled' : ''" type="number" :label="'Distancia de la barra '+(ditancia.pos+1)" :min="ditancia.minD" :max="ditancia.maxD" 
                                :step="0.01" v-model.number="ditancia.d" @change="cambio(ditancia.pos, ditancia.d, ditancia.minD, ditancia.maxD)"/>
                    <input v-if="ditancia.minD !== ditancia.maxD" type="range" :min="ditancia.minD" :max="ditancia.maxD" :step="0.01" class="custom-range" :aria-label="'Distancia de la barra '+(ditancia.pos+1)"
                            v-model="ditancia.d" @change="cambio(ditancia.pos, ditancia.d, ditancia.minD, ditancia.maxD)">
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>

    <div class="d-flex" v-if="!editado">
        <mdb-popover class="ml-auto" trigger="hover">
            <span slot="header">Sabías que...</span>
            <span slot="body">Si quieres ocultar una ley solo tienes que pinchar en su nombre.</span>
            <mdb-btn color="info" class="my-3" slot="reference" >
                <mdb-icon size="2x" icon="question-circle" aria-label="Ayuda gráficas" />
            </mdb-btn>
        </mdb-popover>
    </div>

    <div v-if="editado" class="d-flex justify-content-center my-5">
        <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
    </div>

    <grafica v-if="!editado" :datos="this.datosGraficas.axiles" titulo="Esfuerzos axiles" color="rgb(41, 128, 185)" :invertida="false" unidad="kN" :precision="3" ></grafica>
    <grafica v-if="!editado" :datos="this.datosGraficas.cortantes" titulo="Esfuerzos cortantes" color="rgb(231, 76, 60)" :invertida="false" unidad="kN" :precision="3" ></grafica>
    <grafica v-if="!editado" :datos="this.datosGraficas.flectores" titulo="Momentos flectores" color="rgb(82, 190, 128)" :invertida="true" unidad="kN·m" :precision="3" ></grafica>

    <mdb-card class="my-3" v-if="def">
        <mdb-card-body>
            <mdb-row>
                <mdb-col xl="6" class="mb-3">
                    <p class="lead">Módulo elástico <i>E</i> (· 10<sup>7</sup> kN/m<sup>2</sup>)</p>
                    <mdb-input class="mb-2 mt-0" type="number" v-model="datos.E" placeholder="Módulo elástico" @change="cambiaEoI('E', datos.E)">
                        <span class="input-group-text md-addon" slot="prepend"><i>E = </i></span>
                        <span class="input-group-text md-addon" slot="append">· 10<sup>7</sup> kN/m<sup>2</sup></span>
                    </mdb-input>
                </mdb-col>
                <mdb-col xl="6" class="mb-3">
                    <p class="lead">Momento de inercia <i>I</i> (· 10<sup>-8</sup> m<sup>4</sup>)</p>
                    <mdb-input class="mb-2 mt-0" type="number" v-model="datos.I" placeholder="Momento de inercia" @change="cambiaEoI('I', datos.I)">
                        <span class="input-group-text md-addon" slot="prepend"><i>I = </i></span>
                        <span class="input-group-text md-addon" slot="append">· 10<sup>-8</sup> m<sup>4</sup></span>
                    </mdb-input>
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>

    <div v-if="editadoDef" class="d-flex justify-content-center my-5">
        <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
    </div>

    <grafica v-if="def && !editado && !editadoDef" :datos="this.datosGraficas.deformada" titulo="Deformada" color="rgb(128, 0, 128)" :invertida="false" unidad="mm" :precision="5"></grafica>

</mdb-container>
</template>

<script>
import { mdbContainer, mdbCardTitle, mdbInput,
         mdbBtn, mdbRow, mdbCol, mdbCard, mdbIcon,
         mdbCardBody, mdbPopover} from 'mdbvue';
import grafica from '@/components/visualizar/vigas/grafica';
import { vinculaCanvas, resizeCanvas, redibuja } from '@/assets/js/vigas/funAuxiliares.js';
import { setElementos, modificaElemento, vincularTramos, calculaSegmento } from '@/assets/js/vigas/variables.js';
import { ejViga, limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { inicializar, actualizaTramo, actualizaElemento, 
         actualizaEeI, calcular, calculaDeformada, limpiarVar } from '@/assets/js/vigas/calculos.js';
export default {
    name: "EjercicioViga",
    data(){
        return {
            datos: ejViga,
            modal1: false,
            modal2: false,
            elementos: [],
            d: [],
            def: ejViga.E ? true : false, 
            datosGraficas: {
                axiles: [],
                cortantes: [],
                flectores: [],
                deformada: []
            },
            editado: true,
            editadoDef: false,
            programada: setInterval( this.actualizaGrafica, 2000)
        };
    },
    components:{
        mdbContainer, mdbCardTitle, mdbInput,
        mdbBtn, mdbRow, mdbCol, mdbIcon,
        mdbCardBody, mdbCard, mdbPopover,
        grafica
    },
    methods:{
        cambioTramos(i){
            if(this.datos.tramos[i].valor >= this.datos.tramos[i].min &&  this.datos.tramos[i].valor <= this.datos.tramos[i].max){
                modificaElemento( 0, calculaSegmento(this.datos.tramos.length));
                actualizaTramo(i+1, this.datos.tramos[i].valor);
                redibuja();
                this.editado = true;
            }
        },
        cambio(pos, mag, min, max){
            if(mag >= min && mag <= max){
                modificaElemento( pos, mag);
                redibuja();
                actualizaElemento(this.datos.elementos[pos].nombre, mag);
                this.editado = true;
            }
        },
        actualizaGrafica(){
            if(this.editado){
                let resultado = calcular(this.datos.E);
                if(resultado){
                    this.datosGraficas.axiles.splice(0, this.datosGraficas.axiles.length, ...resultado.axiles);
                    this.datosGraficas.cortantes.splice(0, this.datosGraficas.cortantes.length, ...resultado.cortantes);
                    this.datosGraficas.flectores.splice(0, this.datosGraficas.flectores.length, ...resultado.flectores);
                    this.datosGraficas.deformada.splice(0, this.datosGraficas.deformada.length, ...resultado.deformada);
                }else{
                    this.$notify({
                        group: 'log',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al calcular los datos del ejercicio</b>',
                        text: '<i style="font-size:15px"> Ocurrio un problema al tratar de calcular los datos de las gráficas.</i>',
                        duration: 7000,
                        type: 'error'
                    });
                }
                this.editado = false;
            }
            if(this.editadoDef){
                this.datosGraficas.deformada.splice(0, this.datosGraficas.deformada.length, ...calculaDeformada());
                this.editadoDef = false;
            }
        },
        cambiaEoI(variable, valor){
            if(!isNaN(valor)){
                this.editadoDef = true;
                actualizaEeI(variable, valor);
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

                if(ejViga.elementos[i].tipo === 'Voladizo vertical'){
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
        clearInterval(this.programada);
        limpiar();
        limpiarVar();
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