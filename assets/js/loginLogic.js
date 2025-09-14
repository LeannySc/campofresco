document.addEventListener('DOMContentLoaded', function() {
    // Busca el formulario de login en la página actual.
    const loginForm = document.getElementById('loginForm');
    
    // Si el formulario existe, le añade la funcionalidad.
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Evita que el formulario se envíe de la manera tradicional.
            event.preventDefault(); 
            
            // Busca el formulario y la sección de roles.
            const roleSelection = document.getElementById('roleSelection');

            // Oculta el formulario de login.
            loginForm.style.display = 'none'; 
            
            // Muestra los botones de rol.
            if (roleSelection) {
                roleSelection.style.display = 'block'; 
            }
        });
    }
});