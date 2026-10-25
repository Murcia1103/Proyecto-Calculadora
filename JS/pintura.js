// Estimación de pintura según superficie, rendimiento y manos.
document.addEventListener("DOMContentLoaded", function () {
    const campo = document.getElementById("superficie-pintura");

    if (campo) {
        BuildCalc.iniciarTeclado(["superficie-pintura"]);
        BuildCalc.conectarCalculo(function (configuracion) {
            const superficie = BuildCalc.leerNumero("superficie-pintura", "superficie a pintar");
            if (superficie === null) return null;

            const pintura = configuracion.pintura;
            const litros = (superficie * pintura.manos) / pintura.rendimientoM2PorLitro;
            return {
                tipo: "pintura",
                datos: {
                    superficie: superficie,
                    litros: litros,
                    decimales: { superficie: 2, litros: 2 }
                }
            };
        });
    }

    if (document.getElementById("res-pintura-superficie")) {
        BuildCalc.escribirResultados("pintura", {
            superficie: "res-pintura-superficie",
            litros: "res-pintura-litros"
        });
    }
});
