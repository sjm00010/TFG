<template>
<mdb-container class="my-3">
    <mdb-card class="mb-3">
		<mdb-card-body>
			<mdb-card-title>Modificar un ejercicio </mdb-card-title>
			<mdb-card-text>Tipo de ejercicio :</mdb-card-text>
            <select class="browser-default custom-select custom-select-lg mb-3" v-model="tipo" disabled>
                <option value="" selected>Selecciona un tipo</option>
                <option value="Vigas">Vigas</option>
                <option value="Matrices">Matrices</option>
                <option value="Otro">Otro</option>
            </select>
		</mdb-card-body>
	</mdb-card>
    <formularioViga v-if="tipo == 'Vigas'" :modificando="true" />
</mdb-container>
</template>

<script>
import {    mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText } from 'mdbvue';
import formularioViga from '@/components/editor/formularioViga';
import { ejViga, cargaEjercicio, limpiar } from '@/assets/js/formulario/ejercicioJSON.js';

export default {
    components: {
       mdbContainer, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,
       formularioViga
    },
    data(){
        return{
            tipo: ''
        }
    },
    created(){
        switch(this.$route.params.tipo){
            case 'viga':
               this.tipo = 'Vigas';
                break;
            default:
                this.$notify({
                    group: 'app',
                    title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error al cargar el ejercicio</b>',
                    text: '<i style="font-size:15px"> Ocurrio un problema al cargar el ejercicio. Recargue los ejercicios y vuelve a intentarlo.</i>',
                    duration: 7000,
                    type: 'error'
                });
                this.$route.push('/ejercicios');
                break;
        }

        if(ejViga.id === undefined)
            this.$router.push('/ejercicios');
    },
    beforeDestroy(){
        limpiar();
    },
    async beforeRouteEnter (to, from, next) {
        await cargaEjercicio(to.params.id, to.params.tipo);
        
        // called before the route that renders this component is confirmed.
        next();
    }
}
</script>