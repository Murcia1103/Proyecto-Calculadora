const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");

fs.mkdirSync(DATA_DIR, { recursive: true });
const database = new Database(path.join(DATA_DIR, "buildcalc.sqlite"));
database.pragma("journal_mode = WAL");
database.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        usuario TEXT NOT NULL,
        usuario_normalizado TEXT NOT NULL UNIQUE,
        correo TEXT NOT NULL,
        correo_normalizado TEXT NOT NULL UNIQUE,
        clave_hash TEXT NOT NULL,
        creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const buscarPorUsuario = database.prepare(
    "SELECT id, nombre, usuario, correo, clave_hash FROM usuarios WHERE usuario_normalizado = ?"
);
const insertarUsuario = database.prepare(
    "INSERT INTO usuarios (nombre, usuario, usuario_normalizado, correo, correo_normalizado, clave_hash) VALUES (?, ?, ?, ?, ?, ?)"
);
const buscarCorreo = database.prepare(
    "SELECT id FROM usuarios WHERE correo_normalizado = ?"
);

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(session({
    name: "buildcalc.sid",
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

function usuarioSeguro(usuario) {
    return { id: usuario.id, nombre: usuario.nombre, usuario: usuario.usuario };
}

function iniciarSesion(req, res, usuario, recordar) {
    req.session.regenerate(function (error) {
        if (error) {
            return res.status(500).json({ mensaje: "No se pudo iniciar la sesión. Intenta de nuevo." });
        }
        req.session.usuario = usuarioSeguro(usuario);
        if (recordar) req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000;
        req.session.save(function (errorAlGuardar) {
            if (errorAlGuardar) {
                return res.status(500).json({ mensaje: "No se pudo guardar la sesión." });
            }
            return res.json({ usuario: req.session.usuario });
        });
    });
}

app.post("/api/auth/register", async function (req, res) {
    const nombre = String(req.body.nombre || "").trim();
    const usuario = String(req.body.usuario || "").trim();
    const correo = String(req.body.correo || "").trim().toLowerCase();
    const clave = String(req.body.clave || "");

    if (!nombre || !usuario || !correo || !clave) {
        return res.status(400).json({ mensaje: "Completa todos los campos." });
    }
    if (nombre.length > 100 || usuario.length > 40 || correo.length > 160) {
        return res.status(400).json({ mensaje: "Uno de los campos supera el largo permitido." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return res.status(400).json({ mensaje: "Escribe un correo electrónico válido." });
    }
    if (clave.length < 8 || clave.length > 72) {
        return res.status(400).json({ mensaje: "La contraseña debe tener entre 8 y 72 caracteres." });
    }

    const usuarioNormalizado = usuario.toLocaleLowerCase("es");
    const correoNormalizado = correo.toLocaleLowerCase("es");
    if (buscarPorUsuario.get(usuarioNormalizado) || buscarCorreo.get(correoNormalizado)) {
        return res.status(409).json({ mensaje: "Ese correo o nombre de usuario ya está registrado." });
    }

    try {
        const claveHash = await bcrypt.hash(clave, 10);
        const resultado = insertarUsuario.run(
            nombre,
            usuario,
            usuarioNormalizado,
            correo,
            correoNormalizado,
            claveHash
        );
        return iniciarSesion(req, res, {
            id: Number(resultado.lastInsertRowid),
            nombre,
            usuario
        }, false);
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ mensaje: "Ese correo o nombre de usuario ya está registrado." });
        }
        console.error("Error al registrar usuario:", error.message);
        return res.status(500).json({ mensaje: "Ocurrió un error al crear la cuenta." });
    }
});

app.post("/api/auth/login", async function (req, res) {
    const usuarioIngresado = String(req.body.usuario || "").trim().toLocaleLowerCase("es");
    const clave = String(req.body.clave || "");
    const recordar = req.body.recordar === true;

    if (!usuarioIngresado || !clave) {
        return res.status(400).json({ mensaje: "Escribe tu usuario y contraseña." });
    }
    try {
        const usuario = buscarPorUsuario.get(usuarioIngresado);
        const coincide = usuario ? await bcrypt.compare(clave, usuario.clave_hash) : false;
        if (!coincide) {
            return res.status(401).json({ mensaje: "El usuario o la contraseña no son correctos." });
        }
        return iniciarSesion(req, res, usuario, recordar);
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        return res.status(500).json({ mensaje: "Ocurrió un error al iniciar sesión." });
    }
});

app.get("/api/auth/me", function (req, res) {
    if (!req.session.usuario) {
        return res.status(401).json({ mensaje: "No hay una sesión iniciada." });
    }
    return res.json({ usuario: req.session.usuario });
});

app.post("/api/auth/logout", function (req, res) {
    if (!req.session) return res.json({ ok: true });
    req.session.destroy(function (error) {
        if (error) return res.status(500).json({ mensaje: "No se pudo cerrar la sesión." });
        res.clearCookie("buildcalc.sid", { httpOnly: true, sameSite: "lax", secure: false });
        return res.json({ ok: true });
    });
});

app.post("/api/auth/recovery-check", function (req, res) {
    const correo = String(req.body.correo || "").trim().toLowerCase();
    if (!correo) return res.status(400).json({ mensaje: "Escribe tu correo electrónico." });
    return res.json({
        mensaje: "Si el correo pertenece a una cuenta, aquí se enviarían instrucciones. Esta demo local no envía correos ni restablece contraseñas."
    });
});

const paginasPublicas = new Set(["/index.html", "/register.html", "/recuperar-password.html"]);
app.use(function (req, res, next) {
    const esPaginaHtml = (req.method === "GET" || req.method === "HEAD") && req.path.toLowerCase().endsWith(".html");
    if (esPaginaHtml && !paginasPublicas.has(req.path) && !req.session.usuario) {
        return res.redirect("/index.html");
    }
    return next();
});

// No servir la base de datos ni archivos de configuración del servidor como archivos estáticos.
app.use(function (req, res, next) {
    const rutaPrivada = ["/data", "/node_modules", "/server.js", "/package.json", "/package-lock.json", "/.git"];
    if (rutaPrivada.some(function (ruta) { return req.path === ruta || req.path.startsWith(ruta + "/"); })) {
        return res.sendStatus(404);
    }
    return next();
});

app.use(express.static(ROOT, { extensions: ["html"] }));
app.use(function (req, res) {
    res.status(404).send("No se encontró esa página.");
});

app.listen(PORT, "127.0.0.1", function () {
    console.log(`BuildCalc está listo en http://localhost:${PORT}`);
    console.log("Backend local para demostración académica; no está configurado para producción.");
});
