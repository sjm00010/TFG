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
            <mdb-card-text>Seleccione los datos que se van a introducir:</mdb-card-text>
            <select class="browser-default custom-select" v-model="tipo">
                <option :value="1">Tipo 1 (&sigma;x, &sigma;y, &tau;xy)</option>
                <option :value="2">Tipo 2 (&sigma;1, &sigma;2, &alpha;)</option>
            </select>
            <mdbRow class="my-3">
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&beta;</span>
                        </div>
                        <input ref="B" type="number" min="0.1" step="0.1" max="360" label="β" class="form-control mb-3" placeholder="en grados(º)" v-model="datos.B">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">E</span>
                        </div>
                        <input ref="E" type="number" step="0.1"  label="E" class="form-control mb-3" placeholder="en MPa" v-model="datos.E">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon"><i>v</i></span>
                        </div>
                        <input ref="v" type="number" step="0.1" label="v" class="form-control mb-3" placeholder="en MPa" v-model="datos.v">
                    </div>
                </mdbCol>
            </mdbRow>
            
            <mdbRow class="my-2" v-if="tipo == 1">
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&sigma;<sub>x</sub></span>
                        </div>
                        <input ref="sx" type="number" step="0.1" label="σx" class="form-control mb-3" placeholder="en MPa" v-model="datos.sx">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&sigma;<sub>y</sub></span>
                        </div>
                        <input ref="sy" type="number" step="0.1" label="σy" class="form-control mb-3" placeholder="en MPa" v-model="datos.sy">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&tau;<sub>xy</sub></span>
                        </div>
                        <input ref="txy" type="number" step="0.1" label="τxy" class="form-control mb-3" placeholder="en MPa" v-model="datos.txy">
                    </div>
                </mdbCol>
            </mdbRow>

            <mdbRow class="my-2" v-if="tipo == 2">
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&sigma;<sub>1</sub></span>
                        </div>
                        <input ref="s1" type="number" step="0.1" label="σ1" class="form-control mb-3" placeholder="en MPa" v-model="datos.s1">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&sigma;<sub>2</sub></span>
                        </div>
                        <input ref="s2" type="number" step="0.1" label="σ2" class="form-control mb-3" placeholder="en MPa" v-model="datos.s2">
                    </div>
                </mdbCol>
                <mdbCol col="md">
                    <div class="md-form input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon">&alpha;</span>
                        </div>
                        <input ref="a" type="number" min="0" max="360" step="0.1" label="α" class="form-control mb-3" placeholder="en grados(º)" v-model="datos.a">
                    </div>
                </mdbCol>
            </mdbRow>

            <mdbRow class="my-3">
                <mdbCol col="md">
                    <mdb-btn v-if="!dibujar" class="my-3" block color="secondary" @click="actualizaDatos"><mdb-icon size="lg" icon="pencil-alt"/> Dibujar</mdb-btn>
                    <mdb-btn v-if="dibujar" class="my-3" block color="secondary" @click="actualizaDatos"><mdb-icon size="lg" icon="edit"/> Actualizar dibujo</mdb-btn>
                </mdbCol>
                <mdbCol col="md" v-if="dibujar">
                    <mdb-btn class="my-3" block color="blue-grey" @click="dibujar = false"><mdb-icon size="lg" icon="eye-slash"/> Ocultar</mdb-btn>
                </mdbCol>
            </mdbRow>
            <small v-if="dibujar" class="text-muted"><mdb-icon icon="info-circle" /> Para circulos de radio menor que 10 no se representa el eje correctamente.</small>
            <dibujos ref="dibujo" v-if="dibujar" :datos="this.datos"/>
        </mdb-card-body>
    </mdb-card>
    <mdb-btn v-if="!modificando" class="my-3" block color="default" @click="comprobarCrear"><mdb-icon size="lg" icon="plus"/> Crear</mdb-btn>
    <mdb-btn v-if="modificando" class="my-3" block color="unique" @click="comprobarModificar"><mdb-icon size="lg" icon="sync-alt"/> Modificar</mdb-btn>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbBtn, mdbIcon, mdbRow, mdbCol
         } from 'mdbvue';
import enunciado from '@/components/editor/enunciado';
import dibujos from '@/components/visualizar/circulosMohr/dibujos';
import { ejercicio, ejMohr } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { cargaEjercicio } from '@/assets/js/auxiliares/ejercicio.js';
import * as cal from '@/assets/js/mohr/calculos.js';
import * as dib from '@/assets/js/mohr/dibujarCirculo.js';
import * as cua from '@/assets/js/mohr/dibujarCuadrado.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';
export default {
    name: 'formularioViga',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbBtn, mdbIcon, mdbRow, mdbCol,
       enunciado, dibujos
    },
    props:{
        modificando: Boolean
    },
    data(){
        return{
            dificultad: ejMohr.dificultad,
            tipo: !isNaN(ejMohr.s1) ? 2 : 1,
            datos: { sx: ejMohr.sx , sy: ejMohr.sy, txy: ejMohr.txy, B: ejMohr.B,
                     s1: ejMohr.s1, s2: ejMohr.s2, a: ejMohr.a, E: ejMohr.E, v: ejMohr.v},
            dibujar: false
        }
    },
    methods:{
        verificar(){
            let error = false;
            if(isNaN(this.datos.B)){
                this.$refs.B.classList.remove('valid');
                this.$refs.B.classList.add('invalid');
                this.error('Valor inválido', 'El valor de &beta; no es válido. Revise el campo.');
                error = true;
            }else{
                this.$refs.B.classList.remove('invalid');
                this.$refs.B.classList.add('valid');
            }
            if(isNaN(this.datos.E)){
                this.$refs.E.classList.remove('valid');
                this.$refs.E.classList.add('invalid');
                this.error('Valor inválido', 'El valor de E no es válido. Revise el campo.');
                error = true;
            }else{
                this.$refs.E.classList.remove('invalid');
                this.$refs.E.classList.add('valid');
            }
            if(isNaN(this.datos.v)){
                this.$refs.v.classList.remove('valid');
                this.$refs.v.classList.add('invalid');
                this.error('Valor inválido', 'El valor de <i>v<i> no es válido. Revise el campo.');
                error = true;
            }else{
                this.$refs.v.classList.remove('invalid');
                this.$refs.v.classList.add('valid');
            }

            if(this.tipo === 1){
                if(isNaN(this.datos.sx)){
                    this.$refs.sx.classList.remove('valid');
                    this.$refs.sx.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &sigma;<sub>x</sub> no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.sx.classList.remove('invalid');
                    this.$refs.sx.classList.add('valid');
                }
                if(isNaN(this.datos.sy)){
                    this.$refs.sy.classList.remove('valid');
                    this.$refs.sy.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &sigma;<sub>y</sub> no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.sy.classList.remove('invalid');
                    this.$refs.sy.classList.add('valid');
                }
                if(isNaN(this.datos.txy)){
                    this.$refs.txy.classList.remove('valid');
                    this.$refs.txy.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &tau;<sub>xy</sub> no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.txy.classList.remove('invalid');
                    this.$refs.txy.classList.add('valid');
                }
            }else{
                if(isNaN(this.datos.s1)){
                    this.$refs.s1.classList.remove('valid');
                    this.$refs.s1.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &sigma;<sub>1</sub> no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.s1.classList.remove('invalid');
                    this.$refs.s1.classList.add('valid');
                }
                if(isNaN(this.datos.s2)){
                    this.$refs.s2.classList.remove('valid');
                    this.$refs.s2.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &sigma;<sub>2</sub> no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.s2.classList.remove('invalid');
                    this.$refs.s2.classList.add('valid');
                }
                if(isNaN(this.datos.a)){
                    this.$refs.a.classList.remove('valid');
                    this.$refs.a.classList.add('invalid');
                    this.error('Valor inválido', 'El valor de &alpha; no es válido. Revise el campo.');
                    error = true;
                }else{
                    this.$refs.a.classList.remove('invalid');
                    this.$refs.a.classList.add('valid');
                }
            }

            return error;
        },
        error(titulo, mensaje){
            this.$notify({
                group: 'app',
                title: '<i class="fas fa-lg fa-times"></i> <b class="h5"> '+titulo+'</b>',
                text: '<i style="font-size:15px; text-align: center;">'+mensaje+'</i>',
                duration: 7000,
                type: 'error'
            });
        },
        comprobarCrear(){
            this.toNumber();
            if(!this.verificar()){
                this.crear();
            }
        },
        comprobarModificar(){
            this.toNumber();
            if(!this.verificar()){
                this.modificar();
            }
        },
        toNumber(){
            this.datos.B = parseFloat(this.datos.B);
            this.datos.E = parseFloat(this.datos.E);
            this.datos.v = parseFloat(this.datos.v);
            if(this.tipo === 1){
                this.datos.sx = parseFloat(this.datos.sx);
                this.datos.sy = parseFloat(this.datos.sy);
                this.datos.txy = parseFloat(this.datos.txy);
                this.datos.s1 = undefined;
                this.datos.s2 = undefined;
                this.datos.a = undefined;
            }else{
                this.datos.s1 = parseFloat(this.datos.s1);
                this.datos.s2 = parseFloat(this.datos.s2);
                this.datos.a = parseFloat(this.datos.a);
                this.datos.sx = undefined;
                this.datos.sy = undefined;
                this.datos.txy = undefined;
            }
        },
        actualizaDatos(){
            if(!this.verificar()){
                this.dibujar = false;
                this.toNumber();
                cal.actualizaDatos(this.datos);
                cal.calcular();
                this.dibujar = true;
                dib.dibujarEjes(this.datos);
                dib.calculaPlano();
                cua.dibujaCuadradoRotado(this.datos.B);
            }else{
                this.error('Error al dibujar','Hubo un error al verificar los datos, por favor revíselos y compruebe que estan correctos.')
            }
        },
        async crear(){
            ejMohr.dificultad = this.dificultad;
            ejMohr.enunciado = ejercicio.enunciado;
            ejMohr.ayuda = ejercicio.ayuda;
            ejMohr.video = ejercicio.video;
            ejMohr.sx = this.datos.sx;
            ejMohr.sy = this.datos.sy;
            ejMohr.txy = this.datos.txy;
            ejMohr.s1 = this.datos.s1;
            ejMohr.s2 = this.datos.s2;
            ejMohr.a = this.datos.a;
            ejMohr.B = this.datos.B;
            ejMohr.E = this.datos.E;
            ejMohr.v = this.datos.v;

            const ej = JSON.stringify({...ejMohr});

            const respuesta = await fetch(URL+'/ejercicio/mohr/', { 
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
        },
        async modificar(){
            ejMohr.dificultad = this.dificultad;
            ejMohr.enunciado = ejercicio.enunciado;
            ejMohr.ayuda = ejercicio.ayuda;
            ejMohr.video = ejercicio.video;
            ejMohr.sx = this.datos.sx;
            ejMohr.sy = this.datos.sy;
            ejMohr.txy = this.datos.txy;
            ejMohr.s1 = this.datos.s1;
            ejMohr.s2 = this.datos.s2;
            ejMohr.a = this.datos.a;
            ejMohr.B = this.datos.B;
            ejMohr.E = this.datos.E;
            ejMohr.v = this.datos.v;

            const ej = JSON.stringify({...ejMohr});

            const respuesta = await fetch(URL+'/ejercicio/mohr/'+this.$route.params.id, { 
                headers: {'Content-Type': 'application/json',
                          'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
                },
                method: 'PUT',
                body: ej
            });

            if(respuesta.ok){
                // Devuelvo temporalmente a la lista de ejercicio, luego ira al ejercicio creado
                await cargaEjercicio('mohr');
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
    }
}
</script>