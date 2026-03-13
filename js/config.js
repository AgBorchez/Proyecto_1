//export const API_SOCIOS_URL = 'https://zxgym.onrender.com/api/socios';
export const API_SOCIOS_URL = 'https://localhost:7102/api/socios';
//export const API_ENTRENADORES_URL = 'https://zxgym.onrender.com/api/Entrenador';
export const API_ENTRENADORES_URL = 'https://localhost:7102/api/Entrenador';

//variables globales de estado
export const EstadoSocios = {
    currentSortBy: "dni",
    dniActual: null,
    fechaAlta: "",
    fechaVencimiento: "",
    PlanSeleccionado: null,
    
};

export const EstadoPagina = {
    EditionMode: false,
    CurrentIsAscending: true,
    FiltroEstadoSocios: true,
    Pasoactual: 1
};

//Modo claro/oscuro
export function inicializarTema() {
    const btn_theme = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!btn_theme) return;

    
    btn_theme.checked = (localStorage.getItem('theme') === 'dark');

    btn_theme.addEventListener('change', () => {
        const nuevoTema = btn_theme.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nuevoTema);
        localStorage.setItem('theme', nuevoTema); 
    });
}