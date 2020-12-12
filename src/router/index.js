import Vue from 'vue';
import Router from 'vue-router';
import Inicio from '@/views/Inicio';
import ListaEjercicios from '@/views/ListaEjercicios';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Inicio
    },
    {
      path: '/ejercicios',
      name: 'Lista',
      component: ListaEjercicios
    },
  ]
});
