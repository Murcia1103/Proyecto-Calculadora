// Estimación académica de materiales de contrapiso por metro cúbico.
document.addEventListener("DOMContentLoaded", function () {
    const campoLargo = document.getElementById("largo-contrapiso");

    if (campoLargo) {
        BuildCalc.iniciarTeclado(["largo-contrapiso", "ancho-contrapiso", "espesor-contrapiso"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo-contrapiso", "largo del contrapiso");
            const ancho = BuildCalc.leerNumero("ancho-contrapiso", "ancho del contrapiso");
            const espesorCm = BuildCalc.leerNumero("espesor-contrapiso", "espesor en centímetros");
            if (largo === null || ancho === null || espesorCm === null) return null;

            const espesorM = espesorCm / 100;
            const area = BuildCalc.calcularSuperficie(largo, ancho);
            const volumen = BuildCalc.calcularVolumen(largo, ancho, espesorM);
            const contrapiso = configuracion.contrapiso;

            return {
                tipo: "contrapiso",
                datos: {
                    area: area,
                    volumen: volumen,
                    cemento: volumen * contrapiso.cementoKgPorM3,
                    arena: volumen * contrapiso.arenaM3PorM3,
                    piedra: volumen * contrapiso.piedraM3PorM3,
                    decimales: { area: 2, volumen: 3, cemento: 2, arena: 3, piedra: 3 }
                }
            };
        });
    }

    if (document.getElementById("res-contrapiso-cemento")) {
        BuildCalc.escribirResultados("contrapiso", {
            cemento: "res-contrapiso-cemento",
            arena: "res-contrapiso-arena",
            piedra: "res-contrapiso-piedra"
        });
    }
});
