import evaluatex from "evaluatex/dist/evaluatex";
import { ejViga } from '@/assets/js/formulario/ejercicioJSON.js';
import { calculaSegmento } from '@/assets/js/vigas/variables.js';

const DENSIDAD_PUNTOS = 1000;
let variables = { };

export function inicializar(){
    for(let i = 0; i < ejViga.tramos.length; i++){
        variables['t_'+(i+1) ] = ejViga.tramos[i].valor;
    }

    for(let i = 0; i < ejViga.elementos.length; i++){
        if(!isNaN(ejViga.elementos[i].magnitud)){
            variables[ejViga.elementos[i].nombre.replace(/(\w+)(\d+)/, '$1_$2')] = parseFloat(ejViga.elementos[i].magnitud);
        }

        if(ejViga.elementos[i].tipo === 'Barra'){
            variables[ejViga.elementos[i].nombre.replace(/(\w+)(\d+)/, 'd_$2')] = parseFloat(ejViga.elementos[i].d);
        }
    }

    adaptarFormulas();
}

export function actualizaTramo(pos, valor){
    variables['t_'+pos] = parseFloat(valor);
}

export function actualizaElemento(nom, valor){
    variables[nom.replace(/(\w+)(\d+)/, '$1_$2')] = parseFloat(valor);
}

/**
 * Función para transformar algunos parametros de Katex para que Evaluatex los puede evaluar
 */
function adaptarFormulas(){
    for (let i = 0; i < ejViga.formulas.length; i++) {
        ejViga.formulas[i].axiles = ejViga.formulas[i].axiles.replace('\\pi', 'PI');
        ejViga.formulas[i].cortantes = ejViga.formulas[i].cortantes.replace('\\pi', 'PI');
        ejViga.formulas[i].flectores = ejViga.formulas[i].flectores.replace('\\pi', 'PI');
    }
}

export function calcular(){
    for(let i = 0; i < ejViga.auxiliares.length; i++){
        variables['A_'+(i+1) ] = evaluatex(ejViga.auxiliares[i], variables, { latex: true })();
    }


    const resultado= {
        axiles: [],
        cortantes: [],
        flectores: []
    }

    let x = 0.0;
    const incremento = calculaSegmento(ejViga.tramos.length) / DENSIDAD_PUNTOS;
    const vueltas = DENSIDAD_PUNTOS / ejViga.formulas.length;

    try{
        for (const formula of ejViga.formulas) {
            for (let i = 0; i < vueltas; i++) {
                resultado.axiles.push([parseFloat(x.toFixed(3)), evaluatex(formula.axiles, { ...variables, x}, { latex: true })()]);
                resultado.cortantes.push([parseFloat(x.toFixed(3)), evaluatex(formula.cortantes, { ...variables, x}, { latex: true })()]);
                resultado.flectores.push([parseFloat(x.toFixed(3)), evaluatex(formula.flectores, { ...variables, x}, { latex: true })()]);

                x += incremento;
            }
        }
    }catch(err){
        console.log("ERROR AL CALCULAR LOS DATOS")
        console.log(err)
    }

    return resultado;
}