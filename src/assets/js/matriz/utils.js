// FUNCIONES DE DIBUJADO DE FLECHAS

/**
 * Función para dibujar las fechas del sentido
 * @param {*} canvas Canvas donde dibujar la flechas
 * @param {*} fromx Coordenada X desde donde dibujar
 * @param {*} fromy Coordenada Y desde donde dibujar
 * @param {*} tox Coordenada X hasta donde dibujar
 * @param {*} toy Coordenada Y hasta donde dibujar
 */
export function dibujarFlecha(canvas, fromx, fromy, tox, toy) {
    
    // Variables canvas
    let ctx = canvas.getContext('2d');

    // Configuracion flechas canvas
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'steelblue';
    ctx.fillStyle = 'steelblue'; // for the triangle fill
    ctx.lineJoin = 'butt';

    limpiar(ctx, fromx-50, fromy-50, tox+50, toy+50);
    ctx.beginPath();
    // A - B
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    canvas_arrow(ctx, fromx, fromy, tox, toy, 7);

    // Calculo alfa
    let alfa;
    if(fromy == toy) 
        alfa = fromx > tox ? 270 : 0;
    else
        alfa = (fromy != toy && fromx < tox) ? 30 : 210;
    
    if(fromy == toy)
        escribir(ctx, "α: " +alfa+"°", fromx < tox ? fromx : tox , fromy <= toy ? fromy+20 : toy-20);
    else
        escribir(ctx, "α: " +alfa+"°", fromx < tox ? fromx+30 : tox+30 , fromy <= toy ? fromy+30 : toy+30);
}

// FUNCIONES AUXILIARES
/**
 * Función auxiliar para dibujar el triangulo de las fechas del sentido
 * @param {*} context Canvas donde dibujar la flechas
 * @param {*} fromx Coordenada X desde donde dibujar
 * @param {*} fromy Coordenada Y desde donde dibujar
 * @param {*} tox Coordenada X hasta donde dibujar
 * @param {*} toy Coordenada Y hasta donde dibujar
 * @param {*} r Radio del triangulo
 */
function canvas_arrow(context, fromx, fromy, tox, toy, r) {
    let x_center = tox;
    let y_center = toy;

    let angle;
    let x;
    let y;

    context.beginPath();

    angle = Math.atan2(toy - fromy, tox - fromx);
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1 / 3) * (2 * Math.PI);
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1 / 3) * (2 * Math.PI);
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

/**
 * Función para limpiar el canvas
 * @param {*} ctx Canvas a limpiar
 * @param {*} fromx Coordenada X desde donde limpiar
 * @param {*} fromy Coordenada Y desde donde limpiar
 * @param {*} tox Coordenada X hasta donde limpiar
 * @param {*} toy Coordenada Y hasta donde limpiar
 */
function limpiar(ctx, fromx, fromy, tox, toy) {
    ctx.clearRect(fromx, fromy, tox, toy);
}

/**
 * Función para escribir en el canvas
 * @param {*} ctx Canvas
 * @param {*} texto Texto a escribir
 * @param {*} x Coordenada X desde donde escribir
 * @param {*} y Coordenada Y desde donde escribir
 */
function escribir(ctx, texto, x, y) {
    ctx.fillStyle = "rgb(41, 128, 185)";
    ctx.font = "bold 16px Arial";
    ctx.fillText( texto, x, y);
}

/**
 * Función para escribir en el canvas
 * @param {*} ctx Canvas
 * @param {*} texto Texto a escribir
 * @param {*} x Coordenada X desde donde escribir
 * @param {*} y Coordenada Y desde donde escribir
 */
export function escribirNudos(canvas, texto, color, x, y) {
    let ctx = canvas.getContext('2d');
    limpiar(ctx, x, y, x+20, y);
    ctx.fillStyle = color;
    ctx.font = "bold 16px Arial";
    ctx.fillText( texto, x, y);
}

/**
 * Función para escribir en el canvas
 * @param {*} ctx Canvas
 * @param {*} texto Texto a escribir
 * @param {*} x Coordenada X desde donde escribir
 * @param {*} y Coordenada Y desde donde escribir
 */
export function escribirSentidos(canvas, texto, color, x, y) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = "bold 18px Arial";
    ctx.fillText( texto, x, y);
}

/**
 * Función para limpiar el canvas
 * @param {*} canvas Canvas a limpiar
 */
export function limpiarTodo(canvas) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Función que genera el texto latex para la tabla de pestaña 4
 */
export function contenidoTabla(){
    let texto = "";
    
    // Fila 1
    texto += "K_{AA} = k_{AA}^1 && "; // Kaa
    texto += "K_{AB} = k_{AB}^1 && "; // Kab
    texto += "K_{AC} = \\textbf{0}"; // Kac
    texto += " \\\\ \\hline "

    // Fila 2
    texto += "K_{BA} = k_{BA}^1 && "; // Kba
    texto += "K_{BB} = k_{BB}^1 + k_{AA}^2 && "; // Kbb
    texto += "K_{BC} = k_{AB}^2"; // Kbc
    texto += " \\\\ \\hline "

    // Fila 3
    texto += "K_{CA} = \\textbf{0} && "; // Kca
    texto += "K_{CB} = k_{BA}^2 && "; // Kcb
    texto += "K_{CC} = k_{BB}^2"; // Kcc

    return texto;
}