<template>
    <mdb-container class="mt-4">
        <h1 class="text-muted text-center mb-4">Listado de ejercicios</h1>
        <hr/>        
        <tipo class="mb-3" titulo="Cálculo de apoyo en vigas" color="aqua-gradient"></tipo>
        <mdb-row>
            <mdb-col col="md">
                <tarjeta  titulo="Ejercio 1" dificultad="1" 
                    descripcion="Ejemplo" enlace="/ejercicios/ejVigas"></tarjeta>
            </mdb-col>
        </mdb-row>
    </mdb-container>
</template>

<script>
import tarjeta from '@/components/TarjetaEjercicio';
import tipo from '@/components/TipoEjercicios';
import {mdbContainer, mdbRow, mdbCol} from 'mdbvue';
export default {
    components: {
        mdbContainer,
        mdbRow,
        mdbCol,
        tarjeta,
        tipo
    }
}
</script>