import evaluatex from "evaluatex/dist/evaluatex";
import { ejViga } from '@/assets/js/auxiliares/ejercicioJSON.js';
import { calculaSegmento } from '@/assets/js/vigas/variables.js';

const DENSIDAD_PUNTOS = 1000;
let variables = { };

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
        variables['mE'] = ejViga.E * Math.pow(10, 7);
        variables['I'] = ejViga.I * Math.pow(10, -8);
    }

    adaptarFormulas();
}

export function actualizaTramo(pos, valor){
    variables['L'] = variables['L'] - variables['L_'+pos] + parseFloat(valor);
    variables['L_'+pos] = parseFloat(valor);
}

export function actualizaElemento(nom, valor){
    variables[nom.replace(/(\w+)(\d+)/, '$1_$2')] = parseFloat(valor);
}

export function actualizaEeI(variable, valor){
    if(variable === 'E')
        variables['mE'] = parseFloat(valor) * Math.pow(10, 7);
    else
        variables[variable] = parseFloat(valor) * Math.pow(10, -8);
}

/**
 * Función para transformar algunos parametros de Katex para que Evaluatex los puede evaluar
 */
function adaptarFormulas(){
    for (let i = 0; i < ejViga.formulas.length; i++) {
        ejViga.formulas[i].axiles = ejViga.formulas[i].axiles.replace('\\pi', 'PI');
        ejViga.formulas[i].cortantes = ejViga.formulas[i].cortantes.replace('\\pi', 'PI');
        ejViga.formulas[i].flectores = ejViga.formulas[i].flectores.replace('\\pi', 'PI');
        if(ejViga.E){
            ejViga.formulas[i].deformada = ejViga.formulas[i].deformada.replace('\\pi', 'PI');
            ejViga.formulas[i].deformada = ejViga.formulas[i].deformada.replace('E', 'mE');
        }
    }
}

export function calcular(deforma){
    for(let i = 0; i < ejViga.auxiliares.length; i++){
        variables['A_'+(i+1) ] = evaluatex(ejViga.auxiliares[i], variables, { latex: true })();
    }

    const resultado= {
        axiles: [],
        cortantes: [],
        flectores: [], 
        deformada: []
    }

    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;

    let tramo = 0, total = parseFloat(ejViga.tramos[0].valor);
    try{
        for (let x = 0.0; x < calculaSegmento(ejViga.tramos.length); x += incremento) {
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

    return resultado;
}

export function linea0(){
    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;
    
    let resultado= [];
    for (let x = 0.0; x < calculaSegmento(ejViga.tramos.length); x += incremento)
        resultado.push([parseFloat(x.toFixed(3)), 0]);

    return resultado;
}

export function calculaDeformada(){
    for(let i = 0; i < ejViga.auxiliares.length; i++){
        variables['A_'+(i+1) ] = evaluatex(ejViga.auxiliares[i], variables, { latex: true })();
    }

    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;
    let tramo = 0, total = parseFloat(ejViga.tramos[0].valor), resultado= [];

    try{
        for (let x = 0.0; x < calculaSegmento(ejViga.tramos.length); x += incremento) {
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
    