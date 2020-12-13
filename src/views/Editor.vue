<template>
<mdb-container class="my-3">
    <mdb-card class="mb-3">
		<mdb-card-body>
			<mdb-card-title>Seleccionar tipo de ejercicio</mdb-card-title>
			<mdb-card-text>Selecciona un tipo de ejercicio de la lista para que aparezcan los datos requeridos para ese ejercicio.</mdb-card-text>
            <select class="browser-default custom-select custom-select-lg mb-3" v-model="tipo">
                <option value="" selected>Selecciona un tipo</option>
                <option value="Vigas">Vigas</option>
                <option value="Matrices">Matrices</option>
                <option value="Otro">Otro</option>
            </select>
		</mdb-card-body>
	</mdb-card>
    <mdb-card v-show="tipo == 'Vigas'">
        <mdb-card-body>
            <mdb-card-title>Datos del ejercicio</mdb-card-title>
            <mdb-card-text>Introduce los datos requeridos.</mdb-card-text>
            <hr/>
            <h4 class="text-center"><small class="text-muted">DATOS DE LOS TRAMOS DE LA FIGURA</small></h4>
            <mdb-row>
                <mdb-col md="4">
                    <mdb-input required type="number" label="Número de tramos" :min="1" :step="1" />
                </mdb-col>
                <mdb-col md="4">
                    <mdb-input type="number" label="Mínimo" :min="0.1" :step="0.1"/>
                </mdb-col>
                <mdb-col md="4">
                    <mdb-input type="number" label="Máximo" :min="0.1" :step="0.1"/>
                </mdb-col>
            </mdb-row>
            <hr/>

        </mdb-card-body>
    </mdb-card>
</mdb-container>
</template>

<script>
import {    mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
            mdbInput, mdbRow, mdbCol } from 'mdbvue';
export default {
    components: {
       mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, 
       mdbInput, mdbRow, mdbCol
    },
    data(){
        return{
            tipo: ''
        }
    },
    methods:{
        
    }
}
</script>