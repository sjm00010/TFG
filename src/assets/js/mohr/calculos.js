export let s1, s2, alfa, 
    gamma, sA, tA, sAprima, radio, centro,
    e1, e2, u;

let datosIniciales;
export function actualizaDatos(nDatos){ datosIniciales = nDatos; }

function calculaSigma1(){
    s1= (datosIniciales.sx + datosIniciales.sy)/2 + Math.sqrt( Math.pow(0.5*(datosIniciales.sx - datosIniciales.sy), 2) + Math.pow(datosIniciales.txy, 2) );
}

function calculaSigma2(){
    s2= (datosIniciales.sx + datosIniciales.sy)/2 - Math.sqrt( Math.pow(0.5*(datosIniciales.sx - datosIniciales.sy), 2) + Math.pow(datosIniciales.txy, 2) );
}

function calculaAlfa(){
    alfa = 0.5 * Math.atan2(-datosIniciales.txy, 0.5*(datosIniciales.sx - datosIniciales.sy)) * 180/Math.PI;
}

function calculaRadio(){
    radio = 0.5 * (s1 - s2);
}

function calculaCentro(){
    centro = 0.5 * (s1 + s2);
}

function calculaGamma(){
    gamma = alfa + datosIniciales.B;
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
    e1 = s1/datosIniciales.E - datosIniciales.v/datosIniciales.E * s2;
}

function calculaE2(){
    e2 = s2/datosIniciales.E - datosIniciales.v/datosIniciales.E * s1;
}

function calculaU(){
    u = 0.5*(s1*e1 + s2*e2) * 1000000;
}

export function calcular(){
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