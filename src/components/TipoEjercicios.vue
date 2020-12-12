<template>
    <mdb-jumbotron fluid :class="this.color">
        <mdb-container>
            <h2 class="display-4 text-center">{{this.titulo}}</h2>
        </mdb-container>
    </mdb-jumbotron>
</template>

<script>
    import { mdbJumbotron, mdbContainer } from 'mdbvue';
    export default {
        name: 'tipo',
        props: {
            titulo: String,
            color: String
        },
        components: {
            mdbJumbotron,
            mdbContainer
        }
    }
</script>