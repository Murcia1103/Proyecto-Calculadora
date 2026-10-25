// Inicio de sesión local por usuario y contraseña para la demostración académica.
function calcularHash(texto) {
    const datos = new TextEncoder().encode(texto);
    return crypto.subtle.digest("SHA-256", datos).then(function (resultado) {
        return Array.from(new Uint8Array(resultado)).map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".login-container form");
    const nombreUsuario = document.getElementById("username");
    const contrasena = document.getElementById("password");
    const avisoMayusculas = document.getElementById("caps-warning");
    const botonOjito = document.querySelector(".toggle-password");

    if (contrasena && avisoMayusculas) {
        contrasena.addEventListener("keyup", function (evento) {
            avisoMayusculas.style.display = evento.getModifierState("CapsLock") ? "block" : "none";
        });
    }

    if (botonOjito && contrasena) {
        botonOjito.addEventListener("click", function () {
            const icono = botonOjito.querySelector("i");
            const mostrar = contrasena.type === "password";
            contrasena.type = mostrar ? "text" : "password";
            if (icono) {
                icono.classList.toggle("fa-eye", !mostrar);
                icono.classList.toggle("fa-eye-slash", mostrar);
            }
        });
    }

    if (!formulario) return;
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        const usuarioIngresado = nombreUsuario.value.trim().toLowerCase();
        const clave = contrasena.value;
        const usuarios = JSON.parse(localStorage.getItem("buildcalc.usuarios") || "[]");
        const usuario = usuarios.find(function (item) {
            return item.usuario.toLowerCase() === usuarioIngresado;
        });

        if (!usuario) {
            alert("No encontramos ese usuario. Regístrate primero.");
            return;
        }

        if (!window.crypto || !crypto.subtle) {
            alert("Para iniciar sesión, abre el proyecto con Live Server o localhost.");
            return;
        }

        const hash = await calcularHash(clave);
        if (hash !== usuario.claveHash) {
            alert("La contraseña no coincide.");
            return;
        }

        sessionStorage.setItem("buildcalc.usuarioActivo", usuario.usuario);
        if (formulario.querySelector('input[type="checkbox"]')?.checked) {
            localStorage.setItem("buildcalc.usuarioRecordado", usuario.usuario);
        } else {
            localStorage.removeItem("buildcalc.usuarioRecordado");
        }
        window.location.href = "menu.html";
    });

    const usuarioRecordado = localStorage.getItem("buildcalc.usuarioRecordado");
    if (usuarioRecordado && nombreUsuario) {
        nombreUsuario.value = usuarioRecordado;
    }
});
