<template>
    <mdb-card class="hoverable mb-2">
        <mdb-view :gradient="this.obtenerColor(this.dificultad)">
            <h2 class="card-header-title text-dark text-center mt-2">{{this.titulo}}</h2>
            <div class="text-center mb-2">
                <mdb-icon  v-for="n in parseInt(this.dificultad)" :key="n" icon="pencil-alt" />
            </div>
            
        </mdb-view>
        <mdb-card-body class="text-center">
            <mdb-card-text>{{this.descripcion}}</mdb-card-text>
            <hr/>
            <router-link tag="button" class="btn rounded elegant-color text-white" :to="this.enlace">Realizar</router-link>
        </mdb-card-body>
    </mdb-card>
</template>

<script>
	import { mdbCard, mdbCardBody, mdbCardText, mdbView, mdbIcon } from 'mdbvue';
	export default {
        name: 'tarjeta',
        props: {
            titulo: String,
            dificultad: String,
            descripcion: String,
            enlace: String
        },
		components: {
            mdbCard,
            mdbCardBody,
            mdbCardText,
            mdbView,
            mdbIcon
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
            }
        }
    }
</script>