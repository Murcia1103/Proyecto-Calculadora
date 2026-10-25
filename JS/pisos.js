// Cálculo de área de piso y superficie total con desperdicio.
document.addEventListener("DOMContentLoaded", function () {
    const campoLargo = document.getElementById("largo-piso");

    if (campoLargo) {
        BuildCalc.iniciarTeclado(["largo-piso", "ancho-piso"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const largo = BuildCalc.leerNumero("largo-piso", "largo del piso");
            const ancho = BuildCalc.leerNumero("ancho-piso", "ancho del piso");
            if (largo === null || ancho === null) return null;

            const superficie = BuildCalc.calcularSuperficie(largo, ancho);
            const adicional = superficie * (configuracion.piso.desperdicioPorcentaje / 100);
            return {
                tipo: "piso",
                datos: {
                    superficie: superficie,
                    adicional: adicional,
                    total: superficie + adicional,
                    decimales: { superficie: 2, adicional: 2, total: 2 }
                }
            };
        });
    }

    if (document.getElementById("res-piso-superficie")) {
        BuildCalc.escribirResultados("piso", {
            superficie: "res-piso-superficie",
            total: "res-piso-10"
        });
    }
});
