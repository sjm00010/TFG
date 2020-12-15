<template>
  <div id="app">
    <cabecera/>
    <router-view/>
    <notifications group="auth" width='75%' position="top center"/>
    <notifications class="my-2" group="app"/>
  </div>
</template>

<script>
import cabecera from '@/components/cabecera';
export default {
  name: 'App',
  components: {cabecera}
}
</script>