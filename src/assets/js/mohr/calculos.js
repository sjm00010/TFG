import {Mohr} from '@/assets/js/formulario/ejercicio.js';

export let s1, s2, alfa, 
    gamma, sA, tA, sAprima, radio, centro,
    e1, e2, u;

export let datos;

function calculaSigma1(){
    s1= (datos.sx + datos.sy)/2 + Math.sqrt( Math.pow(0.5*(datos.sx - datos.sy), 2) + Math.pow(datos.txy, 2) );
}

function calculaSigma2(){
    s2= (datos.sx + datos.sy)/2 - Math.sqrt( Math.pow(0.5*(datos.sx - datos.sy), 2) + Math.pow(datos.txy, 2) );
}

function calculaAlfa(){
    alfa = 0.5 * Math.atan2(-datos.txy, 0.5*(datos.sx - datos.sy)) * 180/Math.PI;
}

function calculaRadio(){
    radio = 0.5 * (s1 - s2);
}

function calculaCentro(){
    centro = 0.5 * (s1 + s2);
}

function calculaGamma(){
    gamma = alfa + datos.B;
}

function calculaSigmaA(){
    sA = centro + radio * Math.cos(2*gamma*Math.PI/180);
}

function calculaSigmaAprima(){
    sAprima = centro - radio * Math.cos(2*gamma*Math.PI/180);
}

function calculaTauA(){
    tA = radio * Math.sin((-2)*gamma*Math.PI/180);
}

function calculaE1(){
    e1 = s1/datos.E - datos.v/datos.E * s2;
}

function calculaE2(){
    e2 = s2/datos.E - datos.v/datos.E * s1;
}

function calculaU(){
    u = 0.5*(s1*e1 + s2*e2) * 1000000;
}

export function prueba(){
    datos = new Mohr();
    datos.sx = -28;
    datos.sy = 88;
    datos.txy = -15;
    datos.B = 37;
    datos.E = 210000;
    datos.v = 0.3;

    calculaSigma1();
    calculaSigma2();
    calculaAlfa();
    calculaRadio();
    calculaCentro();
    calculaGamma();
    calculaSigmaA();
    calculaSigmaAprima();
    calculaTauA();
    calculaE1();
    calculaE2();
    calculaU();
}

export function calculaTensor(){
    let tensor = '\\bar{\\bar{\\sigma}} = \\begin{pmatrix} ';
    tensor += sA.toFixed(2) + ' & ' + tA.toFixed(2) + '\\\\';
    tensor += tA.toFixed(2) + ' & ' + sAprima.toFixed(2);
    return tensor + ' \\end{pmatrix}';
}