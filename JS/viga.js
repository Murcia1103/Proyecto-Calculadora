// Estimación académica de materiales por metro lineal de viga.
document.addEventListener("DOMContentLoaded", function () {
    const campo = document.getElementById("largo-viga");

    if (campo) {
        BuildCalc.iniciarTeclado(["largo-viga"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo-viga", "largo de la viga");
            if (largo === null) return null;

            const viga = configuracion.viga;
            return {
                tipo: "viga",
                datos: {
                    cemento: largo * viga.cementoKgPorMetroLineal,
                    arena: largo * viga.arenaM3PorMetroLineal,
                    piedra: largo * viga.piedraM3PorMetroLineal,
                    hierro8: largo * viga.hierro8MPorMetroLineal,
                    hierro4: largo * viga.hierro4MPorMetroLineal,
                    decimales: { cemento: 2, arena: 3, piedra: 3, hierro8: 2, hierro4: 2 }
                }
            };
        });
    }

    if (document.getElementById("res-viga-cemento")) {
        BuildCalc.escribirResultados("viga", {
            cemento: "res-viga-cemento",
            arena: "res-viga-arena",
            piedra: "res-viga-piedra",
            hierro8: "res-viga-hierro8",
            hierro4: "res-viga-hierro4"
        });
    }
});
