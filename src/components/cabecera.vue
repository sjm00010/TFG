<template>
    <mdb-navbar expand="large" dark color="elegant">
        <mdb-navbar-brand router-link to="/" v-on:click.native="cambiar('/')">
            <img :src="require('@/assets/img/logo.png')" height="50px" alt="Logo">
        </mdb-navbar-brand>
        <mdb-navbar-toggler>
            <mdb-navbar-nav right>
                <mdb-nav-item class="text-center" router-link to="/" v-on:click.native="cambiar('/')" :class="{'active' : rut=='/'}" >
                    <mdb-icon icon="home" /> Inicio
                </mdb-nav-item>
                <mdb-nav-item class="text-center" router-link to="/ejercicios" v-on:click.native="cambiar('/ejercicios')" :class="{'active' : rut !='/'}">
                    <mdb-icon icon="book" /> Ejercicios
                </mdb-nav-item>
            </mdb-navbar-nav>
        </mdb-navbar-toggler>
    </mdb-navbar>
</template>

<script>
    import {   mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbIcon } from 'mdbvue';
    export default {
        name: 'Cabecera',
        components: {
            mdbNavbar,
            mdbNavbarBrand,
            mdbNavbarToggler,
            mdbNavbarNav,
            mdbNavItem,
            mdbIcon
        },
        data () {
            return {
                rut: ''
            };
        },
        methods:{
            cambiar(actual){
                this.rut = actual;
            }
        },
        created: function(){
            this.rut = this.$route.path;
        }
    }
</script>