// Cerrar la sesión del servidor al usar el enlace Salir del menú.
document.addEventListener("DOMContentLoaded", function () {
    const enlaceSalir = document.querySelector(".btn-salir");
    if (!enlaceSalir) return;

    enlaceSalir.addEventListener("click", async function (evento) {
        evento.preventDefault();
        try {
            const respuesta = await fetch("/api/auth/logout", { method: "POST" });
            if (!respuesta.ok) alert("No se pudo confirmar el cierre de sesión con el servidor.");
        } catch (error) {
            alert("No se pudo contactar al servidor para cerrar la sesión.");
        }
        window.location.href = "index.html";
    });
});
