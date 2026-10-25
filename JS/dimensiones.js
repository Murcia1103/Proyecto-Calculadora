// Selección de espesor y cálculo de materiales del muro.
function guardarEspesor(espesor) {
    localStorage.setItem("buildcalc.muro.espesor", String(espesor));
    window.location.href = "dimensiones-muro.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const campoLargo = document.getElementById("largo");
    const campoAlto = document.getElementById("ancho");

    if (campoLargo && campoAlto) {
        BuildCalc.iniciarTeclado(["largo", "ancho"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo", "largo del muro");
            const alto = BuildCalc.leerNumero("ancho", "altura del muro");
            if (largo === null || alto === null) return null;

            const espesor = Number(localStorage.getItem("buildcalc.muro.espesor")) || 20;
            const regla = espesor === 30
                ? configuracion.muro.espesor30cm
                : configuracion.muro.espesor20cm;
            const area = BuildCalc.calcularSuperficie(largo, alto);

            return {
                tipo: "muro",
                datos: {
                    espesor: espesor,
                    area: area,
                    cemento: area * regla.cementoKgPorM2,
                    arena: area * regla.arenaM3PorM2,
                    ladrillos: Math.ceil(area * regla.ladrillosPorM2),
                    decimales: { area: 2, cemento: 2, arena: 3, ladrillos: 0 }
                }
            };
        });
    }

    const salidaCemento = document.getElementById("res-cemento");
    if (salidaCemento) {
        BuildCalc.escribirResultados("muro", {
            cemento: "res-cemento",
            arena: "res-arena",
            ladrillos: "res-ladrillos"
        });
        const datos = JSON.parse(localStorage.getItem("buildcalc.resultados") || "{}").muro;
        const titulo = document.getElementById("tipo-muro-titulo");
        if (titulo && datos) titulo.textContent = datos.espesor;
    }
});
