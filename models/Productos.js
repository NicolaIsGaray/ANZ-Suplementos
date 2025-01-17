const mongoose = require("mongoose");

const productData = new mongoose.Schema ({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required:true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Ingresa un valor válido."]
    },
    precio: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    imgPortada: {
        type: String
    },
    imagenes: [
        {
        type: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Productos", productData);