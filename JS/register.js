// El servidor valida los datos, guarda la cuenta y crea la sesión.
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("registro-form");
    const entradaClave = document.getElementById("password");
    const confirmarClave = document.getElementById("confirm-password");
    const errorClave = document.getElementById("password-error");

    [["btn-toggle-pass", entradaClave], ["btn-toggle-confirm", confirmarClave]].forEach(function (par) {
        const boton = document.getElementById(par[0]);
        const campo = par[1];
        if (!boton || !campo) return;
        boton.addEventListener("click", function () {
            const icono = boton.querySelector("i");
            const mostrar = campo.type === "password";
            campo.type = mostrar ? "text" : "password";
            if (icono) {
                icono.classList.toggle("fa-eye", !mostrar);
                icono.classList.toggle("fa-eye-slash", mostrar);
            }
        });
    });

    if (!formulario) return;
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        const nombre = document.getElementById("fullname").value.trim();
        const usuario = document.getElementById("username").value.trim();
        const correo = document.getElementById("email").value.trim().toLowerCase();

        if (entradaClave.value !== confirmarClave.value) {
            errorClave.textContent = "Las contraseñas no coinciden";
            errorClave.style.display = "block";
            return;
        }
        if (entradaClave.value.length < 8) {
            errorClave.textContent = "La contraseña debe tener al menos 8 caracteres.";
            errorClave.style.display = "block";
            return;
        }
        errorClave.style.display = "none";

        try {
            const respuesta = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nombre, usuario: usuario, correo: correo, clave: entradaClave.value })
            });
            const resultado = await respuesta.json();
            if (!respuesta.ok) {
                alert(resultado.mensaje || "No se pudo crear la cuenta.");
                return;
            }
            window.location.href = "menu.html";
        } catch (error) {
            alert("No se pudo contactar al servidor. Inicia BuildCalc con npm start.");
        }
    });
});
