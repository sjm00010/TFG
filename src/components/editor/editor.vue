<template>
<div>
    <mdb-card color="rgba-blue-slight" class="my-2">
    <mdb-row class="justify-content-between">
        <mdb-col col="auto">
            <mdb-btn color="elegant" icon="bold fa-lg" class="px-3" @click="insertar('b')"/>
            <mdb-btn color="elegant" icon="italic fa-lg" class="px-3" @click="insertar('i')"/>
            <mdb-btn color="elegant" icon="underline fa-lg" class="px-3" @click="insertar('u')"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="light" icon="subscript fa-lg" class="px-3" @click="insertar('sub')"/>
            <mdb-btn color="light" icon="superscript fa-lg" class="px-3" @click="insertar('sup')"/>
            <mdb-btn color="light" icon="list-ul  fa-lg" class="px-3" @click="insertar('ul')"/>
            <mdb-btn color="light" icon="list-ol  fa-lg" class="px-3" @click="insertar('ol')"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="secondary" icon="image fa-lg" class="px-3" @click="imagen"/>
        </mdb-col>
        <mdb-col col="auto">
            <mdb-btn color="danger" icon="trash  fa-lg" @click="insertar('del')"/>
            <mdb-btn color="info" icon="question-circle  fa-lg" class="px-3" @click="modal = true"/>
        </mdb-col>
    </mdb-row>
    </mdb-card>

    <!-- Ayuda -->
    <mdb-modal :show="modal" @close="modal = false">
        <mdb-modal-header>
            <mdb-modal-title><mdb-icon icon="info-circle" class="mr-2"/>Ayuda</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            Para ayudar a una redacción mas rápida se han proporcionado los siguientes atajos de teclado:
            <ul>
                <li>Ctrl + b : <b>Negrita</b></li>
                <li>Ctrl + i : <i>Cursiva</i></li>
                <li>Ctrl + u : <u>Subrayado</u></li>
            </ul>

            Si lo que quieres es cambiar de línea sin que se agregue al texto un salto de línea ( la etiqueta &lt;<i>br</i> /&gt; ), se puede ulizar <i>Ctrl + Enter</i>.
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="danger" @click.native="modal = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <div> <!-- Enunciado -->
        <textarea @input="actualizar" class="form-control z-depth-1 p-3 w-100" :rows="10" ref="textarea" 
                    placeholder="Escribe el texto en HTML"></textarea>
        <mdb-btn block color="default" size="sm" @click.native="previa">
            <mdb-icon v-if="!vprevia" icon="eye fa-lg" class="mr-2"/>
            <mdb-icon v-if="vprevia" icon="eye-slash fa-lg" class="mr-2"/>
            Vista previa</mdb-btn>
        <div v-show="vprevia" class="mt-3">
            <mdb-card class="z-depth-0" style="border: 1px solid rgb(211,211,211)">
                <mdb-card-body ref="previa"></mdb-card-body>
            </mdb-card>
        </div>
    </div>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbIcon,
        mdbRow, mdbCol, mdbBtn, mdbModal, mdbModalHeader,
        mdbModalTitle, mdbModalBody, mdbModalFooter } from 'mdbvue';
import {insertaCaracteres} from '@/assets/js/formulario/editor.js'
export default {
    name: 'editorTexto',
    components: {
       mdbCard, mdbCardBody, mdbIcon,
       mdbRow, mdbCol, mdbBtn, mdbModal, mdbModalHeader,
       mdbModalTitle, mdbModalBody, mdbModalFooter,
    },
    props:{
        nTexto: String
    },
    data(){
        return{
            ctrl: false,
            modal: false,
            vprevia: false
        }
    },
    methods:{
        previa(){
            this.vprevia = !this.vprevia;
            this.$refs.previa.$el.innerHTML = this.$refs.textarea.value;
        },
        actualizar(){
            this.$refs.previa.$el.innerHTML = this.$refs.textarea.value;
            this.$emit('actualiza', this.$refs.textarea.value);
        },
        insertar(meta){
            switch(meta){
                case 'b':
                    insertaCaracteres('<b>', '</b>', this.$refs.textarea);
                    break;
                case 'i':
                    insertaCaracteres('<i>', '</i>', this.$refs.textarea);
                    break;
                case 'u':
                    insertaCaracteres('<u>', '</u>', this.$refs.textarea);
                    break;
                case 'sub':
                    insertaCaracteres('<sub>', '</sub>', this.$refs.textarea);
                    break;
                case 'sup':
                    insertaCaracteres('<sup>', '</sup>', this.$refs.textarea);
                    break;
                case 'ol':
                    this.$refs.textarea.value += '\n<ol>\n<li>Elemento</li>\n</ol>';
                    break;
                case 'ul':
                    this.$refs.textarea.value += '\n<ul>\n<li>Elemento</li>\n</ul>';
                    break;
                case 'del':
                    this.$refs.textarea.value = '';
                    break;
            }
            this.actualizar();
        },
        imagen(){
            let url = prompt("Introduzca la URL de la imagen en Drive:");
            if(url !== null){
                url = url.match(/d\/(?<id>\w+)\//)?.groups.id;
                if (url) {
                    this.$refs.textarea.value += `<img src='https://drive.google.com/uc?export=view&id=${url}' alt='Figura 1' class='img-fluid my-2' style="max-height: 200px">`
                    this.actualizar();
                }else{
                    this.$notify({
                        group: 'app',
                        title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error en la URL</b>',
                        text: '<i style="font-size:15px"> La URL de la imagen no es válida, solo son compatibles los enlaces de Drive.</i>',
                        duration: 7000,
                        type: 'error'
                    });
                }
            }
        }
    },
    mounted(){
        if(this.nTexto !== '')
            this.$refs.textarea.value = this.nTexto;
        // Controles
        this.$refs.textarea.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'Control':
                    this.ctrl = true;
                    break;
                case 'b':
                    if(this.ctrl){
                        event.preventDefault();
                        insertaCaracteres('<b>', '</b>', this.$refs.textarea);
                    }
                    break;
                case 'i':
                    if(this.ctrl){
                        event.preventDefault();
                        insertaCaracteres('<i>', '</i>', this.$refs.textarea);
                    } 
                    break;
                case 'u':
                    if(this.ctrl){
                        event.preventDefault();
                        insertaCaracteres('<u>', '</u>', this.$refs.textarea);
                    }
                    break;
                case 'Enter':
                    if(!this.ctrl){
                        this.$refs.textarea.setRangeText('<br/>\n', this.$refs.textarea.selectionStart, this.$refs.textarea.selectionEnd, 'end');
                        event.preventDefault();
                    }else{
                        this.$refs.textarea.setRangeText('\n', this.$refs.textarea.selectionStart, this.$refs.textarea.selectionEnd, 'end');
                    }
                    break;
            }
        });
        this.$refs.textarea.addEventListener('keyup', (event) => {
            if(this.vprevia)
                this.$refs.previa.$el.innerHTML = this.$refs.textarea.value;

            if(event.key === 'Control')
                this.ctrl = false;
        });
    },
}
</script>

<style>
textarea {
    resize: vertical;
    overflow-y: scroll;
}
textarea::-webkit-scrollbar {
  width: 12px;
  background-color: #F5F5F5; }
textarea::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #4285F4; }
</style>