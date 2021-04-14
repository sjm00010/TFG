<template>
<div>
    <!-- Jumbotron con el enunciado del problema -->
    <mdb-jumbotron class="mb-0 text-center">
        <mdb-card-title class="pb-2 h4"><strong>Ejercicio de {{this.cab}}</strong></mdb-card-title>
        <p class="card-text" v-html="datos.enunciado"></p>
        <mdb-row class="justify-content-center">
            <mdb-col col="md" class="my-2" v-show="datos.ayuda && datos.ayuda.length !== 0">
                <mdb-btn block color="elegant" @click.native="modal1 = true"><mdb-icon class="align-middle" size="2x" icon="journal-whills" /> Explicación</mdb-btn>
            </mdb-col>
            <mdb-col col="md" class="my-2" v-show="datos.video && datos.video.length !== 0">
                <mdb-btn block color="secondary" @click.native="modal2 = true"><mdb-icon class="align-middle" fab size="2x" icon="youtube" /> Vídeo explicativo</mdb-btn>
            </mdb-col>
        </mdb-row>
    </mdb-jumbotron>

    <!-- Modal de la explicación -->
    <mdb-modal size="lg" v-if="datos.ayuda && datos.ayuda.length !== 0"  :show="modal1" @close="modal1 = false">
        <mdb-modal-header>
            <mdb-modal-title>Explicación</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body v-html="datos.ayuda">
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="danger" @click.native="modal1 = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>



    <!-- Modal del vídeo -->
    <mdb-modal size="lg" v-if="datos.video && datos.video.length !== 0" :show="modal2" @close="modal2 = false">
        <mdb-modal-body class="p-0">
            <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
            <iframe class="embed-responsive embed-responsive-16by9 z-depth-1-half"
                        :src="'https://www.youtube.com/embed/'
                            +((datos.video.match(/(?:v=|\.be\/|embed\/)(?<url>\w+)/) 
                            && datos.video.match(/(?:v=|\.be\/|embed\/)(?<url>\w+)/).groups.url) 
                            || 'YgGzAKP_HuM')" 
                        allowfullscreen></iframe>
            </div>
        </mdb-modal-body>
        <mdb-modal-footer >
            <mdb-btn color="danger" @click.native="modal2 = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>

    <viga v-if="this.tipo === 'viga'"/>
    <mohr v-if="this.tipo === 'mohr'"/>
    <matriz v-if="this.tipo === 'matriz'"/>
</div>
</template>

<script>
import { mdbJumbotron, mdbCardTitle, mdbBtn, mdbRow, mdbCol, 
         mdbModal, mdbModalBody, mdbIcon,
         mdbModalTitle, mdbModalFooter, mdbModalHeader, 
        } from 'mdbvue';
import viga from '@/components/visualizar/vigas/viga';
import mohr from '@/components/visualizar/circulosMohr/mohr';
import matriz from '@/components/visualizar/matrices/matriz';
import { cargaEjercicio, ejViga, ejMatriz, ejMohr, limpiar } from '@/assets/js/auxiliares/ejercicioJSON.js';
export default {
    name: "EjercicioViga",
    components:{
        mdbJumbotron, mdbCardTitle, mdbBtn, mdbRow, 
        mdbCol, mdbModal, mdbModalHeader, mdbIcon,
        mdbModalTitle, mdbModalBody, mdbModalFooter, 
        viga, mohr, matriz
    },
    data(){
        return {
            tipo: this.$route.params.tipo,
            cab: '',
            datos: undefined
        };
    },
    async beforeRouteEnter (to, from, next) {
        await cargaEjercicio(to.params.id, to.params.tipo);
        next();
    },
    beforeMount(){
        switch (this.tipo){
            case 'viga':
                this.datos = ejViga;
                this.cab = 'diagramas de esfuerzos en vigas';
                break;
            case 'matriz':
                this.datos = ejMatriz;
                this.cab = 'matrices';
                break;
            case 'mohr':
                this.datos = ejMohr;
                this.cab = 'círculos de Mohr';
                break;
            default:
                this.$notify({
                    group: 'app',
                    title: '<i class="fas fa-2x fa-times"></i> <b class="h5">Error durante la carga del ejercicio</b>',
                    text: '<i style="font-size:15px"> Ocurrió un error, pruebe a recargar los ejercicios y vuelva a intentarlo.</i>',
                    duration: 7000,
                    type: 'error'
                });
                this.$route.push('/ejercicios');
                break;
        }
    },
    mounted(){
        this.$notify({
        group: 'log',
        title: '<i class="fas fa-2x fa-info-circle"></i></i> <b class="h3">Ayuda</b>',
        text: '<i style="font-size:12px"> Si no se visualiza algún dato correctamente recargue la página.</i>',
        duration: 7000,
        });
    },
    beforeDestroy(){
        limpiar();
    }
}
</script>