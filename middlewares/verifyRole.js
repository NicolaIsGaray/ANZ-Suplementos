const jwt = require("jsonwebtoken");
const User = require("../models/Usuario");

async function verificarRol(req, res) {
    try {
        // Obtener el token desde los encabezados
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado." });
        }

        // Decodificar el token para obtener el userId
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decoded.id;

        // Buscar el usuario en la base de datos
        const usuario = await User.findById(userId);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Verificar el rol del usuario
        if (usuario.rol === "admin") {
            res.json({ message: "Acceso concedido. Eres administrador.", isAdmin: true });
        } else {
            res.status(403).json({ message: "Acceso denegado. No tienes permisos de administrador.", isAdmin: false });
        }
    } catch (error) {
        console.error("Error al verificar el rol:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
}

module.exports = verificarRol;