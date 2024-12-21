const mongoose = require("mongoose");

const pageData = new mongoose.Schema ({
    acerca: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Página", pageData);