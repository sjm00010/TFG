<template>
  <div>
    <mdb-card class="card-image" v-bind:style="fondo">
      <div class="text-white text-center rgba-black-strong py-5 px-4">
        <div class="py-5">
          <h1 class="green-text"><mdb-icon icon="pencil-ruler" /> <b>W</b>eb <b>I</b>nteractiva <b>PA</b>ra el <b>C</b>álculo de <b>E</b>structuras</h1>
          <h2 class="card-title h2 my-4 py-2" v-show="!prof">¡Bienvenid@ a WIPACE!</h2>
          <p class="mb-4 pb-2 px-md-5 mx-md-5" v-show="!prof">En la sección <i>Ejercicios</i>, situada arriba a la derecha, podrás consultar todos los ejercicios disponibles.</p>
          <h2 class="card-title h2 my-4 py-2" v-show="prof">¡Bienvenid@ profesor/a!</h2>
          <p class="mb-4 pb-2 px-md-5 mx-md-5" v-show="prof">En la sección <i>Ejercicios</i>, situada arriba a la derecha, podrás consultar las opciones de administración.</p>
          <mdb-btn class="blue-grey-text" tag="a" gradient="dusty-grass" icon="key" href="https://dv.ujaen.es/" v-show="!prof">Docencia virtual</mdb-btn>

        </div>
      </div>
    </mdb-card>

    <mdb-container class="my-3">
      <mdb-jumbotron class="mb-0 text-center hoverable p-4">
        <mdb-row>
          <mdb-col md="4" offsetMd="1" class="m-3">
            <mdb-view class="animated pulse infinite" :src="require('@/assets/img/engineer.svg')" alt="Imagen del profesor">
              <mdb-mask waves overlay="white-slight"/>
            </mdb-view>
          </mdb-col>
          <mdb-col md="7" class="text-left ml-3 mt-3">
            <p class="h6 pb-1 indigo-text"><mdb-icon far icon="question-circle" class="pr-1"/> +Info</p>
            <h3 class="h3 mb-4">Fernando Suárez Guerra</h3>
            <h4 class="h4 mb-4">Si necesitas tutoría...</h4>
            <p class="font-weight-normal">
              <ul>
                <li>
                  <b>Correo</b> : fsuarez@ujaen.es
                </li>
                <li>
                  <b>Teléfono</b> : (+34) 953 648 606
                </li>
                <li>
                  <b>Dirección</b> : Campus Científico Tecnológico de Linares, Dependencia: D-50
                </li>
              </ul>
            </p>
            <mdb-btn class="ml-0 black-text" tag="a" block color="light-blue" href="https://www.ujaen.es/departamentos/ingmec/contactos/suarez-guerra-fernando"><b>Mis tutorías</b></mdb-btn>
          </mdb-col>
        </mdb-row>
      </mdb-jumbotron>

      <mdb-btn block v-show="!prof" outline="danger" @click="verLogin"><p class="black-text my-0">Identificación para docentes</p></mdb-btn>
      <mdb-btn block v-show="prof" outline="warning" @click="logout"><p class="black-text my-0">Cerrar sesión</p></mdb-btn>

      <mdb-modal centered :show="modal" @close="modal = false">
        <mdb-modal-header>
          <mdb-modal-title>Identificación del profesorado</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="py-0 grey-text">
          <mdb-input label="Usuario" icon="user" v-model="user" />
          <mdb-input type="password" icon="lock" label="Contraseña" v-model="pass" @keyup.enter.native="login"/>
        </mdb-modal-body>
        <div class="text-center my-3">
          <mdb-btn color="success" @click.native="login">Identificarse</mdb-btn>
        </div>
      </mdb-modal>
    </mdb-container>
    <footermb/>
  </div>
</template>

<script>
import {  mdbCard, mdbBtn, mdbJumbotron, mdbRow, mdbCol, mdbView, mdbIcon, mdbMask, 
          mdbContainer, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
          mdbInput} from 'mdbvue';
import footermb from '@/components/footer';
import {profesor, getUser, logout} from '@/assets/js/login/identificacion.js';
import {URL} from '@/assets/js/auxiliares/api.config.js';
export default {
  name: 'Inicio',
  components: {
    mdbCard, mdbBtn, mdbJumbotron, mdbRow, mdbCol, mdbView, mdbIcon, mdbMask, 
    mdbContainer, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
    mdbInput,
    footermb
  },
  data() {
    return {
      modal: false,
      user: '',
      pass: '',
      error: false,
      prof: false
    }
  },
  computed: {
    fondo() {
      return {
        backgroundImage: `url(${require('@/assets/img/fondo.png')})`,
        backgroundSize: 'cover'
      };
    }
  },
  methods:{
    verLogin(){
      this.modal = true;
      this.error = false;
    },
    async login(){
      const respuesta = await fetch(URL+'/usuario/login', { 
        headers: {'Content-Type': 'application/json', 
                  'Authorization': "Basic " + btoa(this.user +':'+this.pass)
        },
        method: 'GET'
      });

      if(respuesta.ok){ // Usuario y contraseña válidos
        sessionStorage.setItem("user", this.user);
        sessionStorage.setItem("pass", this.pass);
        this.prof = true;
        this.modal = false;
        this.$notify({
          group: 'log',
          title: '<i class="fas fa-2x fa-user-circle"></i> <b class="h3">Bienvenido profesor/a</b>',
          text: '<i style="font-size:15px"> Se ha identificado correctamente. El botón para cerrar sesión sustituyó al de identificarse</i>',
          duration: 8000,
          type: 'success'
        });
      }else{
        this.$notify({
          group: 'log',
          title: '<i class="fas fa-2x fa-times"></i> <b class="h3">Error de autentificación</b>',
          text: '<i style="font-size:15px"> El usuario o contraseña introducidos son incorrectos.</i>',
          duration: 5000,
          type: 'error'
        });
      }
    },
    logout(){
      logout();
      this.prof = profesor;
    }
  },
  created(){
    getUser();
    this.prof = profesor;
  }
}
</script>