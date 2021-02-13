<template>
<div>
    <viga v-if="this.tipo === 'viga'"/>
</div>
</template>

<script>
// import { mdbContainer, mdbJumbotron, mdbCardTitle} from 'mdbvue';
import viga from '@/components/ejercicios/viga';
import { cargaEjercicio, limpiar } from '@/assets/js/ejercicioJSON.js';
export default {
    name: "EjercicioViga",
    components:{
        // mdbContainer, mdbJumbotron, mdbCardTitle
        viga
    },
    data(){
        return {
            tipo: this.$route.params.tipo
        };
    },
    async beforeRouteEnter (to, from, next) {
        await cargaEjercicio(to.params.id, to.params.tipo);
        
        // called before the route that renders this component is confirmed.
        next();
    },
    beforeDestroy(){
        limpiar();
    }
}
</script>