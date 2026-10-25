// Cerrar la sesión local al usar el enlace Salir del menú.
document.addEventListener("DOMContentLoaded", function () {
    const enlaceSalir = document.querySelector(".btn-salir");
    if (!enlaceSalir) return;

    enlaceSalir.addEventListener("click", function () {
        sessionStorage.removeItem("buildcalc.usuarioActivo");
    });
});
