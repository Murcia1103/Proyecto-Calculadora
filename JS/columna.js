// Estimación académica de materiales por metro lineal de columna.
document.addEventListener("DOMContentLoaded", function () {
    const campo = document.getElementById("largo-columna");

    if (campo) {
        BuildCalc.iniciarTeclado(["largo-columna"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo-columna", "largo de la columna");
            if (largo === null) return null;

            const columna = configuracion.columna;
            return {
                tipo: "columna",
                datos: {
                    cemento: largo * columna.cementoKgPorMetroLineal,
                    arena: largo * columna.arenaM3PorMetroLineal,
                    piedra: largo * columna.piedraM3PorMetroLineal,
                    hierro10: largo * columna.hierro10MPorMetroLineal,
                    hierro4: largo * columna.hierro4MPorMetroLineal,
                    decimales: { cemento: 2, arena: 3, piedra: 3, hierro10: 2, hierro4: 2 }
                }
            };
        });
    }

    if (document.getElementById("res-columna-cemento")) {
        BuildCalc.escribirResultados("columna", {
            cemento: "res-columna-cemento",
            arena: "res-columna-arena",
            piedra: "res-columna-piedra",
            hierro10: "res-columna-hierro10",
            hierro4: "res-columna-hierro4"
        });
    }
});
