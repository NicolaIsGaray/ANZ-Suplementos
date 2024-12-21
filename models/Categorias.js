const mongoose = require("mongoose");

const categoryData = new mongoose.Schema ({
    nombreCategoria: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("Categorías", categoryData);