<template>
  <div id="app">
    <cabecera/>
    <router-view/>
    <notifications group="log" width='75%' position="top center"/>
    <notifications class="my-2" group="app"/>
  </div>
</template>

<script>
import cabecera from '@/components/Cabecera';
import {cargaEjVigas} from '@/assets/js/ejercicio.js';
export default {
  name: 'App',
  components: {cabecera},
  created(){

  },
  mounted(){
    this.$notify({
      group: 'log',
      title: '<i class="far fa-2x fa-question-circle"></i></i> <b class="h3">Información</b>',
      text: '<i style="font-size:12px"> Para cerrar las notificaciones basta con hacer click en ellas.</i>',
      duration: 5000,
    });
    cargaEjVigas();
  }
}
</script>