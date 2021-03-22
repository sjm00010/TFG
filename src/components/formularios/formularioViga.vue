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
            <h4 class="text-center mt-3"><small class="text-muted">DATOS DE LOS TRAMOS</small></h4>
            <mdb-row>
                <mdb-col md="12">
                    <mdb-input type="number" label="Número de tramos" :min="0" :step="1" v-model="numTramos" @change="crearTramos"/>
                </mdb-col>
                <mdb-col md="12">
                    <mdb-card-text v-show="tramos.length > 0" class="text-center">Introduce el mínimo, el máximo y un valor por defecto para cada tramo.</mdb-card-text>
                    <div class="md-form input-group" v-for="(tramo, i) in tramos" :key="i">
                        <div class="input-group-prepend">
                            <span class="input-group-text md-addon"><b>Tramo {{i+1}}</b></span>
                        </div>
                        <input :ref="'min'+(i+1)" type="number" min="0.1" step="0.1" label="Mínimo" class="form-control" placeholder="Mínimo" v-model="tramo.min" @input="compTramos = false">
                        <input :ref="'max'+(i+1)" type="number" min="0.2" step="0.1" aria-label="Máximo" class="form-control" placeholder="Máximo" v-model="tramo.max" @input="compTramos = false">
                        <input :ref="'valor'+(i+1)" type="number" min="0.1" step="0.1" aria-label="Valor por defecto" class="form-control" placeholder="Valor por defecto" v-model="tramo.valor" @input="compTramos = false">
                    </div>
                </mdb-col>
            </mdb-row>
            <mdb-btn class="my-3" block color="light-green" @click="comprobarTramos"><mdb-icon size="lg" icon="check"/> Verificar</mdb-btn>
            <dibujar ref="dibujo" v-show="compTramos"/>
            <formulas ref="formulas" v-show="compTramos" />
        </mdb-card-body>
    </mdb-card>
    <mdb-btn v-if="compTramos && !modificando" class="my-3" block color="default" @click="crear"><mdb-icon size="lg" icon="plus"/> Crear</mdb-btn>
    <mdb-btn v-if="compTramos && modificando" class="my-3" block color="unique" @click="modificar"><mdb-icon size="lg" icon="sync-alt"/> Modificar</mdb-btn>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
        mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon,
         } from 'mdbvue';
import enunciado from '@/components/editor/enunciado';
import dibujar from '@/components/auxVigas/dibujaViga';
import formulas from '@/components/auxVigas/formulas';
import { vincularTramos, elementos } from '@/assets/js/vigas/variables.js';
import { compruebaTramos, cargaEjVigas } from '@/assets/js/auxiliares/ejercicio.js';
import { ejercicio, ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';
export default {
    name: 'formularioViga',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon, 
       enunciado,
       dibujar,
       formulas
    },
    props:{
        modificando: Boolean
    },
    data(){
        return{
            dificultad: ejViga.dificultad,
            numTramos: ejViga.tramos.length || undefined,
            tramos: ejViga.tramos,
            compTramos: ejViga.tramos.length > 0
        }
    },
    methods:{
        crearTramos(){
            this.compTramos = false;
            this.tramos.splice(0);
            for (let i = 0; i < this.numTramos; i++) {
                this.tramos.push({min: '', max: '', valor: ''});
            }
        },
        comprobarTramos(){
            if(this.tramos.length == 0){
                this.compTramos = false;
                this.$notify({
                    group: 'app',
                    title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Número de tramos invalido</b>',
                    text: '<i style="font-size:15px; text-align: center;"> Se debe introducir al menos 1 tramo para la viga.</i>',
                    duration: 7000,
                    type: 'warn'
                });
            }else{
                let error = compruebaTramos(this.tramos);
                for (const [campo, value] of Object.entries(this.$refs)) {
                    if(error.includes(campo)){
                        value[0].classList.remove('valid');
                        value[0].classList.add('invalid');
                    }else if(value[0]){
                        value[0].classList.remove('invalid');
                        value[0].classList.add('valid');
                    }
                }
                if(error.length != 0){
                    this.compTramos = false;
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error en los tramos</b>',
                        text: '<i style="font-size:15px"> Revisa el mínimo, el máximo y el valor por defecto de los tramos marcados en rojo.</i>',
                        duration: 7000,
                        type: 'error'
                    });
                }else{
                    this.compTramos = true;
                    setTimeout(() => { this.$refs.dibujo.actualiza(); }, 300);
                    setTimeout(() => { this.$refs.formulas.cargaTramos(this.tramos); }, 300);
                    vincularTramos(this.tramos);
                }
            }
        },
        async crear(){
            if(!this.verificar()) return;
            ejViga.dificultad = this.dificultad;
            ejViga.enunciado = ejercicio.enunciado;
            ejViga.ayuda = ejercicio.ayuda;
            ejViga.video = ejercicio.video;
            ejViga.tramos = this.tramos;
            ejViga.elementos = elementos;
            ejViga.formulas = this.$refs.formulas.formulas;
            ejViga.auxiliares = this.$refs.formulas.auxiliares;
            ejViga.E = this.$refs.formulas.E;
            ejViga.I = this.$refs.formulas.I;

            const ej = JSON.stringify({...ejViga})
                                            .replace('_tramos', 'tramos')
                                            .replace('_elementos', 'elementos')
                                            .replace('_formulas', 'formulas')
                                            .replace('_auxiliares', 'auxiliares');

            const respuesta = await fetch(URL+'/ejViga/', { 
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
            if(!this.verificar()) return;
            ejViga.dificultad = this.dificultad;
            ejViga.enunciado = ejercicio.enunciado;
            ejViga.ayuda = ejercicio.ayuda;
            ejViga.video = ejercicio.video;
            ejViga.tramos = this.tramos;
            ejViga.elementos = elementos;
            ejViga.formulas = this.$refs.formulas.formulas;
            ejViga.auxiliares = this.$refs.formulas.auxiliares;
            ejViga.E = this.$refs.formulas.E;
            ejViga.I = this.$refs.formulas.I;

            const ej = JSON.stringify({...ejViga})
                                            .replace('_tramos', 'tramos')
                                            .replace('_elementos', 'elementos')
                                            .replace('_formulas', 'formulas')
                                            .replace('_auxiliares', 'auxiliares');

            const respuesta = await fetch(URL+'/ejViga/'+this.$route.params.id, { 
                headers: {'Content-Type': 'application/json',
                          'Authorization': "Basic " + btoa(sessionStorage.getItem("user")+':'+sessionStorage.getItem("pass"))
                },
                method: 'PUT',
                body: ej
            });

            if(respuesta.ok){
                // Devuelvo temporalmente a la lista de ejercicio, luego ira al ejercicio creado
                await cargaEjVigas();
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
        verificar(){
            if(!this.$refs.formulas.verificar()){
                this.$notify({
                    group: 'log',
                    title: '<i class="fas fa-2x fa-times"></i> <b class="h3">Error en la deformada</b>',
                    text: '<i style="font-size:15px"> Se han proporcionado los datos para la deformada, pero estan incompletos.</i>',
                    duration: 5000,
                    type: 'error'
                });
                return false;
            }
            return true;
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