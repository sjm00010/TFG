<template>
<div>
    <h4 class="text-center"><small class="text-muted">DIBUJA LA FIGURA</small></h4>
    <mdb-card-text class="text-center">Dibuja la figura con los datos requeridos para que cambie cuando los alumnos ajusten los valores.</mdb-card-text>
    <mdb-row class="justify-content-center">
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="primary" ><mdb-icon size="lg" icon="plus"/> Punto de carga</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="amber" ><mdb-icon size="lg" icon="plus"/> Momento</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="dark-green" ><mdb-icon size="lg" icon="plus"/> Carga distribuida</mdb-btn>
        </mdb-col>
    </mdb-row>
    <mdb-row class="justify-content-center">
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="purple" ><mdb-icon size="lg" icon="plus"/> Normal</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="blue-grey"><mdb-icon size="lg" icon="plus"/> Soporte</mdb-btn>
        </mdb-col>
    </mdb-row>

    <div class="my-4" ref="editor">
        <canvas id="editor" style="border: 1px solid rgb(211,211,211)"></canvas>
    </div>
</div>
</template>

<script>
import { mdbCardText, mdbBtn, mdbIcon, mdbRow, mdbCol} from 'mdbvue';
export default {
    name: 'dibujar',
    components: {
        mdbCardText, mdbBtn, mdbIcon, mdbRow, mdbCol,
    },
}
</script>