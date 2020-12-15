<template>
  <div>
    <mdb-card class="card-image" style="background-image: url(https://torange.biz/photo/4/HD/constructing-steel-structures-metal-construction-4967.jpg); background-size:cover;">
      <div class="text-white text-center rgba-black-strong py-5 px-4">
        <div class="py-5">
          <h1 class="green-text"><mdb-icon icon="pencil-ruler" /> Cálculo y teoría de estructuras</h1>
          <h2 class="card-title h2 my-4 py-2" v-show="!prof">¡Bienvenidos!</h2>
          <p class="mb-4 pb-2 px-md-5 mx-md-5" v-show="!prof">Para más información consultar docencia virtual.</p>
          <h2 class="card-title h2 my-4 py-2" v-show="prof">¡Bienvenido Fernando!</h2>
          <p class="mb-4 pb-2 px-md-5 mx-md-5" v-show="prof">Para ver las opciones de edición dirigete al listado de ejercicios.</p>
          <mdb-btn class="blue-grey-text" tag="a" gradient="dusty-grass" icon="key" href="https://dv.ujaen.es/" v-show="!prof">Docencia virtual</mdb-btn>
        </div>
      </div>
    </mdb-card>

    <mdb-container class="my-3">
      <mdb-jumbotron class="mb-0 text-center hoverable p-4">
        <mdb-row>
          <mdb-col md="4" offsetMd="1" class="m-3">
            <mdb-view class="animated pulse infinite" src="https://www.flaticon.com/svg/static/icons/svg/1276/1276525.svg" alt="Imagen del profesor">
              <mdb-mask waves overlay="white-slight"/>
            </mdb-view>
          </mdb-col>
          <mdb-col md="7" class="text-left ml-3 mt-3">
              <h6 class="h6 pb-1 cyan-text"><mdb-icon far icon="question-circle" class="pr-1"/> +Info</h6>
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
            <mdb-btn class="ml-0" tag="a" block color="info" href="https://www.ujaen.es/departamentos/ingmec/contactos/suarez-guerra-fernando">Mis tutorías</mdb-btn>
          </mdb-col>
        </mdb-row>
      </mdb-jumbotron>

      <mdb-btn block v-show="!prof" outline="danger" @click="verLogin">Solo para profesores</mdb-btn>
      <mdb-btn block v-show="prof" outline="warning" @click="logout">Cerrar sesión</mdb-btn>

      <mdb-modal centered :show="modal" @close="modal = false">
        <mdb-modal-header>
          <mdb-modal-title>Identificacion</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="py-0">
          <mdb-input label="Usuario" v-model="user" />
          <mdb-input type="password" label="Contraseña" v-model="pass" @keyup.enter.native="login"/>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="success" @click.native="login">Identificarse</mdb-btn>
          <mdb-btn outline="danger" @click.native="modal = false, error = false">Cerrar</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
    </mdb-container>
  </div>
</template>

<script>
import {  mdbCard, mdbBtn, mdbJumbotron, mdbRow, mdbCol, mdbView, mdbIcon, mdbMask, 
          mdbContainer, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
          mdbModalFooter, mdbInput} from 'mdbvue';
import {profesor, getUser, logout} from '@/assets/js/identificacion.js';
export default {
  name: 'Inicio',
  components: {
    mdbCard, mdbBtn, mdbJumbotron, mdbRow, mdbCol, mdbView, mdbIcon, mdbMask, 
    mdbContainer, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, 
    mdbModalFooter, mdbInput
  },
  data() {
    return {
      modal: false,
      ip: '',
      city: '',
      user: '',
      pass: '',
      error: false,
      prof: false
    }
  },
  methods:{
    verLogin(){
      this.modal = true;
      this.error = false;
      this.$notify({
          group: 'auth',
          title: '<i class="far fa-2x fa-question-circle"></i></i> <b class="h3">Información</b>',
          text: '<i style="font-size:12px"> Para cerrar las notificaciones basta con hacer click en ellas.</i>',
          duration: 5000,
      });
      this.$notify({
        group: 'auth',
        title: '<i class="fas fa-2x fa-exclamation-circle"></i>  <b class="h3">Aviso</b>',
        text: `<i style="font-size:15px">Tu IP es ${this.ip} con ubicación en ${this.city}. Será almacenada por motivos de seguridad, para evitar suplantación de identidad.</i>`,
        duration: 10000,
        type: 'warn'
      });
    },
    login(){
      if(this.user == "fernando" && this.pass == "prueba"){ // Usuario y contraseña
        localStorage.setItem("auth", 'profesor');
        this.prof = true;
        this.modal = false;
        this.$notify({
          group: 'auth',
          title: '<i class="fas fa-2x fa-user-circle"></i> <b class="h3">Bienvenido Fernando</b>',
          text: '<i style="font-size:15px"> Te has identificado correctamente. El botón para cerrar sesión esta en el mismo lugar que el de identificarse</i>',
          duration: 8000,
          type: 'success'
        });
      }else{
        this.$notify({
          group: 'auth',
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
    // Obtiene la IP del usuario
    fetch('https://api.ipify.org?format=json')
      .then(x => x.json())
      .then(({ ip }) => {
        this.ip = ip;
        fetch(`http://api.ipstack.com/${this.ip}?access_key=40e89371e2776c5336083cd5ebbde367`)
          .then(x => x.json())
          .then(({ city }) => {
              this.city = city;
        });
    });

    getUser();
    this.prof = profesor;
  }
}
</script>