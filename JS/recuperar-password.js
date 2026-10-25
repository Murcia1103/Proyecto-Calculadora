// Simulación local: no se envían correos ni se restablece una contraseña real.
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("recover-form");
    const mensaje = document.getElementById("success-message");
    const campoCorreo = document.getElementById("email");

    if (!formulario) return;
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const correo = campoCorreo.value.trim().toLowerCase();
        const usuarios = JSON.parse(localStorage.getItem("buildcalc.usuarios") || "[]");
        const existe = usuarios.some(function (usuario) { return usuario.correo === correo; });

        mensaje.textContent = existe
            ? "Cuenta encontrada. La recuperación de correo es solo una simulación en esta versión."
            : "No encontramos una cuenta local con ese correo.";
        mensaje.style.display = "block";
    });
});
