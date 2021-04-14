<template>
<mdb-container class="my-4">
    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con los distintos elementos interactivos para observar como van cambiando los resultados.</p>
    </blockquote>

    <mdb-card class="mb-2">
        <mdb-card-body>
            <mdb-card-title class="text-center">Edición de variables</mdb-card-title>
            <hr/>
            <mdb-card-title>Módulo elástico de los materiales</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md" v-for="(material, i) in datos.materiales" :key="'m'+i">
                    <mdb-input :class="material[1].min === material[1].max ? 'disabled' : ''" type="number" :label="'E '+material[0]+' (kN)'" :min="material[1].min" :max="material[1].max" :step="0.1" v-model.number="material[1].valor"/>
                    <input v-if="material[1].min !== material[1].max" :aria-label="'E '+material[0]+'(kN)'" type="range" :min="material[1].min" :max="material[1].max" :step="0.1" class="custom-range" v-model="material[1].valor">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Longitud de las secciones</mdb-card-title>
            <hr/>
            <mdb-row v-for="(seccion, i) in datos.secciones" :key="'s'+i">
                <mdb-col md="6" col="md">
                    <mdb-input :class="seccion[1].min === seccion[1].max ? 'disabled' : ''" type="number" :label="'Ancho '+seccion[0]+' (m)'" :min="seccion[1].min" :max="seccion[1].max" :step="0.1" v-model.number="seccion[1].valor"/>
                    <input v-if="seccion[1].min !== seccion[1].max" :aria-label="'Ancho '+seccion[0]+'(m)'" type="range" :min="seccion[1].min" :max="seccion[1].max" :step="0.1" class="custom-range" v-model="seccion[1].valor">
                </mdb-col>
                <mdb-col md="6" col="md">
                    <mdb-input :class="seccion[2].min === seccion[2].max ? 'disabled' : ''" type="number" :label="'Alto '+seccion[0]+' (m)'" :min="seccion[2].min" :max="seccion[2].max" :step="0.1" v-model.number="seccion[2].valor"/>
                    <input v-if="seccion[2].min !== seccion[2].max" :aria-label="'Alto '+seccion[0]+'(m)'" type="range" :min="seccion[2].min" :max="seccion[2].max" :step="0.1" class="custom-range" v-model="seccion[2].valor">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Coordenadas de los nodos</mdb-card-title>
            <hr/>
            <mdb-row v-for="(nodo, i) in datos.nodos" :key="'n'+i">
                <mdb-col md="6" col="md">
                    <mdb-input :class="nodo[1].min === nodo[1].max ? 'disabled' : ''" type="number" :label="'Coordenada X '+nodo[0]" :min="nodo[1].min" :max="nodo[1].max" :step="0.1" v-model.number="nodo[1].valor"/>
                    <input v-if="nodo[1].min !== nodo[1].max" :aria-label="'Coordenada X '+nodo[0]" type="range" :min="nodo[1].min" :max="nodo[1].max" :step="0.1" class="custom-range" v-model="nodo[1].valor">
                </mdb-col>
                <mdb-col md="6" col="md">
                    <mdb-input :class="nodo[2].min === nodo[2].max ? 'disabled' : ''" type="number" :label="'Coordenada Y '+nodo[0]" :min="nodo[2].min" :max="nodo[2].max" :step="0.1" v-model.number="nodo[2].valor"/>
                    <input v-if="nodo[2].min !== nodo[2].max" :aria-label="'Coordenada Y '+nodo[0]" type="range" :min="nodo[2].min" :max="nodo[2].max" :step="0.1" class="custom-range" v-model="nodo[2].valor">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Condiciones de contorno</mdb-card-title>
            <small class="text-muted">Seleccione los grados de libertad bloqueados para cada nodo:</small>
            <hr/>
            <div v-for="(nodo, i) in datos.bc" :key="'bc'+i">
                <span class="mt-3 mx-4"><b>Nodo <sub>{{i+1}}</sub></b></span>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'u'+i" v-model="nodo[1]">
                    <label class="custom-control-label" :for="'u'+i"><i>u</i></label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'v'+i" v-model="nodo[2]">
                    <label class="custom-control-label" :for="'v'+i"><i>v</i></label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'θ'+i" v-model="nodo[3]">
                    <label class="custom-control-label" :for="'θ'+i"><i>θ</i></label>
                </div>
            </div>

            <hr/>
            <mdb-card-title>Nodos inicial y final de las barras</mdb-card-title>
            <hr/>
            <div v-if="editBarras" class="d-flex justify-content-center my-5">
                <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
            </div>
            <div v-if="!editBarras">
                <mdb-row v-for="(barra, i) in datos.barras" :key="'b'+i">
                    <mdb-col md="4" col="md">
                        <p class="text-center mt-2"><b>Nodo inicial :</b> {{barra[1]}}</p>
                    </mdb-col>
                    <mdb-col md="4" col="md">
                        <p class="text-center mt-2"><b>Nodo final :</b> {{barra[2]}}</p>
                    </mdb-col>
                    <mdb-col md="4" col="md">
                        <mdb-btn block color="blue-grey" @click="cambiaBarras(i)"><mdb-icon icon="exchange-alt" class="mr-1"/> Intercambiar nodos</mdb-btn>
                    </mdb-col>
                </mdb-row>
            </div>

            <hr/>
            <mdb-card-title>Valor de las cargas</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="3" col="md" v-for="(carga, i) in datos.cargas" :key="'c'+i">
                    <mdb-input :class="carga[2].min === carga[2].max ? 'disabled' : ''" type="number" :label="'Valor de la carga '+(i+1)+' (kN)'" :min="carga[2].min" :max="carga[2].max" :step="0.1" v-model.number="carga[2].valor"/>
                    <input v-if="carga[2].min !== carga[2].max" :aria-label="'Valor de la carga '+(i+1)+' (kN)'" type="range" :min="carga[2].min" :max="carga[2].max" :step="0.1" class="custom-range" v-model="carga[2].valor">
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>


</mdb-container>
</template>

<script>
import { mdbContainer, mdbCardTitle, mdbInput,
         mdbRow, mdbCol, mdbCard, mdbCardBody,
         mdbBtn, mdbIcon
         } from 'mdbvue';
import { ejMatriz, limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';
export default {
    name: "EjercicioViga",
    data(){
        return {
            datos: ejMatriz,
            editBarras: false,
            programada: setInterval( this.actualizaGrafica, 2000)
        };
    },
    components:{
        mdbContainer, mdbCardTitle, mdbInput,
        mdbRow, mdbCol, mdbCard, mdbCardBody,
        mdbBtn, mdbIcon
    },
    methods:{
        cambiaBarras(i){
            this.editBarras = true;
            let nodo1 = this.datos.barras[i][1];
            this.datos.barras[i][1] = this.datos.barras[i][2];
            this.datos.barras[i][2] = nodo1;
            this.editBarras = false;
        }
    },
    mounted() {
    },
    beforeDestroy(){
        clearInterval(this.programada);
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