import Vue from 'vue';
import Router from 'vue-router';
import Inicio from '@/views/Inicio';
import ListaEjercicios from '@/views/ListaEjercicios';
import Editor from '@/views/Editor';
import Modificador from '@/views/Modificador';

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
    {
      path: '/ejercicios/nuevo',
      name: 'Editor',
      component: Editor
    },
    {
      path: '/ejercicios/:tipo/modificar/:id',
      name: 'Modificador',
      component: Modificador
    },
  ]
});
