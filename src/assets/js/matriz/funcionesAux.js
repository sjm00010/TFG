import * as cla from "./clases";
import {zeros} from 'mathjs'

/**
 * Función para leer los materiales
 * @param {Array} materiales Matriz con los datos a interpretar
 * @returns {Array} Matriz de materiales
 */
export function leerMateriales(materiales) {
    let aux = [];
    for (let i = 0; i < materiales.length; i++) {
        let numMat = materiales[i][0];
        let E = materiales[i][1];
        let nu = materiales[i][2];
        aux.push([numMat, new cla.Material(numMat, E, nu)]);
    }
    return aux;
}

/**
 * Función para leer los nodos
 * @param {Array} nodos Matriz con los datos a interpretar
 * @returns {Array} Matriz de nodos
 */
export function leerNodos(nodos) {
    let aux = [];
    for (let i = 0; i < nodos.length; i++) {
        let numNodo = nodos[i][0];
        let x = nodos[i][1];
        let y = nodos[i][2];
        aux.push([numNodo, new cla.Nodo(numNodo, x, y)]);
    }
    return aux;
}

/**
 * Función para leer las secciones
 * @param {Array} secciones Matriz con los datos a interpretar
 * @returns {Array} Matriz de secciones
 */
export function leerSecciones(secciones) {
    let aux = [];
    for (let i = 0; i < secciones.length; i++) {
        let numSec = secciones[i][0];
        let b = secciones[i][1];
        let h = secciones[i][2];
        aux.push([numSec, new cla.Seccion(numSec, b, h)]);
    }
    return aux;
}

/**
 * Función para leer los elementos
 * @param {Array} elementos Matriz con los datos a interpretar
 * @returns {Array} Matriz de elementos
 */
export function leerElementos(elementos) {
    let aux = [];
    for (let i = 0; i < elementos.length; i++) {
        let numElem = elementos[i][0];
        let nodoA = elementos[i][1];
        let nodoB = elementos[i][2];
        let material = elementos[i][3];
        let section = elementos[i][4];
        aux.push([numElem, new cla.Barra(numElem, nodoA, nodoB, material, section)]);
    }
    return aux;
}

/**
 * Función para sumar dos matrices
 * @param {Matriz} a Matriz 1 a sumar
 * @param {Matriz} b Matriz 2 a sumar
 * @returns {Matriz} Matriz sumada
 */
export function sumaMatrices(a, b) {
    if (a.length === b.length) {
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length; j++) {
                a[i][j] += b[i][j];
            }
        }
    } else if (b.length > a.length) {
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length; j++) {
                b[i][j] += a[i][j];
            }
        }
        return b;
    } else {
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b.length; j++) {
                a[i][j] += b[i][j];
            }
        }
    }
    return a;
}

/**
 * Ensambla la matriz de rigidez total, que sera de nxn, siendo n=3xnumero de nodos
 * @param {Nodo} _NODOS nodos
 * @param {Elemento} _ELEMENTOS elementos
 * @returns {Array} Matriz Kt
 */
export function creaMatrizK(_NODOS, _ELEMENTOS) {
    let n = 3 * _NODOS.length;
    let Kt = zeros(n, n)._data;

    for (let i = 0; i < _NODOS.length; i++) {
        for (let j = 0; j < _NODOS.length; j++) {
            let Kaux = zeros(3, 3)._data;
            for (let k = 0; k < _ELEMENTOS.length; k++) {
                if (i === j && i + 1 === _ELEMENTOS[k][1].nodoA) {
                    Kaux = sumaMatrices(Kaux, _ELEMENTOS[k][1].KAA);
                } else if (i === j && i + 1 === _ELEMENTOS[k][1].nodoB) {
                    Kaux = sumaMatrices(Kaux, _ELEMENTOS[k][1].KBB);
                } else if (i !== j && i + 1 === _ELEMENTOS[k][1].nodoA && j + 1 === _ELEMENTOS[k][1].nodoB) {
                    Kaux = sumaMatrices(Kaux, _ELEMENTOS[k][1].KAB);
                } else if (i !== j && i + 1 === _ELEMENTOS[k][1].nodoB && j + 1 === _ELEMENTOS[k][1].nodoA) {
                    Kaux = sumaMatrices(Kaux, _ELEMENTOS[k][1].KBA);
                }
            }

            for (let m = 3 * i, q = 0; m < 3 * i + 3; m++, q++) {
                for (let n = 3 * j, w = 0; n < 3 * j + 3; n++, w++) {
                    Kt[m][n] = Kaux[q][w];
                }
            }
        }
    }
    return Kt;
}

/**
 * Devuelve el vector de fuerzas total con los valores de las cargas aplicadas sobre la estructura
 * @param {Nodo} _NODOS nodos
 * @param {Matriz} cargas elementos
 * @returns {Array} Fvector
 */
export function creaVectorF(_NODOS, cargas) {
    let n = 3 * _NODOS.length;
    let Fv = zeros(n, 1)._data;
    for (let i = 0; i < cargas.length; i++) {
        let nodo = cargas[i][0];
        let dof = cargas[i][1];
        let value = cargas[i][2];
        Fv[(nodo - 1) * 3 + dof - 1][0] = value;
    }
    return Fv;
}

/**
 * Borra la columna de una matriz
 * @param {Matriz} arr Matriz
 * @param {Number} col Columna
 * @returns {aux} Matriz resultante
 */
export function deleteCol(arr, col) {
    let aux = arr;
    for (let i = 0; i < aux.length; i++) {
        aux[i].splice(col, 1);
    }
    return aux;
}

/**
 * Devuelve la matriz de rigidez de la estructura reducida, es decir, 
 * elimina las filas y columnas de los grados de libertad impedidos por los apoyos
 * @param {Matriz} Kt Ktot
 * @param {Matriz} bc barras
 * @param {Nodo} _NODOS nodos
 * @returns {Matriz} Kr, matriz resultado
 */
export function reducirMatrizK(Kt, bc, _NODOS) {
    // Copio la entrada para que no afecten las operaciones realizadas
    let Kr = Kt.map(function (arr) {
        return arr.slice();
    });

    // Ordeno las condiciones de contorno para que vayan del nudo de menor
    // numeracion al de mayor numeración y del dof menor al mayor
    let bc_sorted = [];
    for (let i = 0; i < _NODOS.length; i++) {
        for (let dof = 1; dof < 4; dof++) {
            for (let k = 0; k < bc.length; k++) {
                if (bc[k][0] === _NODOS[i][0] && bc[k][1] === dof) {
                    bc_sorted.push(bc[k]);
                }
            }
        }
    }

    for (let i = bc_sorted.length - 1; i >= 0; i--) {
        let nodo = bc_sorted[i][0];
        let dof = bc_sorted[i][1];
        let m = (nodo - 1) * 3 + dof - 1;
        Kr.splice(m, 1); // Borra la fila
        Kr = deleteCol(Kr, m); // Borra la columna
    }

    return Kr;
}

/**
 * Devuelve el vector de fuerzas de la estructura reducido, es decir, 
 * elimina las filas y columnas de los grados de libertad impedidos por los apoyos
 * @param {Matriz} Ft Ftot
 * @param {Matriz} bc barras
 * @param {Nodo} _NODOS nodos
 * @returns {Matriz} Fr, matriz resultado
 */
export function reducirFvector(Ft, bc, _NODOS) {
    // Copio la entrada para que no afecten las operaciones realizadas
    let Fr = Ft.map(function (arr) {
        return arr.slice();
    });

    // Ordeno las condiciones de contorno para que vayan del nudo de menor
    // numeracion al de mayor numeración y del dof menor al mayor
    let bc_sorted = [];
    for (let i = 0; i < _NODOS.length; i++) {
        for (let dof = 1; dof < 4; dof++) {
            for (let k = 0; k < bc.length; k++) {
                if (bc[k][0] === _NODOS[i][0] && bc[k][1] === dof) {
                    bc_sorted.push(bc[k]);
                }
            }
        }
    }

    for (let i = bc_sorted.length - 1; i >= 0; i--) {
        let nodo = bc_sorted[i][0];
        let dof = bc_sorted[i][1];
        let m = (nodo - 1) * 3 + dof - 1;
        Fr.splice(m, 1); // Borra la fila
    }

    return Fr;
}

/**
 * Devuelve el vector de desplazamientos con todas sus componentes
 * @param {Array} Dr Dvector reduced
 * @param {Matriz} bc barras
 * @param {Nodo} _NODOS nodos
 * @returns {Array} Dvector tot
 */
export function creaDvector(Dr, bc, _NODOS) {
    // Copio la entrada para que no afecten las operaciones realizadas
    let Dt = Dr.map(function (arr) {
        return arr.slice();
    });

    // Ordeno las condiciones de contorno para que vayan del nudo de menor
    // numeracion al de mayor numeración y del dof menor al mayor
    let bc_sorted = [];
    for (let i = 0; i < _NODOS.length; i++) {
        for (let dof = 1; dof < 4; dof++) {
            for (let k = 0; k < bc.length; k++) {
                if (bc[k][0] === _NODOS[i][0] && bc[k][1] === dof) {
                    bc_sorted.push(bc[k]);
                }
            }
        }
    }

    for (let i = 0; i < bc_sorted.length; i++) {
        let nodo = bc_sorted[i][0];
        let dof = bc_sorted[i][1];
        let m = (nodo - 1) * 3 + dof - 1;
        Dt.splice(m, 0, 0.0); // Inserto un 0 en la posicion m
    }

    Dt = [].concat.apply([], Dt); // Transformo la matriz a vector

    return Dt;
}

/**
 * Función para pasar la matriz a latex
 * @param {*} nombre Nombre de la matriz
 * @param {*} sup Superindice
 * @param {*} sub Subindice
 * @param {*} matriz Matriz
 */
export function pasaLatex(nombre, sup, sub, matriz) {
    let texto = ""+ nombre +"_{"+sub+"}^{"+sup+"} = \\begin{pmatrix} ";
    if(nombre.length === 0) texto = "\\begin{pmatrix}";
    for(let i = 0; i < matriz.length; i++){
        for(let j = 0; j < matriz[i].length; j++){
            texto += matriz[i][j].toPrecision(4).replace(/e\+?(-?[0-9]+)/g, '\\times10^{$1}').replace(/(\d+)\.0+/g, '$1').replace(/(\d+\.[1-9]+)0+/g, '$1');
            if(j+1 != matriz[i].length) texto += " & ";
        }
        if(i+1 != matriz.length)texto += " \\\\ "
    }
    texto += "\\end{pmatrix} ";
    return texto;
}