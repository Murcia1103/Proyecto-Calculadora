# BuildCalc

Calculadora web educativa para practicar HTML, CSS, JavaScript y JSON. Incluye cálculos de muro, viga, columna, contrapiso, techo, piso y pintura, además de registro e inicio de sesión con un backend local de demostración.

## Información académica y autores

Proyecto realizado en grupo por **Juan Sebastian Hernandez**, **Santiago Gutierrez Montealegre** y **Gabriel Gutierrez Murcia** para la materia **Interfaces I**, correspondiente al **segundo semestre de Ingeniería en Software**.

**Docente:** Ingeniero Mauricio Rodriguez Bravo.

## Cómo ejecutar esta versión con backend

Se necesita tener instalado Node.js. Abre una terminal dentro de la carpeta del proyecto y ejecuta estos comandos:

```bash
npm install
npm start
```

Después abre **http://localhost:3000/** en el navegador. Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.

En el primer inicio, el servidor crea automáticamente `data/buildcalc.sqlite`, donde guarda las cuentas. No abras el HTML con doble clic ni con Live Server para esta versión: el inicio de sesión ahora necesita que el servidor Node esté ejecutándose.

## Qué hace el backend

- `server.js` inicia un servidor con Express y sirve las páginas del proyecto.
- El registro envía los datos a `/api/auth/register`; el servidor valida los campos, guarda la cuenta en SQLite y crea una sesión.
- El inicio de sesión envía el usuario y contraseña a `/api/auth/login`. El servidor compara la contraseña con su hash y crea la sesión si coincide.
- Las contraseñas se guardan como hash con bcrypt; no se guardan en texto legible.
- Las páginas internas requieren una sesión. El botón **Salir** cierra esa sesión.
- Las cuentas que solo existían en el almacenamiento local de la versión anterior no se importan. En esta versión, crea una cuenta nueva desde **Regístrate aquí**.

El servidor escucha solo en `localhost` y está hecho para aprender y presentar el proyecto. No es un sistema listo para publicar en Internet: usa una sesión temporal en memoria, no tiene un servicio real de restablecimiento por correo y no incorpora todas las medidas de seguridad de un producto comercial. La opción de recuperación informa que no se envía correo ni se cambia la contraseña.

GitHub Pages solo sirve archivos estáticos y no ejecuta este servidor. Para que otras personas usen la versión con backend por Internet habría que alojar el servidor Node y la base de datos en un servicio compatible.

## Organización principal

- `server.js`: backend Express, rutas de registro/acceso/salida y conexión a SQLite.
- `package.json`: dependencias y comando de arranque.
- `data/buildcalc.sqlite`: base de datos local creada al iniciar (no se sube al repositorio).
- `JSON/configuracion.json`: coeficientes y parámetros de los cálculos.
- `JS/comun.js`: carga del JSON, validación, teclado visual, cálculo común de superficie/volumen y presentación de resultados.
- `JS/dimensiones.js`, `viga.js`, `columna.js`, `contrapisos.js`, `techos.js`, `pisos.js` y `pintura.js`: fórmulas específicas de cada calculadora.
- `JS/login.js`, `register.js`, `recuperar-password.js` y `menu.js`: comunicación de las pantallas de acceso con el backend.

Las cuentas se guardan en SQLite. Los resultados de las calculadoras continúan guardándose localmente en el navegador; no se envían al servidor.

## Parámetros y fórmulas

- **Muro:** área = largo × alto. En 20 cm: 10.9 kg de cemento, 0.09 m³ de arena y 90 ladrillos por m². En 30 cm: 15.2 kg, 0.115 m³ y 120 ladrillos por m². El total de ladrillos se redondea hacia arriba.
- **Viga:** por cada metro lineal: 9 kg de cemento, 0.02 m³ de arena, 0.02 m³ de piedra, 4 m de hierro de 8 mm y 3 m de hierro de 4 mm.
- **Columna:** por cada metro lineal: 7.5 kg de cemento, 0.016 m³ de arena, 0.016 m³ de piedra, 6 m de hierro de 10 mm y 3 m de hierro de 4 mm.
- **Contrapiso:** volumen = largo × ancho × espesor en metros. El espesor se ingresa en centímetros y se divide entre 100. Por cada m³: 105 kg de cemento, 0.45 m³ de arena y 0.9 m³ de piedra.
- **Techo:** se pide largo, ancho y espesor (cm). Los materiales se calculan por m²: 33 kg de cemento, 0.072 m³ de arena, 0.072 m³ de piedra, 7 m de hierro de 8 mm y 4 m de hierro de 6 mm. El espesor se captura y valida, aunque los coeficientes entregados dependen de la superficie, no del volumen.
- **Piso:** superficie = largo × ancho; superficie con 10 % extra = superficie × 1.10.
- **Pintura:** litros = superficie ÷ 6 m²/L × 1 mano. La cantidad de manos y el rendimiento están configurados en el JSON.

## Aclaración sobre piedra

En la consigna, la piedra para vigas y columnas aparece con unidad m². Como la cantidad de agregado se expresa como volumen, BuildCalc conserva los coeficientes numéricos (0.02 y 0.016) pero muestra y guarda piedra en m³. Conviene confirmar con el profesor que m³ es la unidad correcta.

Los parámetros son los del ejercicio académico. No son una norma universal ni sustituyen planos, especificaciones o diseño profesional. Para cambiar un coeficiente, edita su valor en `JSON/configuracion.json` conservando la sintaxis JSON.
