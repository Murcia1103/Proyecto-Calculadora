// El servidor verifica las credenciales y crea la sesión.
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
        const usuario = nombreUsuario.value.trim();
        const clave = contrasena.value;
        const casillaRecordar = formulario.querySelector('input[type="checkbox"]');

        try {
            const respuesta = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: usuario,
                    clave: clave,
                    recordar: Boolean(casillaRecordar && casillaRecordar.checked)
                })
            });
            const resultado = await respuesta.json();
            if (!respuesta.ok) {
                alert(resultado.mensaje || "No se pudo iniciar sesión.");
                return;
            }

            if (casillaRecordar && casillaRecordar.checked) {
                localStorage.setItem("buildcalc.usuarioRecordado", usuario);
            } else {
                localStorage.removeItem("buildcalc.usuarioRecordado");
            }
            window.location.href = "menu.html";
        } catch (error) {
            alert("No se pudo contactar al servidor. Inicia BuildCalc con npm start.");
        }
    });

    const usuarioRecordado = localStorage.getItem("buildcalc.usuarioRecordado");
    if (usuarioRecordado && nombreUsuario) nombreUsuario.value = usuarioRecordado;
});
