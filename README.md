# BuildCalc

Calculadora web educativa para practicar HTML, CSS, JavaScript y JSON. Incluye muro, viga, columna, contrapiso, techo, piso y pintura, además de registro e inicio de sesión local de demostración.

## Cómo abrir el proyecto

Abre esta carpeta en Visual Studio Code y ejecuta `index.html` con Live Server. También puedes abrir una terminal dentro de esta carpeta y ejecutar:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000/`. No abras el HTML con doble clic: JavaScript carga `JSON/configuracion.json` usando `fetch`, por lo que necesita un servidor local.

## Organización

- `JSON/configuracion.json`: coeficientes y parámetros indicados por el profesor.
- `JS/comun.js`: carga del JSON, validación de entradas, teclado visual, cálculo común de superficie y volumen, almacenamiento y presentación de resultados.
- `JS/dimensiones.js`, `viga.js`, `columna.js`, `contrapisos.js`, `techos.js`, `pisos.js` y `pintura.js`: fórmulas específicas de cada calculadora.
- `JS/login.js`, `register.js`, `recuperar-password.js` y `menu.js`: flujo local de acceso, registro, recuperación simulada y salida.

Los resultados y usuarios de demostración se guardan en el almacenamiento del navegador; no hay base de datos en un servidor.

## Parámetros y fórmulas

- **Muro:** área = largo × alto. En 20 cm: 10.9 kg de cemento, 0.09 m³ de arena y 90 ladrillos por m². En 30 cm: 15.2 kg, 0.115 m³ y 120 ladrillos por m². El total de ladrillos se redondea hacia arriba.
- **Viga:** por cada metro lineal: 9 kg de cemento, 0.02 m³ de arena, 0.02 m³ de piedra, 4 m de hierro de 8 mm y 3 m de hierro de 4 mm. Cada salida es largo × tasa por metro lineal.
- **Columna:** por cada metro lineal: 7.5 kg de cemento, 0.016 m³ de arena, 0.016 m³ de piedra, 6 m de hierro de 10 mm y 3 m de hierro de 4 mm. Cada salida es largo × tasa por metro lineal.
- **Contrapiso:** volumen = largo × ancho × espesor en metros. El espesor se ingresa en centímetros y se divide entre 100. Por cada m³: 105 kg de cemento, 0.45 m³ de arena y 0.9 m³ de piedra.
- **Techo:** se pide largo, ancho y espesor (cm); se calcula la superficie y el volumen geométrico. Los materiales solicitados se calculan por m²: 33 kg de cemento, 0.072 m³ de arena, 0.072 m³ de piedra, 7 m de hierro de 8 mm y 4 m de hierro de 6 mm por m². El espesor queda capturado y validado, aunque los coeficientes de materiales del profesor dependen de la superficie, no del volumen.
- **Piso:** superficie = largo × ancho; superficie con 10% extra = superficie × 1.10.
- **Pintura:** litros = superficie ÷ 6 m²/L × 1 mano. La cantidad de manos y el rendimiento siguen configurados en el JSON.

Los subprogramas comunes `calcularSuperficie(largo, ancho)` y `calcularVolumen(largo, ancho, espesor)` están dentro de `JS/comun.js`. Los usan los cálculos de muro, contrapiso, techo y piso; no aparecen como opciones para el usuario en el menú.


## Acceso de demostración y límites

Primero crea una cuenta desde **Regístrate aquí** con nombre de usuario y contraseña; luego inicia sesión con esos mismos datos. También se solicita correo para la recuperación simulada, que no envía mensajes reales. Las cuentas se guardan localmente en este navegador. No es autenticación lista para producción.

Las tasas se cargan de la consigna entregada y sirven para el ejercicio. No son una norma universal ni sustituyen planos, especificaciones o diseño profesional. Para cambiar un coeficiente, edita su valor en `JSON/configuracion.json` conservando la sintaxis JSON.
