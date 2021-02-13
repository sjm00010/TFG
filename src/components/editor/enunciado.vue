<template>
<div>
    <mdb-card class="card-body mb-3" >
        <mdb-card-text class="text-center">Selecciona el contenido que deseas añadir, las pestañas de explicación y vídeo son los apoyos al ejercicio.</mdb-card-text>
        <mdb-card-body class="pt-0">                
            <mdb-btn-group class="w-100">
                <mdb-btn color="primary" v-show="selecEnun" disabled class="mb-2" @click="selectEnun = false"><mdb-icon size="lg" icon="edit" /> Enunciado</mdb-btn>
                <mdb-btn color="primary" v-show="!selecEnun" class="mb-2" @click="selecEnun = true, selecVideo = false, selecExp = false"><mdb-icon size="lg" icon="edit" /> Enunciado</mdb-btn>
                <mdb-btn color="secondary" class="mb-2"  v-show="selecExp" disabled ><mdb-icon size="lg" icon="recycle" /> Explicación </mdb-btn>
                <mdb-btn color="secondary" class="mb-2" v-show="!selecExp" @click="selecExp = true, selecEnun = false, selecVideo = false"><mdb-icon size="lg" icon="recycle" /> Explicación </mdb-btn>
                <mdb-btn color="dark-green" class="mb-2" v-show="selecVideo" disabled><mdb-icon size="lg" icon="calculator" /> Vídeo</mdb-btn>
                <mdb-btn color="dark-green" class="mb-2" v-show="!selecVideo" @click="selecVideo = true, selecExp = false, selecEnun = false"><mdb-icon size="lg" icon="calculator" /> Vídeo</mdb-btn>                   
            </mdb-btn-group>
        </mdb-card-body>
        
        <div v-show="selecEnun"> <!-- Enunciado -->
            <editor @actualiza="actualizaEnunciado" :nTexto="enunciado" />
        </div>

        <div v-show="selecExp"> <!-- Explicación -->
            <editor @actualiza="actualizaExplicacion" :nTexto="explicacion" />
        </div>

        <div v-show="selecVideo"> <!-- Vídeo -->
            <mdb-input label="URL del vídeo" @input="actualizaVideo" v-model="video"/>
        </div>
    </mdb-card>
</div>
</template>

<script>
import {mdbCard, mdbCardBody, mdbIcon, mdbInput,
        mdbCardText, mdbBtn, mdbBtnGroup } from 'mdbvue';
import editor from '@/components/editor/editor';
import { ejViga } from '@/assets/js/ejercicioJSON.js';
export default {
    name: 'editorTexto',
    components: {
        mdbCard, mdbCardBody, mdbIcon, mdbInput,
        mdbCardText, mdbBtn, mdbBtnGroup,
        editor
    },
    data(){
        return{
            enunciado: ejViga.enunciado,
            explicacion: ejViga.ayuda,
            video: ejViga.video,
            selecEnun: true,
            selecExp: false,
            selecVideo: false,
            ctrl: false,
            modal: false,
            vprevia: false,
        }
    },
    methods:{
        actualizaEnunciado(texto){
            this.enunciado = texto;
            ejViga.enunciado = texto;
        },
        actualizaExplicacion(texto){
            this.explicacion = texto;
            ejViga.ayuda = texto;
        },
        actualizaVideo(e){
            ejViga.video = e;
        }
    }
}
</script>