// Funciones sencillas que comparten las pantallas de cálculo.
// El sitio debe abrirse con Live Server o un servidor local para poder leer el JSON.
(function () {
    let inputActivo = null;
    let promesaConfiguracion = null;

    function cargarConfiguracion() {
        if (!promesaConfiguracion) {
            promesaConfiguracion = fetch("JSON/configuracion.json")
                .then(function (respuesta) {
                    if (!respuesta.ok) {
                        throw new Error("No se pudo leer JSON/configuracion.json");
                    }
                    return respuesta.json();
                })
                .catch(function (error) {
                    console.error(error);
                    alert("No se pudo cargar la configuración. Abre el proyecto con Live Server o un servidor local.");
                    return null;
                });
        }
        return promesaConfiguracion;
    }

    function iniciarTeclado(ids) {
        const campos = ids.map(function (id) {
            return document.getElementById(id);
        }).filter(Boolean);

        if (campos.length === 0) return;
        inputActivo = campos[0];

        campos.forEach(function (campo) {
            campo.addEventListener("focus", function () {
                inputActivo = campo;
            });
        });
    }

    function escribir(caracter) {
        const activo = document.activeElement;
        if (activo && activo.tagName === "INPUT" && activo.type !== "checkbox") {
            inputActivo = activo;
        }
        if (!inputActivo) return;

        const simbolo = String(caracter);
        const valor = inputActivo.value;
        if ((simbolo === "." || simbolo === ",") && /[.,]/.test(valor)) return;
        if ((simbolo === "." || simbolo === ",") && valor.length === 0) {
            inputActivo.value = "0.";
        } else {
            inputActivo.value += simbolo === "," ? "." : simbolo;
        }
        inputActivo.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function borrar() {
        const activo = document.activeElement;
        if (activo && activo.tagName === "INPUT" && activo.type !== "checkbox") {
            inputActivo = activo;
        }
        if (!inputActivo) return;
        inputActivo.value = inputActivo.value.slice(0, -1);
        inputActivo.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // Subprogramas internos: los usan los cálculos, no aparecen como opciones del menú.
    function calcularSuperficie(largo, ancho) {
        return largo * ancho;
    }

    function calcularVolumen(largo, ancho, espesor) {
        return calcularSuperficie(largo, ancho) * espesor;
    }

    function leerNumero(id, etiqueta) {
        const campo = document.getElementById(id);
        if (!campo) return null;
        const texto = campo.value.trim().replace(",", ".");
        const numero = Number(texto);

        if (texto === "" || !Number.isFinite(numero) || numero <= 0) {
            alert("Ingresa un valor mayor que cero para: " + etiqueta + ".");
            campo.focus();
            return null;
        }
        return numero;
    }

    function mostrarNumero(valor, decimales) {
        const precision = typeof decimales === "number" ? decimales : 2;
        return Number(Number(valor).toFixed(precision)).toString();
    }

    function guardarResultado(tipo, datos) {
        const todos = JSON.parse(localStorage.getItem("buildcalc.resultados") || "{}");
        todos[tipo] = datos;
        localStorage.setItem("buildcalc.resultados", JSON.stringify(todos));
    }

    function obtenerResultado(tipo) {
        const todos = JSON.parse(localStorage.getItem("buildcalc.resultados") || "{}");
        return todos[tipo] || null;
    }

    function escribirResultados(tipo, campos) {
        const datos = obtenerResultado(tipo);
        if (!datos) return;

        Object.keys(campos).forEach(function (clave) {
            const elemento = document.getElementById(campos[clave]);
            if (elemento && datos[clave] !== undefined) {
                const decimales = datos.decimales && datos.decimales[clave];
                elemento.textContent = mostrarNumero(datos[clave], decimales);
            }
        });
    }

    function conectarCalculo(callback) {
        const boton = document.querySelector(".btn-calcular");
        if (!boton) return;

        boton.addEventListener("click", async function (evento) {
            evento.preventDefault();
            const configuracion = await cargarConfiguracion();
            if (!configuracion) return;

            const resultado = callback(configuracion);
            if (!resultado) return;

            guardarResultado(resultado.tipo, resultado.datos);
            window.location.href = boton.getAttribute("href");
        });
    }

    window.BuildCalc = {
        cargarConfiguracion: cargarConfiguracion,
        iniciarTeclado: iniciarTeclado,
        calcularSuperficie: calcularSuperficie,
        calcularVolumen: calcularVolumen,
        leerNumero: leerNumero,
        mostrarNumero: mostrarNumero,
        escribirResultados: escribirResultados,
        conectarCalculo: conectarCalculo
    };

    // Las interfaces ya llaman estas funciones desde onclick; se conservan los botones.
    window.escribir = escribir;
    window.borrar = borrar;
})();
