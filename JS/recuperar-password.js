// Demostración: consulta el endpoint, pero no envía correos ni cambia contraseñas.
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("recover-form");
    const mensaje = document.getElementById("success-message");
    const campoCorreo = document.getElementById("email");

    if (!formulario) return;
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        const correo = campoCorreo.value.trim().toLowerCase();

        try {
            const respuesta = await fetch("/api/auth/recovery-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correo })
            });
            const resultado = await respuesta.json();
            mensaje.textContent = resultado.mensaje || "Esta demo no restablece contraseñas.";
        } catch (error) {
            mensaje.textContent = "No se pudo contactar al servidor. Inicia BuildCalc con npm start.";
        }
        mensaje.style.display = "block";
    });
});
