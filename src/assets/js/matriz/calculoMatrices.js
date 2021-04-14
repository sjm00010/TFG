import * as faux from '@/assets/js/ejMatrices/funcionesAux.js';
import {lusolve, multiply, subtract, transpose} from 'mathjs'

 /**            Inputs predeterminados                **/
// materiales: num material | E | nu [en kN y m]
let materiales = [[1, 210000000, 0.3]];
// secciones: num_seccion | anchura | altura [en metros]
let secciones = [[1, 0.10, 0.25]];
// barras: num nodo | x | y
let nodos = [[1, 0.00, 0.00],
    [2, 6.00, 0.00],
    [3, 10.33012702, 2.50]];
// barras: num barra | nodo inicial | nodo final | material | seccion
let barras = [[1, 1, 2, 1, 1],
    [2, 2, 3, 1, 1]];
// bc (condiciones de contorno): num_nodo | grado de libertad (siendo 1 u_x, 2, u_y y 3 theta_z)
let bc = [[1, 1],
    [1, 2],
    [3, 2]];
// cargas : num_nodo | gdl cargado (siendo 1 u_x, 2, u_y y 3 theta_z) | valor de la carga ]
let cargas = [[1, 2, -7.50],
    [1, 3, -11.25],
    [2, 2, -7.50],
    [2, 3, 6.25]];

/** Variables auxiliares **/
export let _MATERIALES = faux.leerMateriales(materiales);
export let _SECCIONES = faux.leerSecciones(secciones);
export let _NODOS = faux.leerNodos(nodos);
export let _ELEMENTOS = faux.leerElementos(barras);

/** Variables **/
let Ktot = faux.creaMatrizK(_NODOS, _ELEMENTOS);
let Ftot = faux.creaVectorF(_NODOS, cargas);
let Kred = faux.reducirMatrizK(Ktot, bc, _NODOS);
let Fred = faux.reducirFvector(Ftot, bc, _NODOS);
let Dvred = lusolve(Kred, Fred);
let Dvtot = faux.creaDvector(Dvred, bc, _NODOS);
let Fvector = multiply(Ktot, Dvtot);
export let Reacciones = [subtract(Fvector, transpose(Ftot)[0])];

/**
 * Función para actualizar los datos a los valores de los inputs
 */
export function actualizaDatos(){ // Pasar los nuevos datos por cabecera
    /** Variables auxiliares **/
    _MATERIALES = faux.leerMateriales(materiales);
    _SECCIONES = faux.leerSecciones(secciones);
    _NODOS = faux.leerNodos(nodos);
    _ELEMENTOS = faux.leerElementos(barras);

    /** Variables **/
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
 * Función que devuelve el texto latex para la pestaña 3 en el tramo AB
 * @param {String} sentido 
 */
export function matricesRigidezAB(sentido){
    let texto = [];
    texto.push(faux.pasaLatex( "K", sentido,"l",_ELEMENTOS[0][1].localK));
    if(sentido === 'AB')
        texto.push(faux.pasaLatex( "\\alpha = 0^o \\Rightarrow C", sentido,"",_ELEMENTOS[0][1].C));
    else
        texto.push(faux.pasaLatex( "\\alpha = 270^o \\Rightarrow C", sentido,"",_ELEMENTOS[0][1].C));
    texto.push(faux.pasaLatex( "K", sentido,"g",_ELEMENTOS[0][1].globalK));
    return texto;
}

/**
 * Función que devuelve el texto latex para la pestaña 3 en el tramo BC
 * @param {String} sentido 
 */
export function matricesRigidezBC(sentido){
    let texto = [];
    texto.push(faux.pasaLatex( "K", sentido,"l",_ELEMENTOS[1][1].localK));
    if(sentido === 'BC')
        texto.push(faux.pasaLatex( "\\alpha = 30^o \\Rightarrow C", sentido,"",_ELEMENTOS[1][1].C));
    else
        texto.push(faux.pasaLatex( "\\alpha = 210^o \\Rightarrow C", sentido,"",_ELEMENTOS[1][1].C));
    texto.push(faux.pasaLatex( "K", sentido,"g",_ELEMENTOS[1][1].globalK));
    return texto;
}


export function obtenKg(){
    return faux.pasaLatex( "K", "", "g", Ktot);
}