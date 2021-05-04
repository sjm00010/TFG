<template>
  <div id="app">
    <cabecera/>
    <router-view/>
    <notifications group="log" width='75%' position="top center"/>
    <notifications group="app" class="my-2"/>
  </div>
</template>

<script>
import cabecera from '@/components/cabecera';
export default {
  name: 'App',
  components: {cabecera},
  mounted(){
    this.$notify({
      group: 'log',
      title: '<i class="far fa-2x fa-question-circle"></i></i> <b class="h3">Información sobre notificaciones</b>',
      text: '<i style="font-size:12px"> Para cerrar las notificaciones basta con hacer clic en ellas.</i>',
      duration: 5000,
    });
  }
}
</script>