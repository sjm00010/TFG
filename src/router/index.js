import Vue from 'vue';
import Router from 'vue-router';
import Inicio from '@/views/Inicio';
import Accesibilidad from '@/views/Accesibilidad';
import ListaEjercicios from '@/views/ListaEjercicios';
import Editor from '@/views/Editor';
import Modificador from '@/views/Modificador';
import Realizar from '@/views/Realizar';
import Mohr from '@/components/visualizar/circulosMohr/mohr';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Inicio
    },
    {
      path: '/accesibilidad',
      name: 'Accesibilidad',
      component: Accesibilidad
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
      path: '/ejercicios/modificar/:tipo/:id',
      name: 'Modificador',
      component: Modificador
    },
    {
      path: '/ejercicios/:tipo/:id',
      name: 'Realizar',
      component: Realizar
    },{
      path: '/ejercicios/mohr',
      name: 'Mohr',
      component: Mohr
    },
  ]
});
