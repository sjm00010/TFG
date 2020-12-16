<template>
    <mdb-modal centered @close="limpia()" scrollable>
        <mdb-modal-header>
            <mdb-modal-title v-show="!this.mostrar.edicion">Añadir {{this.tipo}}</mdb-modal-title>
            <mdb-modal-title v-show="this.mostrar.edicion">Modificar {{this.tipo}}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            <!--------------------------------------- inputs --------------------------------------------------->
            
            <div v-show="!this.modal.soporte">
                <div v-show="this.modal.pCarga"> <!-- punto de carga -->
                    <p v-show="datos.magnitud !== ''">Sentido de la carga:</p>
                    <mdb-row class="justify-content-center">
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) > 0">
                            <img src="https://platform.skyciv.com/storage/images/beam/force_down.jpg"/>
                        </mdb-col>
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) < 0">
                            <img src="https://platform.skyciv.com/storage/images/beam/force_up.jpg"/>
                        </mdb-col>
                    </mdb-row>
                </div>

                <div v-show="this.modal.momento"><!-- momento -->
                    <p v-show="datos.magnitud !== ''">Sentido de la carga:</p>
                    <mdb-row class="justify-content-center" v-show="datos.magnitud !== ''">
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) > 0">
                            <img src="https://platform.skyciv.com/storage/images/beam/moment_neg.jpg"/>
                        </mdb-col>
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) < 0">
                            <img src="https://platform.skyciv.com/storage/images/beam/moment_pos.jpg"/>
                        </mdb-col>
                    </mdb-row>
                </div>

                <div v-show="this.modal.normal"><!-- normal -->
                    <p v-show="datos.magnitud !== ''">Sentido de la carga:</p>
                    <mdb-row class="justify-content-center" v-show="datos.magnitud !== ''">
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) < 0">
                            <mdb-icon size="3x" icon="long-arrow-alt-left" />
                        </mdb-col>
                        <mdb-col col="auto" v-show="datos.magnitud !== '' && parseFloat(datos.magnitud) > 0">
                            <mdb-icon size="3x" icon="long-arrow-alt-right" />
                        </mdb-col>
                    </mdb-row>
                </div>
                
                <p>Introduzca los datos de la carga requeridos:</p>
                <mdb-input label="Valor por defecto" class="mb-3" type="number" v-model="datos.magnitud" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
                <mdb-input label="Valor mínimo" class="mb-3 red-text" type="number" v-model="datos.min" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
                <mdb-input label="Valor máximo" class="mb-3" type="number" v-model="datos.max" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
            </div>

            <div v-show="this.modal.soporte"><!-- soporte -->
                <p>Seleccione el tipo de soporte:</p>
                <mdb-row class="justify-content-center">
                    <mdb-col col="4">
                        <input type="radio" name="tipo" id="fijo" value="simple" v-model="datos.tipo">
                        <label for="fijo"><img src="https://platform.skyciv.com/storage/images/beam/pin_support_diagram.gif"/></label>
                    </mdb-col>
                    <mdb-col col="4">
                        <input type="radio" name="tipo" id="movil" value="móvil" v-model="datos.tipo">
                        <label for="movil"><img src="https://platform.skyciv.com/storage/images/beam/roller_support_diagram.gif"/></label>
                    </mdb-col>
                    <mdb-col col="4">
                        <input type="radio" name="tipo" id="pared" value="fijo" v-model="datos.tipo">
                        <label for="pared"><img src="https://platform.skyciv.com/storage/images/beam/fixed_support_diagram.gif"/></label>
                    </mdb-col>
                </mdb-row>
            </div>

            <p>Seleccione el segmento al que está ligado (se dibujará al final, si desea pintarla en el 0 seleccione <i>inicio</i>):</p>
            <select class="browser-default custom-select my-2" v-model="datos.segmento">
                <option selected value=''>Seleccione uno...</option>
                <option value='0'>Inicio (0)</option>
                <option v-for="(tramo, i) in tramos" :key="i" :value="i+1">{{i+1}}</option>
            </select>

            <div v-show="this.modal.cDist"><!-- carga distribuida -->
                <select class="browser-default custom-select" v-model="datos.segmentoFinal">
                    <option selected value=''>Seleccione uno...</option>
                    <option value='inicio'>Inicio (0)</option>
                    <option v-for="(tramo, i) in tramos" :key="i" :value="i+1">{{i+1}}</option>
                </select>
            </div>

            <div v-show="this.modal.barra"><!-- barra -->
                <p class="mt-3">Introduzca los datos de la separación con la viga:</p>
                <mdb-input label="Valor por defecto" class="mb-3" type="number" v-model="datos.d" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
                <mdb-input label="Valor mínimo" class="mb-3 red-text" type="number" v-model="datos.minD" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
                <mdb-input label="Valor máximo" class="mb-3" type="number" v-model="datos.maxD" @keyup.enter.native="redirige">
                    <span class="input-group-text md-addon" slot="append"> kN</span>
                </mdb-input>
            </div>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn v-show="!this.mostrar.edicion" color="success" @click.native="add">Añadir</mdb-btn>
            <mdb-btn v-show="this.mostrar.edicion" color="info" @click.native="editar">Modificar</mdb-btn>
            <mdb-btn color="elegant" @click.native="limpia()">Cancelar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>
</template>

<script>
// import * as editor from '@/assets/js/vigas/funAuxiliares.js';
import { mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
         mdbModalFooter, mdbInput, mdbRow, mdbCol} from 'mdbvue';
import {numTramos, numBarras} from '@/assets/js/vigas/variables.js';
import * as aux from '@/assets/js/vigas/funAuxiliares.js';
export default {
    name: 'modal',
    model:{
        prop: 'mostrar',
        event: 'ocultar'
    },
    props: {
        mostrar:{
            type: Object,
            required: true
        },
        elemento:{
            type: Object
        },
    },
    components: {
        mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
        mdbModalFooter, mdbInput, mdbRow, mdbCol
    },
    data(){
        return {
            tipo: '',
            modal:{
                pCarga: false,
                momento: false,
                cDist: false,
                normal: false,
                soporte: false,
                barra: false
            },
            datos: {
                tipo: undefined, // Tipo de elemento
                segmento: '', // Indice tramo inicio
                segmentoFinal: '', // Indice tramo fin (Opcional)
                magnitud: '', // Magnitud del elemento por defecto
                min: '', // Valor mínimo de la magnitud
                max: '', // Valor máximo de la magnitud
                idBarra: '', // Nombre de la barra (Opcional)
                d: '', // Magnitud d para la barra (Opcional)
                minD: '', // Mínimo para d de la barra (Opcional)
                maxD: '', // Máximo para d de la barra (Opcional)
            },
            tramos: undefined
        };
    },
    methods:{
        visualiza(t){
            this.tramos = numTramos();
            this.tipo = t; // Asigno el tipo de modal
            this.modal.pCarga = t == 'Punto de carga';
            this.modal.momento = t == 'Momento';
            this.modal.cDist = t == 'Carga distribuida';
            this.modal.normal = t == 'Normal';
            this.modal.soporte = t == 'Soporte';
            this.modal.barra = t == 'Barra';
        },
        redirige(){
            if(this.mostrar.edicion)
                this.editar();
            else
                this.add();
        },
        add(){
            if(!this.verificaInputs()){
                let error;
                switch (this.tipo.toString()){
                    case 'Punto de carga':
                        error = aux.addPuntoCarga(parseInt(this.datos.segmento), 
                                    parseInt(this.datos.magnitud), parseInt(this.datos.min), 
                                    parseInt(this.datos.max));
                        break;
                    case 'Momento':
                        error = aux.addMomento(parseInt(this.datos.segmento), 
                                    parseInt(this.datos.magnitud), parseInt(this.datos.min), 
                                    parseInt(this.datos.max));
                        break;
                    case 'Carga distribuida':
                        error = aux.addCargaDistribuida(parseInt(this.datos.segmento), 
                                    parseInt(this.datos.segmentoFinal), parseInt(this.datos.magnitud),
                                    parseInt(this.datos.min), parseInt(this.datos.max));
                        break;
                    case 'Normal':
                        error = aux.addNormal(parseInt(this.datos.segmento), 
                                    parseInt(this.datos.magnitud), parseInt(this.datos.min), 
                                    parseInt(this.datos.max));
                        break;
                    case 'Barra':
                        error = aux.addBarra( 'H'+ numBarras(), parseInt(this.datos.segmento), 
                                    parseInt(this.datos.magnitud), parseInt(this.datos.min), 
                                    parseInt(this.datos.max), parseInt(this.datos.d),
                                    parseInt(this.datos.minD), parseInt(this.datos.maxD));
                        break;
                    case 'Soporte':
                        error = aux.addSoporte(this.datos.tipo , parseInt(this.datos.segmento));
                        break;
                }

                if(error !== undefined && error.existe)
                    this.$notify({
                            group: 'app',
                            title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en los datos</b>',
                            text: '<i style="font-size:15px; text-align: center;"> '+ error.texto +'</i>',
                            duration: 5000,
                            type: 'error'
                        });
                else
                    this.limpia();
            }
        },
        limpia(){
            this.$emit('ocultar', {visible: false, edicion: this.mostrar.edicion});
            this.datos.tipo= '',
            this.datos.segmento= '',
            this.datos.segmentoFinal= '',
            this.datos.magnitud= '', 
            this.datos.min= '',
            this.datos.max= '',
            this.datos.idBarra= '',
            this.datos.d= '',
            this.datos.minD= '',
            this.datos.maxD= ''
        },
        verificaInputs(){
            let error = false;
            if(this.tipo !== 'Soporte')
                if(this.datos.magnitud === '' || this.datos.min === '' || this.datos.max === ''){
                    this.$notify({
                            group: 'app',
                            title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en la carga</b>',
                            text: '<i style="font-size:15px; text-align: center;"> Se debe introducir los datos para la carga.</i>',
                            duration: 5000,
                            type: 'error'
                        });
                    error= true;
                }

            if(this.tipo === 'Soporte')
                if(this.datos.tipo === ''){
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en el tipo de soporte</b>',
                        text: '<i style="font-size:15px; text-align: center;"> Se debe seleccionar un tipo de soporte.</i>',
                        duration: 5000,
                        type: 'error'
                    });
                    error= true;
                }

            if(this.datos.segmento === ''){
                this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en el segmento</b>',
                        text: '<i style="font-size:15px; text-align: center;"> Se debe seleccionar un segmento.</i>',
                        duration: 5000,
                        type: 'error'
                    });
                error= true;
            }

            if (this.tipo === 'Carga distribuida'){
                if(this.datos.segmentoFinal === ''){
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en el segmento final</b>',
                        text: '<i style="font-size:15px; text-align: center;"> Se debe seleccionar un segmento final para la distribución de la carga.</i>',
                        duration: 5000,
                        type: 'error'
                    });
                    error= true;
                }
            }

            if (this.tipo === 'Barra'){
                if(this.datos.d === '' || this.datos.minD === '' || this.datos.maxD === ''){
                    this.$notify({
                            group: 'app',
                            title: '<i class="fas fa-lg fa-exclamation-triangle"></i> <b class="h5">Error en la carga</b>',
                            text: '<i style="font-size:15px; text-align: center;"> Se debe introducir los datos para la carga.</i>',
                            duration: 5000,
                            type: 'error'
                        });
                    error= true;
                }
            }
            return error;
        },
    }
}
</script>