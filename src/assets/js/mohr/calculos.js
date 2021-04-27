export let s1, s2, alfa, 
    gamma, sA, tA, sAprima, radio, centro,
    e1, e2, u;
let datosIniciales;

/**
 * Función que actualiza los datos
 * @param {Object} nDatos Nuevos datos
 */
export function actualizaDatos(nDatos){ datosIniciales = nDatos; }

/**
 * Función que calcula Sigma 1
 */
function calculaSigma1(){
    s1= (datosIniciales.sx + datosIniciales.sy)/2 + Math.sqrt( Math.pow(0.5*(datosIniciales.sx - datosIniciales.sy), 2) + Math.pow(datosIniciales.txy, 2) );
}

/**
 * Función que calcula Sigma 2
 */
function calculaSigma2(){
    s2= (datosIniciales.sx + datosIniciales.sy)/2 - Math.sqrt( Math.pow(0.5*(datosIniciales.sx - datosIniciales.sy), 2) + Math.pow(datosIniciales.txy, 2) );
}

/**
 * Función que calcula Alfa
 */
function calculaAlfa(){
    alfa= 0.5 * Math.atan2(-datosIniciales.txy, 0.5*(datosIniciales.sx - datosIniciales.sy)) * 180/Math.PI;
}

/**
 * Función que calcula el radio de la esfera
 */
function calculaRadio(){
    radio = 0.5 * (s1 - s2);
}

/**
 * Función que calcula el centro de la esfera
 */
function calculaCentro(){
    centro = 0.5 * (s1 + s2);
}

/**
 * Función que calcula Gamma
 */
function calculaGamma(){
    gamma = alfa + datosIniciales.B;
}

/**
 * Función que calcula Sigma A
 */
function calculaSigmaA(){
    sA = centro + radio * Math.cos(2*gamma*Math.PI/180);
}

/**
 * Función que calcula Sigma A'
 */
function calculaSigmaAprima(){
    sAprima = centro - radio * Math.cos(2*gamma*Math.PI/180);
}

/**
 * Función que calcula Tau A
 */
function calculaTauA(){
    tA = radio * Math.sin((-2)*gamma*Math.PI/180);
}

/**
 * Función que calcula E 1
 */
function calculaE1(){
    e1 = s1/datosIniciales.E - datosIniciales.v/datosIniciales.E * s2;
}

/**
 * Función que calcula E 2
 */
function calculaE2(){
    e2 = s2/datosIniciales.E - datosIniciales.v/datosIniciales.E * s1;
}

/**
 * Función que calcula U
 */
function calculaU(){
    u = 0.5*(s1*e1 + s2*e2) * 1000000;
}

/**
 * Función que calcula Sigma X
 */
function calculaSigmaX(){
    datosIniciales.sx = 0.5*(datosIniciales.s1+datosIniciales.s2) + 0.5*(datosIniciales.s1-datosIniciales.s2)* Math.cos(2*datosIniciales.a*Math.PI/180);
}

/**
 * Función que calcula Sigma Y
 */
function calculaSigmaY(){
    datosIniciales.sy = 0.5*(datosIniciales.s1+datosIniciales.s2) - 0.5*(datosIniciales.s1-datosIniciales.s2)* Math.cos(2*datosIniciales.a*Math.PI/180);
}

/**
 * Función que calcula Tau XY
 */
function calculaTauxy(){
    datosIniciales.txy = -0.5*(datosIniciales.s1-datosIniciales.s2) * Math.sin(2*datosIniciales.a*Math.PI/180);
}

/**
 * Función que actualiza los datos para el nuevo angulo de B
 * @param {*} angulo Nuevo angulo
 */
export function actualizar(angulo){
    datosIniciales.B = angulo;

    if(!datosIniciales.sx){
        calculaSigmaX();
        calculaSigmaY();
        calculaTauxy();
    }

    calculaSigma1();
    calculaSigma2();
    calculaAlfa();
    calculaRadio();
    calculaGamma();
    calculaSigmaA();
    calculaSigmaAprima();
    calculaTauA();
}

/**
 * Función que calcula los datos inicialmente
 */
export function calcular(){
    if(!datosIniciales.sx){
        calculaSigmaX();
        calculaSigmaY();
        calculaTauxy();
    }

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

/**
 * Funcion para expresar el tensor en latex
 * @returns Matriz tensor en latex
 */
export function calculaTensor(){
    let tensor = '\\bar{\\bar{\\sigma}} = \\begin{pmatrix} ';
    tensor += sA.toFixed(2) + ' & ' + tA.toFixed(2) + '\\\\';
    tensor += tA.toFixed(2) + ' & ' + sAprima.toFixed(2);
    return tensor + ' \\end{pmatrix} MPa';
}