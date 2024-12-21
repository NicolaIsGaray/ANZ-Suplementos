const jwt = require("jsonwebtoken");
const User = require("../models/Usuario"); // Asegúrate de importar tu modelo

// Middleware para autenticar el token
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del header

    if (!token) {
        return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.id = decoded.id; // Extraer el userId del token
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado." });
    }
}

// Middleware para verificar si el usuario es admin
async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findById(req.id); // Buscar usuario en la base de datos

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado. No tienes permisos de administrador." });
        }

        next(); // El usuario es admin, continuar
    } catch (error) {
        console.error("Error al verificar rol:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
}

module.exports = { authMiddleware, adminMiddleware };