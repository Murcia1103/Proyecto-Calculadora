// Estimación académica de materiales de techo por metro cuadrado.
document.addEventListener("DOMContentLoaded", function () {
    const campoLargo = document.getElementById("largo-techo");

    if (campoLargo) {
        BuildCalc.iniciarTeclado(["largo-techo", "ancho-techo", "espesor-techo"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo-techo", "largo del techo");
            const ancho = BuildCalc.leerNumero("ancho-techo", "ancho del techo");
            const espesorCm = BuildCalc.leerNumero("espesor-techo", "espesor en centímetros");
            if (largo === null || ancho === null || espesorCm === null) return null;

            const techo = configuracion.techo;
            const area = BuildCalc.calcularSuperficie(largo, ancho);
            const volumen = BuildCalc.calcularVolumen(largo, ancho, espesorCm / 100);

            return {
                tipo: "techo",
                datos: {
                    area: area,
                    volumen: volumen,
                    cemento: area * techo.cementoKgPorM2,
                    arena: area * techo.arenaM3PorM2,
                    piedra: area * techo.piedraM3PorM2,
                    hierro8: area * techo.hierro8MPorM2,
                    hierro6: area * techo.hierro6MPorM2,
                    decimales: { area: 2, volumen: 3, cemento: 2, arena: 3, piedra: 3, hierro8: 2, hierro6: 2 }
                }
            };
        });
    }

    if (document.getElementById("res-techo-cemento")) {
        BuildCalc.escribirResultados("techo", {
            cemento: "res-techo-cemento",
            arena: "res-techo-arena",
            piedra: "res-techo-piedra",
            hierro8: "res-techo-hierro8",
            hierro6: "res-techo-hierro6"
        });
    }
});
