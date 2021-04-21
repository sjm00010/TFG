// FUNCIONES AUXILIARES

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