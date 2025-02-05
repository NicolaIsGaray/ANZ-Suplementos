const mongoose = require("mongoose");
const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userData = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return regex.test(v);
      },
      message: "Debes ingresar un correo válido.",
    },
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 8,
  },
  carrito: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productos",
        required: true,
      },
      cantidad: { type: Number, required: true, default: 1 },
    },
  ],
  rol: {
    type: String,
    enum: ["admin", "cliente"],
    default: "cliente",
  },
});

module.exports = mongoose.model("Usuario", userData);
