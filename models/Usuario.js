const mongoose = require("mongoose");
const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userData = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return regex.test(v);
            },
            message: "Debes ingresar un correo válido."
        }
    },
    contraseña: {
        type: String,
        required: true,
        minlength: 8
    },
    productosFavoritos: {
        type: Array, // O puedes definirlo como un arreglo de objetos específicos si tienes más detalles
        default: []
    },
    rol: {
        type: String,
        enum: ['admin', 'cliente'],
        default: 'cliente'
    }
});

module.exports = mongoose.model("Usuario", userData);