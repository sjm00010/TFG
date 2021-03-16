<template>
    <mdb-jumbotron fluid :class="this.color" class="py-3">
        <mdb-container>
            <h2 class="h1-responsive text-center"><b>{{this.titulo}}</b></h2>
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