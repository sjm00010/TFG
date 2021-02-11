<template>
<mdb-container class="my-4">
    <!-- Jumbotron con el enunciado del problema -->
    <mdb-jumbotron class="mb-0 text-center">
        <mdb-card-title class="pb-2 h4"><strong>Ejercicio {{num}}</strong></mdb-card-title>
        <p class="card-text">{{ejercicio.enunciado}}</p>
        <!-- <mdb-row class="justify-content-center">
            <mdb-col col="md" class="my-2">
                <mdb-btn block color="elegant" @click.native="modal1 = true"><mdb-icon class="align-middle" size="2x" icon="journal-whills" /> Explicación</mdb-btn>
            </mdb-col>
            <mdb-col col="md" class="my-2">
                <mdb-btn block color="secondary" @click.native="modal2 = true"><mdb-icon class="align-middle" fab size="2x" icon="youtube" /> Vídeo explicativo</mdb-btn>
            </mdb-col>
        </mdb-row> -->
    </mdb-jumbotron>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbJumbotron, mdbCardTitle} from 'mdbvue';
export default {
    name: "EjercicioViga",
    props: {
        ejercicio:{
            type: Object,
            required: true
        },
        num: {
            type: Number,
            required: true
        },
    },
    components:{
        mdbContainer, mdbJumbotron, mdbCardTitle
    }
}
</script>