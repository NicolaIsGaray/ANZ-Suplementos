const mongoose = require("mongoose");

const subCategoryData = new mongoose.Schema ({
    nombreSubCategoria: {
        type: [String],
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("SubCategorías", subCategoryData);