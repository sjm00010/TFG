// Variable que comprueba si el usuario se ha registrado como profesor
export let profesor = false;

/**
 * Función para comprobar el usuario
 */
export function getUser(){
    const auth = localStorage.getItem("auth");
    if (!auth){
        localStorage.setItem("auth", 'alumno');
        profesor = false;
    }else if(auth =='profesor')
        profesor = true;
}

export function logout(){
    localStorage.setItem("auth", 'alumno');
    profesor = false;
}