<template>
<div>
    <modal ref="mimodal" v-show="this.modal.visible" v-model="modal" ></modal>

    <h4 class="text-center"><small class="text-muted">DIBUJO DEL PROBLEMA</small></h4>
    <mdb-card-text class="text-center">Dibuja la figura con los datos requeridos para que cambie cuando los alumnos ajusten los valores.</mdb-card-text>
    <mdb-row class="justify-content-center">
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="primary" @click.native="modal.visible = true, $refs.mimodal.visualiza('Punto de carga');"><mdb-icon size="lg" icon="plus"/> Punto de carga</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="amber" @click.native="modal.visible = true, $refs.mimodal.visualiza('Momento');"><mdb-icon size="lg" icon="plus"/> Momento</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="dark-green" @click.native="modal.visible = true, $refs.mimodal.visualiza('Carga distribuida');"><mdb-icon size="lg" icon="plus"/> Carga distribuida</mdb-btn>
        </mdb-col>
    </mdb-row>
    <mdb-row class="justify-content-center">
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="purple" @click.native="modal.visible = true, $refs.mimodal.visualiza('Normal');"><mdb-icon size="lg" icon="plus"/> Normal</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="blue-grey" @click.native="modal.visible = true, $refs.mimodal.visualiza('Soporte');"><mdb-icon size="lg" icon="plus"/> Soporte</mdb-btn>
        </mdb-col>
        <mdb-col col="md" class="my-2">
            <mdb-btn block color="red" @click.native="modal.visible = true, $refs.mimodal.visualiza('Barra');"><mdb-icon size="lg" icon="plus"/> Barra</mdb-btn>
        </mdb-col>
    </mdb-row>

    <div class="my-4" ref="editor">
        <canvas id="editor" style="border: 1px solid rgb(211,211,211)"></canvas>
    </div>
</div>
</template>

<script>
import { mdbCardText, mdbBtn, mdbIcon, mdbRow, mdbCol} from 'mdbvue';
import modal from '@/components/editor/modal';
import { vinculaCanvas, resizeCanvas, addViga } from '@/assets/js/vigas/funAuxiliares.js';
import { resetCanvas } from '@/assets/js/vigas/dibujar.js';
export default {
    name: 'dibujar',
    components: {
        mdbCardText, mdbBtn, mdbIcon, mdbRow, mdbCol,
        modal
    },
    data(){
        return {
            modal: {
                    visible: false,
                    edicion: false
                }
        };
    },
    methods:{
        actualiza(){
            resetCanvas();
            resizeCanvas(this.$refs.editor);
            addViga();
        }
    },
    mounted() {
            vinculaCanvas(this.$refs.editor);
            window.addEventListener('resize', () => resizeCanvas(this.$refs.editor));
    },
    beforeDestroy(){
        window.removeEventListener('resize', () => resizeCanvas(this.$refs.editor));
    }
}
</script>