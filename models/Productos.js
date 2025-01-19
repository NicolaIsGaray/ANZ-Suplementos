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
    oferta: {
        enOferta : {
            type: Boolean,
            default: false
        },
        descuento: {
            type: Number,
            default: 0
        }
    },
    peso: {
        type: Number,
        required: false
    },
    color: {
        type: [String],
        required: false
    },
    sabores: {
        type: [String],
        required: false
    },
    tamaño: {
        type: [String],
        required: false
    },
    marca: {
        type: [String],
        required: false
    },
    categoria: {
        type: String,
        required: true
    },
    subcategoria: {
        type: String,
        required: false
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