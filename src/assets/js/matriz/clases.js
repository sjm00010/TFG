import {_MATERIALES, _NODOS, _SECCIONES} from '@/assets/js/matriz/calculoMatrices.js';
import {zeros, multiply, transpose} from 'mathjs';

/**
 * Clase que representa un material
 * @type Material
 */
export class Material {
    constructor(number, E, nu) {
        this.number = number;
        this.E = E;     // Modulo elástico
        this.nu = nu;   // Coeficiente de Poisson
    }
}

/**
 * Clase que representa un nodo
 * @type Nodo
 */
export class Nodo {
    constructor(number, coordX, coordY) {
        this.number = number;
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

/**
 * Clase que representa una sección
 * @type Seccion
 */
export class Seccion {
    constructor(number, b, h) {
        this.number = number;
        this.b = parseFloat(b.toString());
        this.h = parseFloat(h.toString());
        this.A = b * h;
        this.I = (1.0 / 12.0) * b * Math.pow(h, 3);
    }
}

/**
 * Clase que representa una barra
 * @type Barra
 */
export class Barra {
    constructor(numelem, nodoA, nodoB, material, section) {
        this.numelem = numelem;
        this.nodoA = nodoA;
        this.nodoB = nodoB;
        this.material = material;
        this.section = section;
        this.localK = giveLocalStiffnessMatrix(section, material, getTam(nodoA, nodoB)); 
        let angulo = getAngulo(nodoA, nodoB);
        this.C = calculaC(angulo);
        this.globalK = multiply(this.C, multiply(this.localK, transpose(this.C)));
        this.KAA = submatriz(3,3,this.globalK);
        this.KAB = submatriz(3,6,this.globalK);
        this.KBA = submatriz(6,3,this.globalK);
        this.KBB = submatriz(6,6,this.globalK);
    }
}

/**
 * Función para extraer una submatriz, para calcular las Kxx
 * @param {Number} f Fila hasta donde se extrae, inicio en f-3
 * @param {Number} c Columna hasta donde se extrae, inicio en c-3
 * @param {Array} m Matriz de datos
 * @returns {Array} Submatriz
 */
export function submatriz(f, c, m) {
    var subMat = [];
    for (let i = f - 3; i < f; i++) {
        var aux = [];
        for (let j = c - 3; j < c; j++) {
            aux.push(m[i][j]);
        }
        subMat.push(aux);
    }
    return subMat;
}

/**
 * Función que busca una sección por su identificador
 * @param {Number} id Identificador
 * @returns {Seccion} Null si no existe
 */
function getSeccion(id) {
    for (let i = 0; i < _SECCIONES.length; i++) {
        if (id === _SECCIONES[i][0]) {
            return _SECCIONES[i][1];
        }
    }
}

/**
 * Función que busca un material por su identificador
 * @param {Number} id Identificador
 * @returns {Seccion} Null si no existe
 */
function getMaterial(id) {
    for (let i = 0; i < _MATERIALES.length; i++) {
        if (id === _MATERIALES[i][0]) {
            return _MATERIALES[i][1];
        }
    }
}

/**
 * Función que calcula la longitud
 * @param {Number} nodoA Nodo 1
 * @param {Number} nodoB Nodo 2
 * @returns {Number} Logitud
 */
function getTam(nodoA, nodoB) {
    let nodo1, nodo2;
    for (let i = 0; i < _NODOS.length; i++) {
        if (nodoA === _NODOS[i][0]) {
            nodo1 = _NODOS[i][1];
        } else if (nodoB === _NODOS[i][0]) {
            nodo2 = _NODOS[i][1];
        }
    }

    let x1 = nodo1.coordX;
    let y1 = nodo1.coordY;
    let x2 = nodo2.coordX;
    let y2 = nodo2.coordY;
    let L = Math.sqrt(Math.pow((x2 - x1), 2.0) + Math.pow((y2 - y1), 2.0));
    return L;
}

/**
 * Funcion que obtiene el angulo de una barra
 * @param {Number} nodoA Nodo de partida de la barra
 * @param {Number} nodoB Nodo final de la barra
 * @returns {Number} Angulo calculado, -1 si hay un error
 */
function getAngulo(nodoA, nodoB) {
    let nodo1, nodo2;
    for (let i = 0; i < _NODOS.length; i++) {
        if (nodoA === _NODOS[i][0]) {
            nodo1 = _NODOS[i][1];
        } else if (nodoB === _NODOS[i][0]) {
            nodo2 = _NODOS[i][1];
        }
    }

    let x1 = nodo1.coordX;
    let y1 = nodo1.coordY;
    let x2 = nodo2.coordX;
    let y2 = nodo2.coordY;
    
    let angulo = -1;
    
    if ((y2 - y1) === 0.0 && x2 > x1) {
        angulo = 0.0;
    } else if ((x2 - x1) === 0.0 && y2 > y1) {
        angulo = Math.PI / 2.0;
    } else if ((y2 - y1) === 0.0 && x2 < x1) {
        angulo = Math.PI;
    } else if ((x2 - x1) === 0.0 && y2 < y1) {
        angulo = 3.0 * Math.PI / 2.0;
    } else if ((x2 > x1) && (y2 > y1)) {
        angulo = Math.atan((y2 - y1) / (x2 - x1));
    } else if ((x2 < x1) && (y2 > y1)) {
        angulo = Math.PI / 2 + Math.atan((x1 - x2) / (y2 - y1));
    } else if ((x2 < x1) && (y2 < y1)) {
        angulo = Math.PI + Math.atan((y1 - y2) / (x1 - x2));
    } else if ((x2 > x1) && (y2 < y1)) {
        angulo = 1.5 * Math.PI + Math.atan((x2 - x1) / (y1 - y2));
    } else {
        console.log("Error al calcular el angulo");
    }
        
    return angulo;
}

/**
 * Calcúla la matriz local de rigidez del elemento
 * @param {Number} seccion Id de la sección
 * @param {Number} material Id del material
 * @param {Number} tam Longitud de la barra
 * @returns {Array} K
 */
function giveLocalStiffnessMatrix(seccion, material, tam) {
    let miSection = getSeccion(seccion);
    let miMaterial = getMaterial(material);
    let A = miSection.A;
    let I = miSection.I;
    let E = miMaterial.E;
    let L = tam;
    let K = zeros(6, 6)._data;
    
    K[0][0] = E * A / L;
    K[0][3] = -E * A / L;
    K[1][1] = 12 * E * I / Math.pow(L, 3);
    K[1][2] = 6 * E * I / Math.pow(L, 2);
    K[1][4] = -12 * E * I / Math.pow(L, 3);
    K[1][5] = 6 * E * I / Math.pow(L, 2);
    K[2][1] = K[1][2];
    K[2][2] = 4 * E * I / L;
    K[2][4] = -6 * E * I / Math.pow(L, 2);
    K[2][5] = 2 * E * I / L;
    K[3][0] = K[0][3];
    K[3][3] = K[0][0];
    K[4][1] = K[1][4];
    K[4][2] = K[2][4];
    K[4][4] = 12 * E * I / Math.pow(L, 3);
    K[4][5] = -6 * E * I / Math.pow(L, 2);
    K[5][1] = K[1][5];
    K[5][2] = K[2][5];
    K[5][4] = K[4][5];
    K[5][5] = 4 * E * I / L;

    return K;
}

/**
 * Calcúla la matriz global de rigidez del elemento
 * @param {Number} angulo Alpha
 * @param {Array} kLocal Matriz local de fuerzas
 * @returns {Array} Matriz global de fuerzas
 */
function calculaC(angulo) {
    let C = zeros(6, 6)._data; // C es la matriz para el cambio de coordenadas del sistema local al global

    C[0][0] = Math.cos(angulo);
    C[0][1] = -Math.sin(angulo);
    C[1][0] = Math.sin(angulo);
    C[1][1] = C[0][0];
    C[2][2] = 1.0;
    C[3][3] = C[0][0];
    C[3][4] = C[0][1];
    C[4][3] = C[1][0];
    C[4][4] = C[1][1];
    C[5][5] = C[2][2];

    return C;
}