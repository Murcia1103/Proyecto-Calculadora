// Registro local para la demostración académica (no hay servidor).
function calcularHashRegistro(texto) {
    const datos = new TextEncoder().encode(texto);
    return crypto.subtle.digest("SHA-256", datos).then(function (resultado) {
        return Array.from(new Uint8Array(resultado)).map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");
    });
}

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
            errorClave.style.display = "block";
            return;
        }
        errorClave.style.display = "none";

        const usuarios = JSON.parse(localStorage.getItem("buildcalc.usuarios") || "[]");
        const existe = usuarios.some(function (item) {
            return item.correo === correo || item.usuario.toLowerCase() === usuario.toLowerCase();
        });
        if (existe) {
            alert("Ese correo o nombre de usuario ya está registrado.");
            return;
        }

        if (!window.crypto || !crypto.subtle) {
            alert("Para registrarte, abre el proyecto con Live Server o localhost.");
            return;
        }

        const hash = await calcularHashRegistro(entradaClave.value);
        usuarios.push({
            nombre: nombre,
            usuario: usuario,
            correo: correo,
            claveHash: hash
        });
        localStorage.setItem("buildcalc.usuarios", JSON.stringify(usuarios));
        sessionStorage.setItem("buildcalc.usuarioActivo", usuario);
        window.location.href = "menu.html";
    });
});
