import * as faux from '@/assets/js/matriz/funcionesAux.js';
import {lusolve, multiply, subtract, transpose} from 'mathjs';

/******************            INPUTS               ******************/
// materiales: num material | E | nu [en kN y m]
let materiales = [];
// secciones: num_seccion | anchura | altura [en metros]
let secciones = [];
// barras: num nodo | x | y
let nodos = [];
// barras: num barra | nodo inicial | nodo final | material | seccion
let barras = [];
// bc (condiciones de contorno): num_nodo | grado de libertad (siendo 1 u_x, 2, u_y y 3 theta_z)
let bc = [];
// cargas : num_nodo | gdl cargado (siendo 1 u_x, 2, u_y y 3 theta_z) | valor de la carga ]
let cargas = [];

/**
 * Función que carga todos los datos de los inputs
 * @param {Object} datos Objeto con los datos
 */
export function cargaDatos(datos){
    cargaMateriales(datos.materiales, true);
    cargaSecciones(datos.secciones, true);
    cargaNodos(datos.nodos, true);
    cargaBarras(datos.barras, true);
    cargaBc(datos.bc, true);
    cargaCargas(datos.cargas, true);
    calcular();
}

/**
 * Función que carga los materiales
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaMateriales(datos, cal){
    materiales.splice(0, materiales.length);
    datos.forEach((material) => {
        materiales.push([parseFloat(material[0]), parseFloat(material[1].valor), parseFloat(material[2])]);
    });
    if(!cal)
        calcular();
}

/**
 * Función que carga las secciones
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaSecciones(datos, cal){
    secciones.splice(0, secciones.length);
    datos.forEach((seccion) => {
        secciones.push([parseFloat(seccion[0]), parseFloat(seccion[1].valor), parseFloat(seccion[2].valor)]);
    });
    if(!cal)
        calcular();
}

/**
 * Función que carga los nodos
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaNodos(datos, cal){
    nodos.splice(0, nodos.length);
    datos.forEach((nodo) => {
        nodos.push([parseFloat(nodo[0]), parseFloat(nodo[1].valor), parseFloat(nodo[2].valor)]);
    });
    if(!cal)
        calcular();
}

/**
 * Función que carga las caondiciones de contorno
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaBc(datos, cal){
    bc.splice(0, bc.length);
    datos.forEach((nodo) => {
        if(nodo[1])
            bc.push([parseFloat(nodo[0]), 1]);
        if(nodo[2])
            bc.push([parseFloat(nodo[0]), 2]);
        if(nodo[3])
            bc.push([parseFloat(nodo[0]), 3]);
    });
    if(!cal)
        calcular();
}

/**
 * Función que carga las barras
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaBarras(datos, cal){
    barras.splice(0, barras.length);
    datos.forEach((barra) => {
        barras.push([parseFloat(barra[0]), parseFloat(barra[1]), parseFloat(barra[2]), parseFloat(barra[3]), parseFloat(barra[4])]);
    });
    if(!cal)
        calcular();
}

/**
 * Función que carga las cargas
 * @param {Object} datos Objeto con los datos
 * @param {Boolean} cal Indica si se deben recalcular los datos
 */
export function cargaCargas(datos, cal){
    cargas.splice(0, cargas.length);
    datos.forEach((carga) => {
        cargas.push([parseFloat(carga[0]), parseFloat(carga[1]), parseFloat(carga[2].valor)]);
    });
    if(!cal)
        calcular();
}

// Variables auxiliares
export let _MATERIALES;
export let _SECCIONES;
export let _NODOS;
export let _ELEMENTOS;

// Variables
let Ktot;
let Ftot;
let Kred;
let Fred;
let Dvred;
let Dvtot;
let Fvector;
let Reacciones;

/**
 * Función que realiza los cálculos matriciales con los datos cargados en las variables
 */
function calcular(){
    // Variables auxiliares
    _MATERIALES = faux.leerMateriales(materiales);
    _SECCIONES = faux.leerSecciones(secciones);
    _NODOS = faux.leerNodos(nodos);
    _ELEMENTOS = faux.leerElementos(barras);

    // Variables
    Ktot = faux.creaMatrizK(_NODOS, _ELEMENTOS);
    Ftot = faux.creaVectorF(_NODOS, cargas);
    Kred = faux.reducirMatrizK(Ktot, bc, _NODOS);
    Fred = faux.reducirFvector(Ftot, bc, _NODOS);
    Dvred = lusolve(Kred, Fred);
    Dvtot = faux.creaDvector(Dvred, bc, _NODOS);
    Fvector = multiply(Ktot, Dvtot);
    Reacciones = [subtract(Fvector, transpose(Ftot)[0])];
}

/**
 * Función calcula en latex las matrices locales
 * @param {Object} bar Datos de las barras
 * @returns Vector con las matrices locales en latex
 */
export function matricesLocales(bar){
    let matrices = [];
    bar.forEach((barra, i) => {
        matrices.push(faux.pasaLatex( "K", barra[1].toString()+barra[2].toString(),"l",_ELEMENTOS[i][1].localK));
    });
    return matrices;
}

/**
 * Función calcula en latex las matrices globales
 * @param {Object} bar Datos de las barras
 * @returns Vector con las matrices globales en latex
 */
export function matricesGlobales(bar){
    let matrices = [];
    bar.forEach((barra, i) => {
        matrices.push(faux.pasaLatex( "K", barra[1].toString()+barra[2].toString(),"g",_ELEMENTOS[i][1].globalK));
    });
    return matrices;
}

/**
 * Función calcula en latex las matrices de cambio de base
 * @param {Object} bar Datos de las barras
 * @returns Vector con las matrices de cambio de base en latex
 */
 export function matricesCambioBase(bar){
    let matrices = [];
    bar.forEach((barra, i) => {
        matrices.push(faux.pasaLatex( "C", barra[1].toString()+barra[2].toString(),'',_ELEMENTOS[i][1].C));
    });
    return matrices;
}

/**
 * Función calcula en latex la matriz Ktot
 * @returns Matriz Ktot en latex
 */
export function getKtot(){
    return faux.pasaLatex( "K", '',"tot", Ktot);
}

/**
 * Función que calcula el vector auxiliar, que aparece a la derecha en Kred
 * @returns Vector en latex
 */
function calculaMatrizAux(){
    let vector = [];
    for(let i = 0; i < nodos.length; i++){
        vector.push('\\delta_{H'+(i+1)+'}');
        vector.push('\\delta_{v'+(i+1)+'}');
        vector.push('\\theta_{'+(i+1)+'}');
    }

    for(let i = bc.length-1; i >=0; i--)
        vector.splice(3*(parseInt(bc[i][0])-1)+(parseInt(bc[i][1])-1), 1)

    let texto = " \\begin{pmatrix}";
    for(let i = 0; i < vector.length; i++)
        texto += vector[i] + " \\\\ ";
    texto += "\\end{pmatrix} ";

    return texto;
}

/**
 * Función calcula en latex la matriz Kred
 * @returns Matriz Kred en latex
 */
 export function getKred(){
    let texto = faux.pasaLatex( '', '','', Fred);
    texto += ' = ';
    texto += faux.pasaLatex( '', '','', Kred);
    texto += calculaMatrizAux();
    return texto;
}

/**
 * Función que devuelve Dvtot
 * @returns Matriz Dvtot
 */
export function getDvtot(){
    return Dvtot;
}

/**
 * Función que el texto en latex para las reacciones
 * @returns Vector con las reacciones en latex
 */
 export function getReacciones(){
    let vector = [];
    for(let i = 0; i < nodos.length; i++){
        vector.push('R_{H'+(i+1)+'} = ' + Reacciones[0][i*3].toPrecision(4).replace(/e\+?(-?[0-9]+)/g, '\\times10^{$1}').replace(/(\d+)\.0+/g, '$1').replace(/(\d+\.[1-9]+)0+/g, '$1'));
        vector.push('R_{v'+(i+1)+'} = ' + Reacciones[0][i*3+1].toPrecision(4).replace(/e\+?(-?[0-9]+)/g, '\\times10^{$1}').replace(/(\d+)\.0+/g, '$1').replace(/(\d+\.[1-9]+)0+/g, '$1'));
        vector.push('R_{\\theta'+(i+1)+'} = ' + Reacciones[0][i*3+2].toPrecision(4).replace(/e\+?(-?[0-9]+)/g, '\\times10^{$1}').replace(/(\d+)\.0+/g, '$1').replace(/(\d+\.[1-9]+)0+/g, '$1'));
    }

    let sol = [];
    for(let i = 0 ; i  < bc.length; i++)
        sol.push(vector[3*(parseInt(bc[i][0])-1)+(parseInt(bc[i][1])-1)]);

    return sol;
}

export function obtenerReacciones(){
    let sol = [];
    for(let i = 0 ; i < bc.length; i++)
        sol.push({
            x: parseFloat(nodos[bc[i][0]-1][1]),
            y: parseFloat(nodos[bc[i][0]-1][2]),
            tipo: parseInt(bc[i][1]),
            mag:  parseFloat(Reacciones[0][3*(parseInt(bc[i][0])-1)+(parseInt(bc[i][1])-1)].toPrecision(4)),
            
        });
    
    return sol;
}