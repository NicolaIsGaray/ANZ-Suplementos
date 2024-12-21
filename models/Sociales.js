const mongoose = require("mongoose");

const contactosData = new mongoose.Schema ({
    telefono: {
        type: String
    },
    instagram: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    youtube: {
        type: String
    }
})

module.exports = mongoose.model("Contactos", contactosData);