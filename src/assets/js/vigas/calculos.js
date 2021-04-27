import evaluatex from "evaluatex/dist/evaluatex";
import { ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { calculaSegmento } from '@/assets/js/vigas/variables.js';

const DENSIDAD_PUNTOS = 1000;
let variables = { };

/**
 * Función que re-inicializa las variables
 */
export function limpiarVar(){
    variables = {};
}

/**
 * Función que inicializa las variables
 */
export function inicializar(){
    for(let i = 0; i < ejViga.tramos.length; i++){
        variables['L_'+(i+1) ] = ejViga.tramos[i].valor;
    }

    for(let i = 0; i < ejViga.elementos.length; i++){
        if(!isNaN(ejViga.elementos[i].magnitud)){
            variables[ejViga.elementos[i].nombre.replace(/(\w+)(\d+)/, '$1_$2')] = parseFloat(ejViga.elementos[i].magnitud);
        }

        if(ejViga.elementos[i].tipo === 'Voladizo vertical'){
            variables[ejViga.elementos[i].nombre.replace(/(\w+)(\d+)/, 'd_$2')] = parseFloat(ejViga.elementos[i].d);
        }
    }

    if(ejViga.E){
        variables['me'] = ejViga.E * Math.pow(10, 7);
        variables['I'] = ejViga.I * Math.pow(10, -8);
    }
}

/**
 * Función que actualiza el valor de un tramo
 * @param {Number} pos Número del tramo
 * @param {Number} valor Nuevo valor
 */
export function actualizaTramo(pos, valor){
    variables['L'] = variables['L'] - variables['L_'+pos] + parseFloat(valor);
    variables['L_'+pos] = parseFloat(valor);
}

/**
 * Función que actualiza el valor de un elemento
 * @param {String} nom ID del elemento
 * @param {Number} valor Nuevo valor
 */
export function actualizaElemento(nom, valor){
    variables[nom.replace(/(\w+)(\d+)/, '$1_$2')] = parseFloat(valor);
}

/**
 * Función que actualiza el valor de E e I
 * @param {String} variable Variables E o I
 * @param {Number} valor Nuevo valor
 */
export function actualizaEeI(variable, valor){
    if(variable === 'E')
        variables['me'] = parseFloat(valor) * Math.pow(10, 7);
    else
        variables[variable] = parseFloat(valor) * Math.pow(10, -8);
}

/**
 * Función para transformar algunos parametros de Katex para que Evaluatex los puede evaluar
 */
function adaptarFormulas(){
    for (let i = 0; i < ejViga.formulas.length; i++) {
        ejViga.formulas[i].axiles = ejViga.formulas[i].axiles.replaceAll('\\pi', 'PI');
        ejViga.formulas[i].cortantes = ejViga.formulas[i].cortantes.replaceAll('\\pi', 'PI');
        ejViga.formulas[i].flectores = ejViga.formulas[i].flectores.replaceAll('\\pi', 'PI');
        if(ejViga.E){
            ejViga.formulas[i].deformada = ejViga.formulas[i].deformada.replaceAll('\\pi', 'PI');
            ejViga.formulas[i].deformada = ejViga.formulas[i].deformada.replaceAll('E', 'me');
        }
    }
}

/**
 * Función para transformar algunos parametros de Katex para que Evaluatex los puede evaluar
 */
 function restaurarFormulas(){
    for (let i = 0; i < ejViga.formulas.length; i++)
        ejViga.formulas[i].deformada = ejViga.formulas[i].deformada.replaceAll('me', 'E');
}

/**
 * Función que evalua las formulas para calcular los datos de las gráficas
 * @param {Boolean} deforma Indica si se debe calcular la deformada
 * @returns {Object} Datos de las gráficas
 */
export function calcular(deforma){
    for(let i = 0; i < ejViga.auxiliares.length; i++){
        variables['A_'+(i+1) ] = evaluatex(ejViga.auxiliares[i], variables, { latex: true })();
    }

    adaptarFormulas();

    const resultado= {
        axiles: [],
        cortantes: [],
        flectores: [], 
        deformada: []
    }

    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;

    let tramo = 0, total = parseFloat(ejViga.tramos[0].valor);
    try{
        for (let x = 0.0; x <= calculaSegmento(ejViga.tramos.length); x += incremento) {
            resultado.axiles.push([parseFloat(x.toFixed(3)), evaluatex(ejViga.formulas[tramo].axiles, { ...variables, x}, { latex: true })()]);
            resultado.cortantes.push([parseFloat(x.toFixed(3)), evaluatex(ejViga.formulas[tramo].cortantes, { ...variables, x}, { latex: true })()]);
            resultado.flectores.push([parseFloat(x.toFixed(3)), evaluatex(ejViga.formulas[tramo].flectores, { ...variables, x}, { latex: true })()]);
            if(deforma)
                resultado.deformada.push([parseFloat(x.toFixed(3)), evaluatex(ejViga.formulas[tramo].deformada, { ...variables, x}, { latex: true })()]);

            if(x > total){
                tramo++;
                total += parseFloat(ejViga.tramos[tramo].valor);
            } 
        }
    }catch(err){
        console.log("ERROR AL CALCULAR LOS DATOS")
        console.log(err)
        return null;
    }

    if(ejViga.E)
        restaurarFormulas();

    return resultado;
}

/**
 * Función para dibujar la línea del 0
 * @returns {Array} Datos de la línea 0
 */
export function linea0(){
    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;
    
    let resultado= [];
    for (let x = 0.0; x <= calculaSegmento(ejViga.tramos.length); x += incremento)
        resultado.push([parseFloat(x.toFixed(3)), 0]);

    return resultado;
}

/**
 * Función que evalua las formulas de la deformada para calcular los datos de las gráficas
 * @returns {Array} Datos de las gráficas
 */
export function calculaDeformada(){
    for(let i = 0; i < ejViga.auxiliares.length; i++){
        variables['A_'+(i+1) ] = evaluatex(ejViga.auxiliares[i], variables, { latex: true })();
    }

    adaptarFormulas();

    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;
    let tramo = 0, total = parseFloat(ejViga.tramos[0].valor), resultado= [];

    try{
        for (let x = 0.0; x <= calculaSegmento(ejViga.tramos.length); x += incremento) {
            resultado.push([parseFloat(x.toFixed(3)), evaluatex(ejViga.formulas[tramo].deformada, { ...variables, x}, { latex: true })()]);


            if(x > total){
                tramo++;
                total += parseFloat(ejViga.tramos[tramo].valor);
            } 
        }
    }catch(err){
        console.log("ERROR AL CALCULAR LOS DATOS")
        console.log(err)
        return null;
    }

    return resultado;
}