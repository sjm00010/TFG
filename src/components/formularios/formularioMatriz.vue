<template>
<div>
    <mdb-card>
        <mdb-card-body>
            <mdb-card-title>Datos del ejercicio</mdb-card-title>
            <mdb-card-text>Introduce los datos requeridos. Cuando los hayas introducido verificalos para continuar, si todos los datos han sido verificados se habilitará la opción de crear ejercicio.</mdb-card-text>
            <h4 class="text-center"><small class="text-muted">DIFICULTAD</small></h4>
            <mdb-card-text class="text-center">Seleccione una dificultad:</mdb-card-text>
            <select class="browser-default custom-select" v-model="dificultad">
                <option selected value="undefined">Selecciona una dificultad</option>
                <option :value="1">Fácil</option>
                <option :value="2">Normal</option>
                <option :value="3">Difícil</option>
            </select>
            <enunciado/>
            <h4 class="text-center mt-3"><small class="text-muted">DATOS</small></h4>
            <mdb-card-text>Introduzca el número de materiales, secciones y nodos para el ejercicio, tras introducirlos pulse en cualquier lugar 
                fuera de la entrada del dato para actualizar la interfaz. Una vez introducidos todos los datos pulse el botón <i>Verificar datos</i>
                para continuar con la creación del ejercicio.
            </mdb-card-text>
            <p class="text-center h4">Materiales</p>
            <mdb-input type="number" label="Número de materiales" :min="0" :step="1" v-model="numMateriales" @blur="crearMateriales"/>
            <p v-show="materiales.length > 0" class="h5">Módulos elásticos de los materiales (en kN/m<sup>2</sup>)</p>
            <div class="md-form input-group" v-for="(material, i) in materiales" :key="'M'+i">
                <div class="input-group-prepend">
                    <span class="input-group-text md-addon"><b>E<sub>{{i+1}}</sub></b></span>
                </div>
                <input :ref="'MatMin'+i" type="number" min="0" step="1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="material[1].min" @input="verificado = false">
                <input :ref="'MatMax'+i" type="number" min="0" step="1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="material[1].max" @input="verificado = false">
                <input :ref="'MatVal'+i" type="number" min="0" step="1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="material[1].valor" @input="verificado = false">
            </div>
            <hr class="my-3"/>
            <p class="text-center h4">Secciones</p>
            <small class="text-muted">El ancho de la sección indica la dimensión perpendicular al plano de la estructura,
                 es decir, la dimensión paralela al eje de flexión.</small>
            <mdb-input type="number" label="Número de secciones" :min="0" :step="1" v-model="numSecciones" @blur="crearSecciones"/>
            <div v-for="(seccion, i) in secciones" :key="'S'+i">
                <p class="text-center h5"> Sección {{i+1}} (en m)</p>
                <div class="md-form input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text md-addon"><b>Ancho {{i+1}}</b></span>
                    </div>
                    <input :ref="'AnMin'+i" type="number" min="0" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="seccion[1].min" @input="verificado = false">
                    <input :ref="'AnMax'+i" type="number" min="0" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="seccion[1].max" @input="verificado = false">
                    <input :ref="'AnVal'+i" type="number" min="0" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="seccion[1].valor" @input="verificado = false">
                </div>
                <div class="md-form input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text md-addon"><b>Altura {{i+1}}</b></span>
                    </div>
                    <input :ref="'AlMin'+i" type="number" min="0" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="seccion[2].min" @input="verificado = false">
                    <input :ref="'AlMax'+i" type="number" min="0" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="seccion[2].max" @input="verificado = false">
                    <input :ref="'AlVal'+i" type="number" min="0" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="seccion[2].valor" @input="verificado = false">
                </div>
            </div>
            <hr class="my-3"/>
            <p class="text-center h4">Nodos</p>
            <mdb-input type="number" label="Número de nodos" :min="0" :step="1" v-model="numNodos" @blur="crearNodos"/>
            <p v-show="nodos.length > 0" class="h5">Coordenadas X e Y de los nodos (en m)</p>
            <div v-for="(nodo, i) in nodos" :key="'N'+i">
                <p class="text-center h5"> Nodo {{i+1}}</p>
                <div class="md-form input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text md-addon"><b>Coordenada X<sub>{{i+1}}</sub></b></span>
                    </div>
                    <input :ref="'Xmin'+i" type="number" min="0" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="nodo[1].min" @input="verificado = false">
                    <input :ref="'Xmax'+i" type="number" min="0" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="nodo[1].max" @input="verificado = false">
                    <input :ref="'Xval'+i" type="number" min="0" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="nodo[1].valor" @input="verificado = false">
                </div>
                <div class="md-form input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text md-addon"><b>Coordenada Y<sub>{{i+1}}</sub></b></span>
                    </div>
                    <input :ref="'Ymin'+i" type="number" min="0" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="nodo[2].min" @input="verificado = false">
                    <input :ref="'Ymax'+i" type="number" min="0" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="nodo[2].max" @input="verificado = false">
                    <input :ref="'Yval'+i" type="number" min="0" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="nodo[2].valor" @input="verificado = false">
                </div>
            </div>
            <mdb-btn v-if="!verificado" class="my-3" block color="light-green" @click="verificaDatos"><mdb-icon size="lg" icon="check"/> Verificar datos</mdb-btn>
            <hr class="my-3"/>
            <div v-if="verificado" class="mb-3 mt-4">
                <p class="h5">Datos de las barras</p>
                <mdb-input type="number" label="Número de barras" :min="0" :step="1" v-model="numBarras" @blur="crearBarras"/>
                <mdbRow class="my-3" v-for="(barra, q) in barras" :key="'B'+q">
                    <span class="mt-3 ml-3"><b>Barra <sub>{{q+1}}</sub></b></span>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="barra[1]">
                            <option selected :value="undefined" disabled>Nodo inicial</option>
                            <option v-for="(nodo, i) in nodos" :key="'ni'+i" :value="i+1">Nodo {{i+1}}</option>
                        </select>
                    </mdbCol>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="barra[2]">
                            <option selected :value="undefined" disabled>Nodo final</option>
                            <option v-for="(nodo, i) in nodos" :key="'nf'+i" :value="i+1">Nodo {{i+1}}</option>

                        </select>
                    </mdbCol>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="barra[3]">
                            <option selected :value="undefined" disabled>Material</option>
                            <option v-for="(material, i) in materiales" :key="'m'+i" :value="i+1">Material {{i+1}}</option>
                        </select>
                    </mdbCol>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="barra[4]">
                            <option selected :value="undefined" disabled>Sección</option>
                            <option v-for="(seccion, i) in secciones" :key="'s'+i" :value="i+1">Sección {{i+1}}</option>
                        </select>
                    </mdbCol>
                </mdbRow>
                <hr class="my-3"/>
                <p class="h5">Condiciones de contorno</p>
                <mdb-card-text>Seleccione los grados de libertad bloqueados para cada nodo:</mdb-card-text>
                <div class="my-2" v-for="(nodo, i) in bc" :key="'n'+i">
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
                <hr class="my-3"/>
                <p class="h5 mt-3">Datos de las cargas</p>
                <mdb-input type="number" label="Número de cargas" :min="0" :step="1" v-model="numCargas" @blur="crearCargas"/>
                <mdbRow class="my-3" v-for="(carga, i) in cargas" :key="'C'+i">
                    <span class="mt-3 ml-3"><b>Carga <sub>{{i+1}}</sub></b></span>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="carga[0]">
                            <option selected :value="undefined" disabled>Nodo</option>
                            <option v-for="(nodo, i) in nodos" :key="'num_nodo'+i" :value="i+1">Nodo {{i+1}}</option>
                        </select>
                    </mdbCol>
                    <mdbCol col="lg">
                        <select class="browser-default custom-select my-2" v-model="carga[1]">
                            <option selected :value="undefined" disabled>Tipo de carga</option>
                            <option selected :value="1" >Horizontal</option>
                            <option selected :value="2" >Vertical</option>
                            <option selected :value="3" >Momento</option>
                        </select>
                    </mdbCol>
                    <mdbCol col="lg" lg="12">
                        <div class="md-form input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text md-addon"><b>Valor de la carga <sub>{{i+1}}</sub></b></span>
                            </div>
                            <input :ref="'CarMin'+i" type="number" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="carga[2].min">
                            <input :ref="'CarMax'+i" type="number" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="carga[2].max">
                            <input :ref="'CarVal'+i" type="number" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="carga[2].valor">
                        </div>
                    </mdbCol>
                </mdbRow>
            </div>
        </mdb-card-body>
    </mdb-card>
    <mdb-card class="my-3" v-if="verificado">
        <mdb-card-body>
            <mdb-btn block v-show="!dibujar && !cargando" color="dark-green" @click="dibujaVistaPrevia"><mdb-icon icon="eye" class="mr-1"/> Vista previa</mdb-btn>
            <mdb-btn block v-show="dibujar && !cargando" color="dark-green" @click="dibujaVistaPrevia" class="my-2"><mdb-icon far icon="redo" class="mr-1"/> Actualizar vista previa</mdb-btn>
            <mdb-btn block v-show="dibujar && !cargando" color="blue-grey" @click="dibujar = false"><mdb-icon far icon="eye-slash" class="mr-1"/> Ocultar vista previa</mdb-btn>
            <div v-if="cargando" class="d-flex justify-content-center my-5">
                <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;" />
            </div>
            <div v-if="dibujar" class="mt-4" ref="dibujo">
                <canvas id="dibujo" style="border: 1px solid rgb(211,211,211)"></canvas>
            </div>
        </mdb-card-body>
    </mdb-card>
    <mdb-btn v-if="!modificando && verificado" class="my-3" block color="default" @click="crear"><mdb-icon size="lg" icon="plus"/> Crear</mdb-btn>
    <mdb-btn v-if="modificando && verificado" class="my-3" block color="unique" @click="modificar"><mdb-icon size="lg" icon="sync-alt"/> Modificar</mdb-btn>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbInput, mdbBtn, mdbIcon, mdbRow, mdbCol,
         } from 'mdbvue';
import enunciado from '@/components/editor/enunciado';
import { cargaEjercicio } from '@/assets/js/auxiliares/ejercicio.js';
import { ejercicio, ejMatriz } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { compruebaDatosBasicos, compruebaValoresSeleccionados } from '@/assets/js/matriz/funAuxFormulario.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';
import * as dibujo from '@/assets/js/matriz/dibujado.js';
export default {
    name: 'formularioMatriz',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbBtn, mdbIcon, mdbRow, mdbCol,
       enunciado
    },
    props:{
        modificando: Boolean
    },
    data(){
        return{
            dificultad: ejMatriz.dificultad,
            numMateriales: ejMatriz.materiales.length || undefined,
            materiales: ejMatriz.materiales,
            numSecciones: ejMatriz.secciones.length || undefined,
            secciones: ejMatriz.secciones,
            numNodos: ejMatriz.nodos.length || undefined,
            nodos: ejMatriz.nodos,
            numBarras: ejMatriz.barras.length || undefined,
            barras: ejMatriz.barras,
            bc: ejMatriz.bc,
            numCargas: ejMatriz.cargas.length || undefined,
            cargas: ejMatriz.cargas,
            verificado: ejMatriz.materiales.length > 0 ? true : false,
            dibujar: false,
            cargando: false
        }
    },
    methods:{
        crearMateriales(){
            this.verificado = false;
            this.dibujar = false;
            this.materiales.splice(0);
            for (let i = 0; i < this.numMateriales; i++)
                this.materiales.push([i+1, {min: undefined, max: undefined, valor: undefined}, 0.3]);       
        },
        crearSecciones(){
            this.verificado = false;
            this.dibujar = false;
            this.secciones.splice(0);
            for (let i = 0; i < this.numSecciones; i++)
                this.secciones.push([i+1, {min: undefined, max: undefined, valor: undefined}, {min: undefined, max: undefined, valor: undefined}]);         
        },
        crearNodos(){
            this.verificado = false;
            this.dibujar = false;
            this.nodos.splice(0);
            this.bc.splice(0);
            for (let i = 0; i < this.numNodos; i++){
                this.nodos.push([i+1, {min: undefined, max: undefined, valor: undefined}, {min: undefined, max: undefined, valor: undefined}]);
                this.bc.push([i+1, false, false, false]);
            }       
        },
        crearBarras(){
            this.dibujar = false;
            this.barras.splice(0);
            for (let i = 0; i < this.numBarras; i++)
                this.barras.push([i+1, undefined, undefined, undefined, undefined]);         
        },
        crearCargas(){
            this.dibujar = false;
            this.cargas.splice(0);
            for (let i = 0; i < this.numCargas; i++)
                this.cargas.push([undefined, undefined, {min: undefined, max: undefined, valor: undefined}]);         
        },
        async dibujaVistaPrevia(){
            this.cargando = true;
            this.dibujar = false;
            if(this.verificar()){
                this.dibujar = true;
                this.toNumber();
                ejMatriz.dificultad = this.dificultad;
                ejMatriz.enunciado = ejercicio.enunciado;
                ejMatriz.ayuda = ejercicio.ayuda;
                ejMatriz.video = ejercicio.video;
                ejMatriz.materiales = this.materiales;
                ejMatriz.secciones = this.secciones;
                ejMatriz.nodos = this.nodos;
                ejMatriz.barras = this.barras;
                ejMatriz.bc = this.bc;
                ejMatriz.cargas = this.cargas;
                await new Promise(r => setTimeout(r, 2000));
                dibujo.vincularCanvas(this.$refs.dibujo);
                dibujo.calculaDimensiones(this.nodos);
                dibujo.dibujaNodos(this.barras, this.nodos, this.bc, this.cargas);
            }else{
                this.error('Error en los datos', 'Se deben facilitar primero todos los datos para poder visualizar la vista previa');
            }
            this.cargando = false;
        },
        verificaDatos(){
            if(this.numMateriales > 0 && this.numSecciones > 0 && this.numNodos > 0){
                let resultados = compruebaDatosBasicos(this.materiales, this.secciones, this.nodos);
                this.validaBasicos(resultados.errores, resultados.mensajes);
                if(resultados.errores.size === 0)
                    this.verificado = true;
                else
                    this.verificado = false;
                    this.dibujar = false;
            }else
            this.error('Error en los datos', 'Se debe introducir al menos 1 material, sección y nodo.');
        },
        validaBasicos(errores, mensajes){
            for (const [campo, value] of Object.entries(this.$refs)) {
                if(errores.has(campo)){
                    value[0].classList.remove('valid');
                    value[0].classList.add('invalid');
                }else if(campo !== 'dibujo' && value[0]){
                    value[0].classList.remove('invalid');
                    value[0].classList.add('valid');
                }
            }
            for(let mensaje of mensajes)
                this.error('Error en los datos', mensaje);
        },
        error(titulo, mensaje){
            this.$notify({
                group: 'log',
                title: '<i class="fas fa-2x fa-times"></i> <b class="h5">'+titulo+'</b>',
                text: '<i style="font-size:15px">'+mensaje+'</i>',
                duration: 7000,
                type: 'error'
            });
        },
        verificar(){
            this.verificaDatos();
            let resultado = compruebaValoresSeleccionados(this.barras, this.cargas);
            if (resultado.mensajes.size !== 0){
                this.validaBasicos(resultado.errores, resultado.mensajes);
                return false;
            }else if(this.verificado){
                return true;
            }
            return false;
        },
        toNumber(){
            this.materiales.forEach((material) => {
                material[1].min = parseFloat(material[1].min);
                material[1].max = parseFloat(material[1].max);
                material[1].valor = parseFloat(material[1].valor);
            });
            this.secciones.forEach((seccion) => {
                seccion[1].min = parseFloat(seccion[1].min);
                seccion[1].max = parseFloat(seccion[1].max);
                seccion[1].valor = parseFloat(seccion[1].valor);
                seccion[2].min = parseFloat(seccion[2].min);
                seccion[2].max = parseFloat(seccion[2].max);
                seccion[2].valor = parseFloat(seccion[2].valor);
            });
            this.nodos.forEach((nodo) => {
                nodo[1].min = parseFloat(nodo[1].min);
                nodo[1].max = parseFloat(nodo[1].max);
                nodo[1].valor = parseFloat(nodo[1].valor);
                nodo[2].min = parseFloat(nodo[2].min);
                nodo[2].max = parseFloat(nodo[2].max);
                nodo[2].valor = parseFloat(nodo[2].valor);
            });
            this.barras.forEach((barra) => {
                barra[1] = parseFloat(barra[1]);
                barra[2] = parseFloat(barra[2]);
                barra[3] = parseFloat(barra[3]);
                barra[4] = parseFloat(barra[4]);
            });
            this.cargas.forEach((carga) => {
                carga[0] = parseFloat(carga[0]);
                carga[1] = parseFloat(carga[1]);
                carga[2].min = parseFloat(carga[2].min);
                carga[2].max = parseFloat(carga[2].max);
                carga[2].valor = parseFloat(carga[2].valor);
            });
        },
        async crear(){
            if(this.verificar()){
                this.toNumber();
                ejMatriz.dificultad = this.dificultad;
                ejMatriz.enunciado = ejercicio.enunciado;
                ejMatriz.ayuda = ejercicio.ayuda;
                ejMatriz.video = ejercicio.video;
                ejMatriz.materiales = this.materiales;
                ejMatriz.secciones = this.secciones;
                ejMatriz.nodos = this.nodos;
                ejMatriz.barras = this.barras;
                ejMatriz.bc = this.bc;
                ejMatriz.cargas = this.cargas;

                const ej = JSON.stringify({...ejMatriz})
                                            .replace('_materiales', 'materiales')
                                            .replace('_secciones', 'secciones')
                                            .replace('_nodos', 'nodos')
                                            .replace('_barras', 'barras')
                                            .replace('_bc', 'bc')
                                            .replace('_cargas', 'cargas');

                const respuesta = await fetch(URL+'/ejercicio/matriz/', { 
                    headers: {'Content-Type': 'application/json', 
                            'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
                    },
                    method: 'POST',
                    body: ej
                });

                if(respuesta.ok){
                    // Devuelvo temporalmente a la lista de ejercicio, luego ira al ejercicio creado
                    this.$router.push('/ejercicios');
                }else{
                    this.$notify({
                        group: 'log',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h3">Error de creación</b>',
                        text: '<i style="font-size:15px"> No se pudo crear los ejercicios. Revise los datos.</i>',
                        duration: 5000,
                        type: 'error'
                    });
                }
            }
        },
        async modificar(){
            if(this.verificar()){
                this.toNumber();
                ejMatriz.dificultad = this.dificultad;
                ejMatriz.enunciado = ejercicio.enunciado;
                ejMatriz.ayuda = ejercicio.ayuda;
                ejMatriz.video = ejercicio.video;
                ejMatriz.materiales = this.materiales;
                ejMatriz.secciones = this.secciones;
                ejMatriz.nodos = this.nodos;
                ejMatriz.barras = this.barras;
                ejMatriz.bc = this.bc;
                ejMatriz.cargas = this.cargas;

                const ej = JSON.stringify({...ejMatriz})
                                            .replace('_materiales', 'materiales')
                                            .replace('_secciones', 'secciones')
                                            .replace('_nodos', 'nodos')
                                            .replace('_barras', 'barras')
                                            .replace('_bc', 'bc')
                                            .replace('_cargas', 'cargas');

                const respuesta = await fetch(URL+'/ejercicio/matriz/'+this.$route.params.id, { 
                    headers: {'Content-Type': 'application/json',
                            'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
                    },
                    method: 'PUT',
                    body: ej
                });

                if(respuesta.ok){
                    // Devuelvo temporalmente a la lista de ejercicio, luego ira al ejercicio creado
                    await cargaEjercicio('matriz');
                    this.$router.push('/ejercicios');
                }else{
                    this.$notify({
                        group: 'log',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h3">Error de creación</b>',
                        text: '<i style="font-size:15px"> No se pudo crear los ejercicios. Revise los datos.</i>',
                        duration: 5000,
                        type: 'error'
                    });
                }
            }
        },
        mounted() {
            window.addEventListener('resize', () => {
                dibujo.resizeCanvas(this.$refs.dibujo);
                if(this.dibujar) dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
            });
        },
        beforeDestroy(){
            window.removeEventListener('resize', () => {
                dibujo.resizeCanvas(this.$refs.dibujo);
                if(this.dibujar) dibujo.dibujaNodos(this.datos.barras, this.datos.nodos, this.datos.bc, this.datos.cargas);
            });
        }
    }
}
</script>

<style>
  .placement {
    position: fixed;
    right: 1rem;
    top: 1rem;
  }
</style>