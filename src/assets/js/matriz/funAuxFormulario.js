export function compruebaDatosBasicos(materiales, secciones, nodos){
    let mensajes = new Set();
    let errores = new Set();
    materiales.forEach((material, i) => {
        if(isNaN(material[1].min) || isNaN(material[1].max) || isNaN(material[1].valor)){
            mensajes.add('Los datos de los materiales estan incompletos.');
            if(isNaN(material[1].min)) errores.add('MatMin'+i);
            if(isNaN(material[1].max))errores.add('MatMax'+i);
            if(isNaN(material[1].valor))errores.add('MatVal'+i);
        }else if( parseFloat(material[1].min) > parseFloat(material[1].valor) ||
                  parseFloat(material[1].valor) > parseFloat(material[1].max)){
            mensajes.add('El valor por defecto para el módulo elástico debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(material[1].min) > parseFloat(material[1].valor)) errores.add('MatMin'+i);
            if(parseFloat(material[1].valor) > parseFloat(material[1].max)) errores.add('MatMax'+i);
            errores.add('MatVal'+i);
        }
    });

    secciones.forEach((seccion, i) => { 
        if(isNaN(seccion[1].min) || isNaN(seccion[1].max) || isNaN(seccion[1].valor) || 
           isNaN(seccion[2].min) || isNaN(seccion[2].max) || isNaN(seccion[2].valor)){
            mensajes.add('Los datos de las secciones estan incompletos.');
            if(isNaN(seccion[1].min)) errores.add('AnMin'+i);
            if(isNaN(seccion[1].max))errores.add('AnMax'+i);
            if(isNaN(seccion[1].valor))errores.add('AnVal'+i);
            if(isNaN(seccion[2].min)) errores.add('AlMin'+i);
            if(isNaN(seccion[2].max))errores.add('AlMax'+i);
            if(isNaN(seccion[2].valor))errores.add('AlVal'+i);
        }else if( parseFloat(seccion[1].min) < parseFloat(seccion[1].valor) ||
                  parseFloat(seccion[1].valor) > parseFloat(seccion[1].max)){
            mensajes.add('El valor por defecto para el ancho debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(seccion[1].min) > parseFloat(seccion[1].valor)) errores.add('AnMin'+i);
            if(parseFloat(seccion[1].valor) > parseFloat(seccion[1].max)) errores.add('AnMax'+i);
            errores.add('AnVal'+i);
        }else if( parseFloat(seccion[2].min) > parseFloat(seccion[2].valor) ||
                  parseFloat(seccion[2].valor) > parseFloat(seccion[2].max)){
            mensajes.add('El valor por defecto para la altura debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(seccion[2].min) > parseFloat(seccion[2].valor)) errores.add('AlMin'+i);
            if(parseFloat(seccion[2].valor) > parseFloat(seccion[2].max)) errores.add('AlMax'+i);
            errores.add('AlVal'+i);
        }else if( parseFloat(seccion[1].valor) !== parseFloat(seccion[2].valor)){
            mensajes.add('Las secciones deben ser rectangulares, revise los datos.');
            errores.add('AnVal'+i);
            errores.add('AlVal'+i);
        }
    });

    nodos.forEach((nodo, i) => { 
        if(isNaN(nodo[1].min) || isNaN(nodo[1].max) || isNaN(nodo[1].valor) || 
           isNaN(nodo[2].min) || isNaN(nodo[2].max) || isNaN(nodo[2].valor)){
            mensajes.add('Los datos de los nodos estan incompletos.');
            if(isNaN(nodo[1].min)) errores.add('Xmin'+i);
            if(isNaN(nodo[1].max))errores.add('Xmax'+i);
            if(isNaN(nodo[1].valor))errores.add('Xval'+i);
            if(isNaN(nodo[2].min)) errores.add('Ymin'+i);
            if(isNaN(nodo[2].max))errores.add('Ymax'+i);
            if(isNaN(nodo[2].valor))errores.add('Yval'+i);
        }else if( parseFloat(nodo[1].min) < parseFloat(nodo[1].valor) ||
                  parseFloat(nodo[1].valor) > parseFloat(nodo[1].max)){
            mensajes.add('El valor por defecto para la coordenada X debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(nodo[1].min) > parseFloat(nodo[1].valor)) errores.add('Xmin'+i);
            if(parseFloat(nodo[1].valor) > parseFloat(nodo[1].max)) errores.add('Xmax'+i);
            errores.add('Xval'+i);
        }else if( parseFloat(nodo[2].min) > parseFloat(nodo[2].valor) ||
                  parseFloat(nodo[2].valor) > parseFloat(nodo[2].max)){
            mensajes.add('El valor por defecto para la coordenada Y debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(nodo[2].min) > parseFloat(nodo[2].valor)) errores.add('Ymin'+i);
            if(parseFloat(nodo[2].valor) > parseFloat(nodo[2].max)) errores.add('Ymax'+i);
            errores.add('Yval'+i);
        }
    });

    return {errores, mensajes};
}

export function compruebaValoresSeleccionados(barras, cargas){
    let mensajes = new Set();
    let errores = new Set();
    barras.forEach((barra) => { 
        if(isNaN(barra[1]) || isNaN(barra[2]) || isNaN(barra[3]) || isNaN(barra[4])){
            mensajes.add('No se han seleccionado los datos para las barras.');
        }
    });

    cargas.forEach((carga, i) => { 
        if(isNaN(carga[0]) || isNaN(carga[1]) || 
           isNaN(carga[2].min) || isNaN(carga[2].max) || isNaN(carga[2].valor)){
            if(isNaN(carga[0]) || isNaN(carga[1]))
                mensajes.add('No se han seleccionado los datos para las cargas.');
            else
                mensajes.add('Los datos de las cargas estan incompletos.');
            if(isNaN(carga[2].min)) errores.add('CarMin'+i);
            if(isNaN(carga[2].max))errores.add('CarMax'+i);
            if(isNaN(carga[2].valor))errores.add('CarVal'+i);
        }else if( parseFloat(carga[2].min) < parseFloat(carga[2].valor) ||
                  parseFloat(carga[2].valor) > parseFloat(carga[2].max)){
            mensajes.add('El valor por defecto para la carga debe estar entre el mínimo y el máximo establecido.');
            if(parseFloat(carga[2].min) > parseFloat(carga[2].valor)) errores.add('CarMin'+i);
            if(parseFloat(carga[2].valor) > parseFloat(carga[2].max)) errores.add('CarMax'+i);
            errores.add('CarVal'+i);
        }
    });

    return {errores, mensajes};
}