const mongoose = require("mongoose");

const componentData = new mongoose.Schema ({
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
    }
})

module.exports = mongoose.model("Componentes", componentData);