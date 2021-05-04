<template>
<div>
<mdb-container class="my-4">
    <blockquote class="blockquote bq-primary my-3">
        <p class="bq-title">Solución</p>
        <p> Interactúa con los distintos elementos interactivos para observar como van cambiando los resultados.</p>
    </blockquote>

    <mdb-card class="mb-2" v-show="editar">
        <mdb-card-body>
            <mdb-card-title class="text-center">Edición de variables</mdb-card-title>
            <hr/>
            <mdb-card-title>Módulo elástico de los materiales (en kN/m<sup>2</sup>)</mdb-card-title>
            <hr/>
            <mdb-row>
                <mdb-col md="4" col="md" v-for="(material, i) in datos.materiales" :key="'m'+i">
                    <p class="text-center"><b>Material {{i+1}}</b></p>
                    <mdb-input :class="material[1].min === material[1].max ? 'disabled' : ''" type="number" 
                               :label="'E '+material[0]+' (kN/m2)'" :min="material[1].min" :max="material[1].max" 
                               :step="0.1" v-model.number="material[1].valor" @blur="cambiaMaterial"/>
                    <input v-if="material[1].min !== material[1].max" :aria-label="'E '+material[0]+' (kN/m2)'" type="range" 
                           :min="material[1].min" :max="material[1].max" :step="0.1" class="custom-range" 
                           v-model="material[1].valor" @blur="cambiaMaterial">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Dimensiones de las secciones transversales (en m)</mdb-card-title>
            <small class="text-muted">El ancho de la sección indica la dimensión perpendicular al plano de la estructura,
                 es decir, la dimensión paralela al eje de flexión.</small>
            <hr/>
            <mdb-row v-for="(seccion, i) in datos.secciones" :key="'s'+i">
                <mdb-col md="6" col="md">
                    <p class="text-center"><b>Ancho sección {{i+1}}</b></p>
                    <mdb-input :class="seccion[1].min === seccion[1].max ? 'disabled' : ''" type="number" :label="'Ancho '+seccion[0]+' (m)'"
                               :min="seccion[1].min" :max="seccion[1].max" :step="0.1" v-model.number="seccion[1].valor" @blur="cambiaSeccion"/>
                    <input v-if="seccion[1].min !== seccion[1].max" :aria-label="'Ancho '+seccion[0]+'(m)'" type="range" :min="seccion[1].min"
                           :max="seccion[1].max" :step="0.1" class="custom-range" v-model="seccion[1].valor" @blur="cambiaSeccion">
                </mdb-col>
                <mdb-col md="6" col="md">
                    <p class="text-center"><b>Altura sección {{i+1}}</b></p>
                    <mdb-input :class="seccion[2].min === seccion[2].max ? 'disabled' : ''" type="number" :label="'Alto '+seccion[0]+' (m)'"
                               :min="seccion[2].min" :max="seccion[2].max" :step="0.1" v-model.number="seccion[2].valor" @blur="cambiaSeccion"/>
                    <input v-if="seccion[2].min !== seccion[2].max" :aria-label="'Alto '+seccion[0]+'(m)'" type="range" :min="seccion[2].min" 
                           :max="seccion[2].max" :step="0.1" class="custom-range" v-model="seccion[2].valor" @blur="cambiaSeccion">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Coordenadas de los nodos</mdb-card-title>
            <hr/>
            <mdb-row v-for="(nodo, i) in datos.nodos" :key="'n'+i" class="my-3">
                <mdb-col md="6" col="md">
                    <p class="text-center"><b>Coordenada X nodo {{i+1}} (m)</b></p>
                    <mdb-input :class="nodo[1].min === nodo[1].max ? 'disabled' : ''" type="number" :label="'Coordenada X '+nodo[0]"
                               :min="nodo[1].min" :max="nodo[1].max" :step="0.1" v-model.number="nodo[1].valor" @blur="cambiaNodos"/>
                    <input v-if="nodo[1].min !== nodo[1].max" :aria-label="'Coordenada X '+nodo[0]" type="range" :min="nodo[1].min" 
                           :max="nodo[1].max" :step="0.1" class="custom-range" v-model="nodo[1].valor" @blur="cambiaNodos">
                </mdb-col>
                <mdb-col md="6" col="md">
                    <p class="text-center"><b>Coordenada Y nodo {{i+1}} (m)</b></p>
                    <mdb-input :class="nodo[2].min === nodo[2].max ? 'disabled' : ''" type="number" :label="'Coordenada Y '+nodo[0]"
                               :min="nodo[2].min" :max="nodo[2].max" :step="0.1" v-model.number="nodo[2].valor" @blur="cambiaNodos"/>
                    <input v-if="nodo[2].min !== nodo[2].max" :aria-label="'Coordenada Y '+nodo[0]" type="range" :min="nodo[2].min"
                           :max="nodo[2].max" :step="0.1" class="custom-range" v-model="nodo[2].valor" @blur="cambiaNodos">
                </mdb-col>
            </mdb-row>

            <hr/>
            <mdb-card-title>Condiciones de contorno</mdb-card-title>
            <small class="text-muted">Seleccione los grados de libertad bloqueados para cada nodo:</small>
            <hr/>
            <div v-for="(nodo, i) in datos.bc" :key="'bc'+i">
                <span class="mt-3 mx-4"><b>Nodo <sub>{{i+1}}</sub></b></span>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'u'+i" v-model="nodo[1]" @blur="cambiaBc">
                    <label class="custom-control-label" :for="'u'+i"><i>u</i></label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'v'+i" v-model="nodo[2]" @blur="cambiaBc">
                    <label class="custom-control-label" :for="'v'+i"><i>v</i></label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" :id="'θ'+i" v-model="nodo[3]" @blur="cambiaBc">
                    <label class="custom-control-label" :for="'θ'+i"><i>θ</i></label>
                </div>
            </div>

            <hr/>
            <mdb-card-title>Nodos inicial y final de las barras</mdb-card-title>
            <hr/>
            <div v-if="editBarras" class="d-flex justify-content-center my-5">
                <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
            </div>

            <div class="container overflow-auto">
                <mdb-tbl v-if="!editBarras">
                    <mdb-tbl-head color="black" textWhite>
                        <tr>
                            <th>Num. Barra</th>
                            <th>Nodo inicial</th>
                            <th>Nodo final</th>
                            <th>Material</th>
                            <th>Sección</th>
                            <th>Intercambiar nodos</th>
                        </tr>
                    </mdb-tbl-head>
                    <mdb-tbl-body>
                        <tr v-for="(barra, i) in datos.barras" :key="'b'+i">
                            <td class="align-middle text-center"><b>{{barra[0]}}</b></td>
                            <td class="align-middle text-center">{{barra[1]}}</td>
                            <td class="align-middle text-center">{{barra[2]}}</td>
                            <td>
                                <select class="browser-default custom-select my-2" v-model="barra[3]">
                                    <option selected :value="undefined" disabled>Material</option>
                                    <option v-for="(material, i) in datos.materiales" :key="'maux'+i" :value="i+1">Material {{i+1}}</option>
                                </select>
                            </td>
                            <td>
                                <select class="browser-default custom-select my-2" v-model="barra[4]">
                                    <option selected :value="undefined" disabled>Sección</option>
                                    <option v-for="(seccion, i) in datos.secciones" :key="'saux'+i" :value="i+1">Sección {{i+1}}</option>
                                </select>
                            </td>
                            <td>
                                <mdb-btn block color="purple" @click="cambiaBarras(i)"><mdb-icon icon="exchange-alt" class="mr-1"/> Intercambiar</mdb-btn>
                            </td>
                        </tr>
                    </mdb-tbl-body>
                </mdb-tbl>
            </div>

            <hr/>
            <mdb-card-title>Valor de las cargas</mdb-card-title>
            <hr/>
            <mdb-row v-for="(carga, i) in datos.cargas" :key="'c'+i">
                <mdb-col md="2" col="md">
                    <p class="text-center align-middle my-3"><b>Carga <sub>{{i+1}}</sub></b></p>
                </mdb-col>
                <mdb-col md="3" col="md">
                    <select class="browser-default custom-select my-3 disabled" v-model="carga[0]">
                            <option selected :value="undefined" disabled>Nodo</option>
                            <option v-for="(nodo, i) in datos.nodos" :key="'num_nodo'+i" :value="i+1">Nodo {{i+1}}</option>
                        </select>
                </mdb-col>
                <mdb-col md="3" col="md">
                    <select class="browser-default custom-select my-3 disabled" v-model="carga[1]">
                        <option selected :value="undefined" disabled>Tipo de carga</option>
                        <option selected :value="1" >Horizontal</option>
                        <option selected :value="2" >Vertical</option>
                        <option selected :value="3" >Momento</option>
                    </select>
                </mdb-col>
                <mdb-col md="4" col="md">
                    <mdb-input :class="carga[2].min === carga[2].max ? 'disabled' : ''" type="number" :label="'Valor de la carga '+(i+1)+' (kN'+(carga[1] === 3 ? '·m' : '')+')'"
                               :min="carga[2].min" :max="carga[2].max" :step="0.1" v-model.number="carga[2].valor" @blur="cambiaCargas"/>
                    <input v-if="carga[2].min !== carga[2].max" :aria-label="'Valor de la carga '+(i+1)+' (kN'+(carga[1] === 3 ? '·m' : '')+')'" type="range" :min="carga[2].min"
                           :max="carga[2].max" :step="0.1" class="custom-range" v-model="carga[2].valor" @blur="cambiaCargas">
                </mdb-col>
            </mdb-row>
        </mdb-card-body>
    </mdb-card>

    <mdb-btn block v-show="editar" color="blue-grey" @click="editar = false"><mdb-icon icon="eye-slash" class="mr-1"/> Ocultar edición de variables</mdb-btn>
    <mdb-btn block v-show="!editar" color="dark-green" @click="editar = true"><mdb-icon far icon="eye" class="mr-1"/> Mostrar edición de variables</mdb-btn>

    <div v-if="cambio" class="d-flex justify-content-center my-5">
        <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
    </div>

    <div v-if="!cambio" class="mt-4" ref="dibujo">
        <canvas id="dibujo" style="border: 1px solid rgb(211,211,211)"></canvas>
    </div>

    <div class="text-right">
        <mdb-btn size="sm" color="default" @click="leyenda = true"><mdb-icon icon="info-circle" class="mr-1"/> Leyenda</mdb-btn>
    </div>
</mdb-container>

    <mdb-tabs
        :active="0"
        default
        :links="[
        { text: 'Kloc', role:'tablist' },
        { text: 'C'},
        { text: 'Kglob' },
        { text: 'Ktot' },
        { text: 'Kred' },
        { text: 'Desplazamientos y reacciones' }]"
        :transition-duration="0.5"
        transition-style="linear"
        class="my-3"
    >
        <template :slot="'Kloc'">
            <mdb-container>
                <mdb-card-title class="text-center">Matrices de rigidez de las barras en coordenadas locales</mdb-card-title>
                <div v-for="(matriz, i) in localK" :key="'kloc'+i">
                    <div class="container overflow-auto">
                        <katex-element :expression="matriz" :throwOnError="false" :display-mode="true"/>
                    </div>
                    <div class="text-right">
                        <mdb-btn size="sm" color="secondary" @click="matrizSelecionada = matriz; verMatriz = true"><mdb-icon icon="search" class="mr-1"/> Ampliar</mdb-btn>
                    </div>
                </div>
            </mdb-container>
        </template>
        <template :slot="'C'">
            <mdb-container>
                <mdb-card-title class="text-center">Matrices de cambio de base</mdb-card-title>
                <div v-for="(matriz, i) in C" :key="'C'+i">
                    <div class="container overflow-auto">
                        <katex-element :expression="matriz" :throwOnError="false" :display-mode="true"/>
                    </div>
                    <div class="text-right">
                        <mdb-btn size="sm" color="secondary" @click="matrizSelecionada = matriz; verMatriz = true"><mdb-icon icon="search" class="mr-1"/> Ampliar</mdb-btn>
                    </div>
                </div>
            </mdb-container>
        </template>
        <template :slot="'Kglob'">
            <mdb-container>
                <mdb-card-title class="text-center">Matrices de rigidez de las barras en coordenadas globales</mdb-card-title>
                <div v-for="(matriz, i) in globalK" :key="'kglo'+i">
                    <div class="container overflow-auto">
                        <katex-element :expression="matriz" :throwOnError="false" :display-mode="true"/>
                    </div>
                    <div class="text-right">
                        <mdb-btn size="sm" color="secondary" @click="matrizSelecionada = matriz; verMatriz = true"><mdb-icon icon="search" class="mr-1"/> Ampliar</mdb-btn>
                    </div>
                </div>
            </mdb-container>
        </template>
        <template :slot="'Ktot'">
            <mdb-card-title class="text-center">Matriz de rigidez completa del problema antes de aplicar las condiciones de contorno</mdb-card-title>
            <mdb-container>
                <div class="container overflow-auto">
                    <katex-element :expression="Ktot" :throwOnError="false" :display-mode="true"/>
                </div>
                <div class="text-right">
                    <mdb-btn size="sm" color="secondary" @click="matrizSelecionada = Ktot; verMatriz = true"><mdb-icon icon="search" class="mr-1"/> Ampliar</mdb-btn>
                </div>
            </mdb-container>
        </template>
        <template :slot="'Kred'">
            <mdb-container>
                <div class="container overflow-auto">
                    <katex-element :expression="Kred" :throwOnError="false" :display-mode="true"/>
                </div>
                <div class="text-right">
                    <mdb-btn size="sm" color="secondary" @click="matrizSelecionada = Kred; verMatriz = true"><mdb-icon icon="search" class="mr-1"/> Ampliar</mdb-btn>
                </div>
            </mdb-container>
        </template>
        <template :slot="'Desplazamientos y reacciones'">
            <div class="container overflow-auto my-3">
                <mdb-card-title class="text-center">Desplazamientos</mdb-card-title>
                <mdb-tbl hover sm>
                    <mdb-tbl-head>
                        <tr>
                            <th>Nodos</th>
                            <th>&delta;<sub>H</sub></th>
                            <th>&delta;<sub>v</sub></th>
                            <th>&theta;</th>
                        </tr>
                    </mdb-tbl-head>
                    <mdb-tbl-body>
                        <tr v-for="(trash, i) in datos.nodos" :key="'b'+i">
                            <td class="align-middle"><b>Nodo <sub>{{i+1}}</sub></b></td>
                            <td class="align-middle">{{desplazamiento[i*3]}}</td>
                            <td class="align-middle">{{desplazamiento[i*3+1]}}</td>
                            <td class="align-middle">{{desplazamiento[i*3+2]}}</td>
                        </tr>
                    </mdb-tbl-body>
                </mdb-tbl>
            </div>
            <mdb-row class="container">
                <mdb-col size="md" md="4">
                    <mdb-input placeholder="Factor multiplicativo" class="mb-3 mt-0" v-model="factor" :min="0" :step="1" @change="verDesp = false; actualizaDibujo()">
                        <span class="input-group-text md-addon" slot="prepend">Factor multiplicativo</span>
                    </mdb-input>
                </mdb-col>
                <mdb-col size="md" md="8" class="text-center">
                    <mdb-btn size="sm" block v-show="verDesp" color="primary" @click="verDesp = false; actualizaDibujo()"><mdb-icon icon="eye-slash" class="mr-1"/> Ocultar desplazamientos</mdb-btn>
                    <mdb-btn size="sm" block v-show="!verDesp" color="default" @click="verDesp = true; actualizaDibujo()"><mdb-icon far icon="eye" class="mr-1"/> Mostrar desplazamientos</mdb-btn>
                </mdb-col>
            </mdb-row>
            <mdb-container class="container overflow-auto my-2">
                <mdb-card-title class="text-center">Reacciones</mdb-card-title>
                <mdb-btn size="sm" block v-show="verReac" color="primary" @click="verReac = false; actualizaDibujo()"><mdb-icon icon="eye-slash" class="mr-1"/> Ocultar reacciones</mdb-btn>
                <mdb-btn size="sm" block v-show="!verReac" color="default" @click="verReac = true; actualizaDibujo()"><mdb-icon far icon="eye" class="mr-1"/> Mostrar reaciones</mdb-btn>
                <katex-element v-for="(reaccion, i) in reacciones" :key="'reac'+i" :expression="reaccion" :throwOnError="false" :display-mode="true"/>
            </mdb-container>
        </template>
    </mdb-tabs>

    <!-- Leyenda -->
    <mdb-modal side removeBackdrop position="right" fullHeight direction="right" :show="leyenda" @close="leyenda = false">
        <mdb-modal-header>
            <mdb-modal-title>Leyenda</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            Los iconos de los dibujos pueden no coincidir con los vistos en clase. Los significados de los distintos iconos aparecen en la siguiente tabla:
            <div class="container overflow-auto my-3">
                <mdb-tbl sm>
                    <mdb-tbl-head>
                        <tr>
                            <th>Icono</th>
                            <th>Tipo de soporte</th>
                        </tr>
                    </mdb-tbl-head>
                    <mdb-tbl-body>
                        <tr v-for="(foto, i) in fotosLeyenda" :key="'foto'+i">
                            <td class="align-middle">
                                <img :src="require('@/assets/img/leyendaMatriz/'+foto.img)" :alt="'Figura '+(i+1)" class='img-fluid my-2' style="max-height: 200px">
                            </td>
                            <td class="align-middle">{{foto.tipo}}</td>
                        </tr>
                    </mdb-tbl-body>
                </mdb-tbl>
            </div>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn block color="secondary" @click.native="leyenda = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <!-- Modal para matrices -->
    <mdb-modal side position="top" fullHeight direction="top" style="width: 100%" :show="verMatriz" @close="verMatriz = false">
        <mdb-modal-header>
            <mdb-modal-title>Matriz amplada</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            <div class="overflow-auto">
                <katex-element :expression="matrizSelecionada" :throwOnError="false" :display-mode="true"/>
            </div>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn size="sm" color="secondary" @click.native="verMatriz = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>
</div>
</template>

<script>
import { mdbContainer, mdbCardTitle, mdbInput,
         mdbRow, mdbCol, mdbCard, mdbCardBody,
         mdbBtn, mdbIcon, mdbTbl, mdbTblHead, 
         mdbTblBody, mdbTabs, mdbModal, mdbModalHeader,
         mdbModalTitle, mdbModalBody, mdbModalFooter,
         } from 'mdbvue';
import 'katex/dist/katex.min.css';
import { ejMatriz, limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { cargaDatos, cargaMateriales, cargaSecciones, cargaNodos, cargaBc,
         cargaBarras, cargaCargas, matricesLocales, matricesGlobales, matricesCambioBase,
         getKtot, getKred, getDvtot, getReacciones } from '@/assets/js/matriz/calculoMatrices.js';
import * as dibujo from '@/assets/js/matriz/dibujado.js';
export default {
    name: "EjercicioViga",
    data(){
        return {
            datos: ejMatriz,
            editBarras: false,
            cambio: false,
            editar: true,
            localK: [],
            globalK: [],
            C: [],
            Ktot: '',
            Kred: '',
            desplazamiento: [],
            reacciones: [],
            verDesp: false,
            verReac: false,
            leyenda: false,
            fotosLeyenda: [
                {img: 'movilHorizontal.png', tipo: 'Carrito horizontal'},
                {img: 'movilVertical.png', tipo: 'Carrito vertical'},
                {img: 'fijo.png', tipo: 'Apoyo fijo articulado'},
                {img: 'rollHorizontal.png', tipo: 'Empotramiento deslizante horizontal'},
                {img: 'rollVertical.png', tipo: 'Empotramiento deslizante vertical'},
                {img: 'codo.png', tipo: 'Bloqueo de giros'},
                {img: 'cuadrado.png', tipo: 'Empotramiento'},
            ],
            verMatriz: false,
            matrizSelecionada: '',
            factor: 1
        };
    },
    components:{
        mdbContainer, mdbCardTitle, mdbInput,
        mdbRow, mdbCol, mdbCard, mdbCardBody,
        mdbBtn, mdbIcon, mdbTbl, mdbTblHead, 
        mdbTblBody, mdbTabs, mdbModal, mdbModalHeader,
        mdbModalTitle, mdbModalBody, mdbModalFooter,
    },
    methods:{
        cambiaMaterial(){
            cargaMateriales(this.datos.materiales);
            this.cambio = true;
            this.calculaMatrices();
            this.cambio = false;
        },
        cambiaSeccion(){
            cargaSecciones(this.datos.secciones);
            this.cambio = true;
            this.calculaMatrices();
            this.cambio = false;
        },
        cambiaBc(){
            this.cambio = true;
            cargaBc(this.datos.bc);
            this.actualizaDibujo();
            this.cambio = true;
            this.calculaMatrices();
            this.cambio = false;
        },
        cambiaBarras(i){
            this.cambio = true;
            this.editBarras = true;
            let nodo1 = this.datos.barras[i][1];
            this.datos.barras[i][1] = this.datos.barras[i][2];
            this.datos.barras[i][2] = nodo1;
            this.editBarras = false;
            cargaBarras(this.datos.barras);
            this.calculaMatrices();
            this.actualizaDibujo();
        },
        cambiaNodos(){
            this.cambio = true;
            cargaNodos(this.datos.nodos);
            this.calculaMatrices();
            this.actualizaDibujo();
        },
        cambiaCargas(){
            this.cambio = true;
            cargaCargas(this.datos.cargas);
            this.calculaMatrices();
            this.actualizaDibujo();
        },
        actualizaDibujo(){
            dibujo.calculaDimensiones(this.datos.nodos);
            dibujo.limpiarTodo();
            dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
            if(this.verDesp) dibujo.dibujaDesplazamientos(this.datos.nodos, this.factor);
            if(this.verReac) dibujo.dibujaReacciones();
            this.cambio = false;
        },
        calculaMatrices(){
            this.localK.splice(0, this.localK.length, ...matricesLocales(this.datos.barras));
            this.globalK.splice(0, this.globalK.length, ...matricesGlobales(this.datos.barras));
            this.C.splice(0, this.C.length, ...matricesCambioBase(this.datos.barras));
            this.Ktot = getKtot();
            this.Kred = getKred();
            this.desplazamiento = getDvtot();
            this.reacciones = getReacciones();
        }
    },
    mounted() {
        cargaDatos(this.datos);
        dibujo.vincularCanvas(this.$refs.dibujo);
        window.addEventListener('resize', () => {
            dibujo.resizeCanvas(this.$refs.dibujo);
            dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
        });
        dibujo.calculaDimensiones(this.datos.nodos);
        dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
        this.calculaMatrices();
    },
    beforeDestroy(){
        window.removeEventListener('resize', () => {
            dibujo.resizeCanvas(this.$refs.dibujo);
            dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
        });
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