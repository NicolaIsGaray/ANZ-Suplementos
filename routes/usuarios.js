const express = require("express");
const userRoute = express.Router();

const UserData = require("../models/Usuario");
const verifyRole = require("../middlewares/verifyRole");
const { authMiddleware, adminMiddleware } = require("../middlewares/authBack");

const bCrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();

const JWT_SECRET = process.env.JWT_TOKEN;

const saltRounds = 10;

const hashPassword = async (contraseña) => {
    const salt = await bCrypt.genSalt(saltRounds);
    const hashedPassword = await bCrypt.hash(contraseña, salt);
    return hashedPassword;
};

userRoute.post("/signUp", async (req, res) => {
    const {nombre, apellido, username, email, contraseña} = req.body;

    if (!contraseña) {
        console.log('Campo Inválido. Contraseña');
        return res.status(401).send({message: 'Credenciales no válidas: Contraseña'});
    }

    const hashed = await hashPassword(contraseña);
    const userData = {
        contraseña: hashed,
        nombre,
        apellido,
        username,
        email
    }

    try {
        let newUser = await UserData.create(userData);
        res.status(201).send(newUser);
    } catch (error) {
        console.log(error);
    }
    }
)

userRoute.post('/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        const usuario = await UserData.findOne({ email });
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Primera respuesta
            return; // Evitar que el código continúe
        }

        const esPasswordCorrecto = await bCrypt.compare(contraseña, usuario.contraseña);
        if (!esPasswordCorrecto) {
            res.status(401).json({ message: 'Contraseña incorrecta' }); // Segunda respuesta
            return; // Evitar que el código continúe
        }

        const token = JWT.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_TOKEN
        );

        res.json({ token }); // Tercera respuesta
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' }); // Cuarta respuesta
    }
});

userRoute.post('/logOut', async (req, res) => {
    try {
        res.clearCookie("token");
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
});

userRoute.get('/data/:idUser', async (req, res) => {
    try {
        let answer = await UserData.findById(req.params.idUser)
        res.status(200).send({user: {username: answer.username,
              email: answer.email, rol: answer.rol}});
    } catch (error) {
        res.status(500).send(console.log("Error."))
    }
})

userRoute.get('/verificar-rol', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No se proporcionó token" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token malformado o faltante" });
        }

        let decoded;
        try {
            decoded = JWT.verify(token, process.env.JWT_TOKEN);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token ha expirado" });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(400).json({ message: "Token inválido" });
            }
            console.error("Error al verificar token:", err);
            throw err;
        }

        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: "Token no contiene un ID válido" });
        }

        const usuario = await UserData.findById(decoded.id).catch(err => {
            console.error("Error al buscar usuario en la base de datos:", err);
            throw new Error("Error en la base de datos");
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ isAdmin: usuario.rol === "admin" });

    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

userRoute.post('/ruta-protegida', verifyRole, (req, res) => {
    if (req.isAdmin) {
        res.json({ message: "Acceso concedido. Eres administrador." });
    } else {
        res.status(403).json({ message: "Acceso denegado. No tienes permisos de administrador." });
    }
});

userRoute.get("/admin-only", authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: "Acceso concedido. Bienvenido, administrador." });
});

userRoute.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = JWT.decode(token, JWT_SECRET);
        const userPayload = payload.id;

        const userResponse = await UserData.findById(userPayload);

        if (!userResponse) {
            res.status(404).json({error: "Usuario no encontrado."});
        }
        res.status(200).send(userResponse);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
})

module.exports = userRoute;