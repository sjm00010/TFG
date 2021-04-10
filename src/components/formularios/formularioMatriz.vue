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
            <div v-show="compTramos">
                <dibujar ref="dibujo"/>
                <formulas ref="formulas"/>
                <mdbRow class="my-3">
                    <mdbCol col="md">
                        <mdb-btn v-if="!previa" class="my-3" block color="secondary" @click="vistaPrevia"><mdb-icon size="lg" icon="pencil-alt"/> Vista previa de las gráficas</mdb-btn>
                        <mdb-btn v-if="previa" class="my-3" block color="secondary" @click="vistaPrevia"><mdb-icon size="lg" icon="edit"/> Actualizar gráficas</mdb-btn>
                    </mdbCol>
                    <mdbCol col="md" v-if="previa">
                        <mdb-btn class="my-3" block color="blue-grey" @click="previa = false"><mdb-icon size="lg" icon="eye-slash"/> Ocultar gráficas</mdb-btn>
                    </mdbCol>
                </mdbRow>
                <div v-if="previa">
                    <grafica :datos="this.datosGraficas.axiles" titulo="Esfuerzos axiles" color="rgb(41, 128, 185)" :invertida="false" unidad="kN" :precision="3"></grafica>
                    <grafica :datos="this.datosGraficas.cortantes" titulo="Esfuerzos cortantes" color="rgb(231, 76, 60)" :invertida="false" unidad="kN" :precision="3"></grafica>
                    <grafica :datos="this.datosGraficas.flectores" titulo="Momentos flectores" color="rgb(82, 190, 128)" :invertida="true" unidad="kN·m" :precision="3"></grafica>
                    <grafica :datos="this.datosGraficas.deformada" titulo="Deformada" color="rgb(128, 0, 128)" :invertida="false" unidad="mm" :precision="5"></grafica>
                </div>
            </div>
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
import { compruebaTramos, cargaEjercicio } from '@/assets/js/auxiliares/ejercicio.js';
import { ejercicio, ejMatriz } from '@/assets/js/auxiliares/ejercicioJSON.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';
export default {
    name: 'formularioMatriz',
    components: {
       mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbRow, mdbCol, mdbBtn, mdbIcon, 
       enunciado,
       dibujar,
       formulas,
       grafica
    },
    props:{
        modificando: Boolean
    },
    data(){
        return{
            dificultad: ejMatriz.dificultad,
            previa: false
        }
    },
    methods:{
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

            const respuesta = await fetch(URL+'/ejercicio/viga/', { 
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

            const respuesta = await fetch(URL+'/ejercicio/viga/'+this.$route.params.id, { 
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
        },
        verificar(){
            if(!this.$refs.formulas.verificar()){
                this.$notify({
                    group: 'log',
                    title: '<i class="fas fa-2x fa-times"></i> <b class="h3">Error al verificar las fórmulas</b>',
                    text: '<i style="font-size:15px"> Los datos de las formulas estan incompletos.</i>',
                    duration: 5000,
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        vistaPrevia(){
            if(this.verificar()){
                ejViga.tramos = this.tramos;
                ejViga.elementos = elementos;
                ejViga.formulas = this.$refs.formulas.formulas;
                ejViga.auxiliares = this.$refs.formulas.auxiliares;
                ejViga.E = this.$refs.formulas.E;
                ejViga.I = this.$refs.formulas.I;
                inicializar();
                let resultado = calcular(this.$refs.formulas.E);
                if(resultado){
                    this.datosGraficas.axiles.splice(0, this.datosGraficas.axiles.length, ...resultado.axiles);
                    this.datosGraficas.cortantes.splice(0, this.datosGraficas.cortantes.length, ...resultado.cortantes);
                    this.datosGraficas.flectores.splice(0, this.datosGraficas.flectores.length, ...resultado.flectores);
                    this.datosGraficas.deformada.splice(0, this.datosGraficas.deformada.length, ...resultado.deformada);
                    this.previa = true;
                }else{
                    this.$notify({
                        group: 'log',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al calcular los datos del ejercicio</b>',
                        text: '<i style="font-size:15px"> Ocurrio un problema al tratar de calcular los datos de las gráficas. Revise las fórmulas y compruebe que las variables son las correctas.</i>',
                        duration: 7000,
                        type: 'error'
                    });
                    this.previa = false;
                }
            }
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