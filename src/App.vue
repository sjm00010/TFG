<template>
  <div id="app">
    <cabecera/>
    <router-view/>
  </div>
</template>

<script>
import cabecera from '@/components/cabecera';
export default {
  name: 'App',
  components: {cabecera}
}
</script>