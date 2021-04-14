<template>
<mdb-container class="my-3">
    <mdb-card class="mb-3">
		<mdb-card-body>
			<mdb-card-title>Seleccionar tipo de ejercicio</mdb-card-title>
			<mdb-card-text>Selecciona un tipo de ejercicio de la lista para que aparezcan los datos requeridos para ese ejercicio.</mdb-card-text>
            <select class="browser-default custom-select custom-select-lg mb-3" v-model="tipo">
                <option value="" selected>Selecciona un tipo</option>
                <option value="Vigas">Diagramas de esfuerzos en vigas</option>
                <option value="Mohr">Círculos de Mohr</option>
                <option value="Matriz">Matricial</option>
            </select>
		</mdb-card-body>
	</mdb-card>
    <formularioViga v-if="tipo == 'Vigas'"/>
    <formularioMohr v-if="tipo == 'Mohr'"/>
    <formularioMatriz v-if="tipo == 'Matriz'"/>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText } from 'mdbvue';
import formularioViga from '@/components/formularios/formularioViga';
import formularioMohr from '@/components/formularios/formularioMohr';
import formularioMatriz from '@/components/formularios/formularioMatriz';
import { limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';

export default {
    components: {
       mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,
       formularioViga, formularioMohr, formularioMatriz
    },
    data(){
        return{
            tipo: ''
        }
    },
    beforeDestroy(){
        limpiar();
    }
}
</script>