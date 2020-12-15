<template>
<div v-on:keydown.capture="mapear">
    <mdb-row class="justify-content-between">
        <mdb-col col="auto">
            <mdb-btn color="elegant" icon="bold  fa-lg" class="px-3" @click="enunciado += '<b>Texto</b>'"/>
            <mdb-btn color="elegant" icon="italic  fa-lg" class="px-3" @click="enunciado += '<i>Texto</i>'"/>
            <mdb-btn color="elegant" icon="underline  fa-lg" class="px-3" @click="enunciado += '<u>Texto</u>'"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="light" icon="subscript  fa-lg" class="px-3" @click="enunciado += '<sub>Texto</sub>'"/>
            <mdb-btn color="light" icon="superscript  fa-lg" class="px-3" @click="enunciado += '<sup>Texto</sup>'"/>
            <mdb-btn color="light" icon="list-ul  fa-lg" class="px-3" @click="enunciado += '<ul>\n<li>Elemento</li>\n</ul>'"/>
            <mdb-btn color="light" icon="list-ol  fa-lg" class="px-3" @click="enunciado += '<ol>\n<li>Elemento</li>\n</ol>'"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="secondary" icon="image fa-lg" class="px-3" @click="enunciado += `<img src='URL_DE_LA_IMAGEN' alt='Figura 1' class='img-fluid my-2'>`"/>
            <mdb-btn color="secondary" icon="film fa-lg" class="px-3" @click="video=true"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="danger" icon="trash  fa-lg" @click="enunciado = ''"/>
            <mdb-btn color="info" icon="question-circle  fa-lg" class="px-3" @click="modal = true"/>
        </mdb-col>
    </mdb-row>
    <!-- Ayuda -->
    <mdb-modal :show="modal" @close="modal = false">
        <mdb-modal-header>
            <mdb-modal-title><mdb-icon icon="info" class="mr-2"/>Ayuda</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            Para ayudar en el uso del editor se han proporciodado elementos que se suelen emplear a menudo en la escritura, como poner el texto en negrita, cursiva, etc. <br/>
            Ademas de presionando el boton correspondiente se han proporcionado los siguientes atajos de teclado:
            <ul>
                <li>Ctrl + b : <b>Negrita</b></li>
                <li>Ctrl + i : <i>Cursiva</i></li>
                <li>Ctrl + u : <i>Subrayado</i></li>
            </ul>
            Todas las ayudas añadiran el al final del texto ya introducido un texto de ejemplo con el elemento seleccionado.
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="danger" @click.native="modal = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <!-- Video -->
    <mdb-modal size="lg" :show="video" @close="video = false" scrollable>
        <mdb-modal-header>
            <mdb-modal-title><mdb-icon icon="info" class="mr-2"/>Ayuda</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            Para insertar un video de YouTube hay que ir a la pagina del video deseado, hacer click en compartir y seleccionar la opción insertar. 
            <img :src="require('@/assets/img/ejemploVideo/videoPaso1.png')" class="img-fluid" alt='Explicación 1 vídeo'>
            <img :src="require('@/assets/img/ejemploVideo/videoPaso2.png')" class="img-fluid my-2" alt='Explicación 2 vídeo'><br/>
            Una vez listo copia el <i>iframe</i> resultante y pegalo en el editor para que aparezca.
            <img :src="require('@/assets/img/ejemploVideo/videoPaso3.png')" class="img-fluid" alt='Explicación 3 vídeo'>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="danger" @click.native="video = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <mdb-input type="textarea" label="Enunciado en HTML" outline inputClass="z-depth-1 p-3" 
                v-model="enunciado" width="100%" :rows="5" @change="vistaPrevia" 
                @keyup.enter.native="enunciado += '<br/>\n'"
                @keyup.ctrl.b.native="enunciado += '<b>Texto</b>'"
                @keyup.ctrl.i.native="enunciado += '<i>Texto</i>'"
                @keyup.ctrl.u.native="enunciado += '<u>Texto</u>'"
            />
    <mdb-btn block color="default" size="sm" @click.native="previa">
        <mdb-icon v-if="!vprevia" icon="eye fa-lg" class="mr-2"/>
        <mdb-icon v-if="vprevia" icon="eye-slash fa-lg" class="mr-2"/>
        Vista previa</mdb-btn>

    <div v-show="vprevia">
        <mdb-card class="z-depth-0" style="border: 1px solid rgb(211,211,211)">
            <mdb-card-body ref="previa"></mdb-card-body>
        </mdb-card>
    </div>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbInput, mdbIcon,
        mdbRow, mdbCol, mdbBtn, mdbModal, mdbModalHeader, 
        mdbModalTitle, mdbModalBody, mdbModalFooter } from 'mdbvue';
export default {
    name: 'editorTexto',
    components: {
       mdbCard, mdbCardBody, mdbInput, mdbIcon,
       mdbRow, mdbCol, mdbBtn, mdbModal, mdbModalHeader,
       mdbModalTitle, mdbModalBody, mdbModalFooter,
    },
    data(){
        return{
            enunciado: '',
            ctrl: false,
            modal: false,
            video: false,
            vprevia: false
        }
    },
    methods:{
        mapear(event){
            switch(event.key){
                case 'Control':
                    this.ctrl = true;
                    break;
                case 'b':
                case 'l':
                case 'u':
                    if(this.ctrl){
                        this.ctrl = false;
                        event.preventDefault();
                    }
                    break;
                case 'Enter':
                    event.preventDefault();
                    break;
                default:
                    this.ctrl = false;
            }
        },
        vistaPrevia(){
            if(this.vprevia)
                this.$refs.previa.$el.innerHTML = this.enunciado;
        },
        previa(){
            this.vprevia = !this.vprevia;
            this.vistaPrevia();
        }
    }
}
</script>

<style>
textarea {
    resize: vertical;
}
</style>