<template>
    <mdb-card class="hoverable mb-2">
        <mdb-view :gradient="this.obtenerColor(this.dificultad)">
            <h2 class="card-header-title text-dark text-center mt-2">Ejercicio {{this.id}}</h2>
            <div class="text-center mb-2">
                <mdb-icon  v-for="n in parseInt(this.dificultad)" :key="n" icon="pencil-alt" />
            </div>
            
        </mdb-view>
        <mdb-card-body class="text-center">
            <mdb-card-text>{{this.descripcion}}</mdb-card-text>
            <hr/>
            <router-link tag="button" class="btn btn-block elegant-color text-white" :to="this.enlace">Realizar</router-link>
            <mdb-btn block class="my-2" color="secondary" v-show="prof">Modificar</mdb-btn>
            <mdb-btn block class="my-2" color="danger" v-show="prof" @click="borrar">Borrar</mdb-btn>
        </mdb-card-body>
    </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbCardText, mdbView, mdbIcon, mdbBtn } from 'mdbvue';
import {profesor, getUser} from '@/assets/js/identificacion.js';

export default {
    name: 'tarjeta',
    props: {
        id: Number,
        dificultad: Number,
        descripcion: String,
        enlace: String,
        id_bd: String
    },
    components: {
        mdbCard, mdbCardBody, mdbCardText, mdbView, mdbIcon, mdbBtn
    },
    data(){
        return{
            prof: false
        }
    },
    methods:{
        obtenerColor(dificultad){
            switch(dificultad){
                case 1:
                    return "dusty-grass";
                case 2:
                    return "winter-neva";
                case 3:
                    return "warm-flame";
                default:
                    return "cloudy-knoxville";
            }
        },
        borrar(){
            this.$emit('borrar', this.id_bd);
        }
    },
    created(){
        getUser();
        this.prof = profesor;
    }
}
</script>