// Variable que comprueba si el usuario se ha registrado como profesor
export let profesor = false;

/**
 * Función para comprobar el usuario
 */
export function getUser(){
    const log = sessionStorage.getItem("user");
    if (!log)
        profesor = false;
    else
        profesor = true;
}

/**
 * Función que borra los datos de autenticación guardados
 */
export function logout(){
    sessionStorage.setItem("user", '');
    sessionStorage.setItem("pass", '');
    profesor = false;
}