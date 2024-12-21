const express = require("express");
const productRoute = express.Router();
const Producto = require("../models/Productos");
const Categorias = require("../models/Categorias");

productRoute.post('/agregarProducto', async (req, res) => {
    const { nombre, descripcion, stock, imgPortada, precio, categoria } = req.body;

    const product = {
        nombre,
        descripcion,
        stock,
        precio,
        categoria,
        imgPortada
    }

    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).send(nuevoProducto);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).send({ message: "Error en el servidor", error: error.message });
    }
});

productRoute.put('/editar-producto/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body,{
            new: true
        });
        res.status(200).send(producto);
    } catch (error) {
        res.status(500).send(error);
    }
})

productRoute.get('/productos', async (req, res) => {
    const { categoria } = req.query;

    try {
        let filtro = {};
        if (categoria) {
            filtro = { categoria }; // Filtra solo por la categoría
        }

        const productos = await Producto.find(filtro);

        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos para esta categoría" });
        }

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error en el servidor");
    }
});

productRoute.get('/producto/porCategoria', async (req, res) => {
    try {
        const { categoria } = req.query;

        if (!categoria) {
            return res.status(400).json({ error: "Debe proporcionar una categoría" });
        }

        const productos = await Producto.find({ categoria }); // Filtrar por la categoría
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        res.status(500).send("Error en el servidor");
    }
});


productRoute.get('/selected/:idProductSel', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.idProductSel);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

productRoute.get('/selectedCat/:categoriaSel', async (req, res) => {
    try {
        console.log("REQ PARAMS:", req.params);
        console.log("Categoria en el backend:", { categoria: req.params.categoriaSel }); // Verificar si llega el parámetro
        let select = await Producto.findOne({ categoria: req.params.categoriaSel });
        if (!select) {
            return res.status(404).json({ error: 'Producto y/o Categoria no encontrados.' });
        }
        console.log("Producto en el backend:", select);

        res.status(200).send(select);
    } catch (error) {
        console.error("Error al buscar producto:", error);
        res.status(500).send("Error en el servidor");
    }
});

productRoute.delete('/eliminar/:idProducto', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.idProducto);
        res.status(204).send("Producto Eliminado.")
    } catch (error) {
        res.status(500).send("Error")
    }
});

//>> AGREGAR CATEGORÍAS
productRoute.post('/categoria', async (req, res) => {
    try {
        const { nombreCategoria } = req.body; // Recibe el nombre de la nueva categoría

        // Verificar que la categoría no exista
        const categoriaExistente = await Categorias.findOne({ nombreCategoria: nombreCategoria });
        if (categoriaExistente) {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }

        // Crear una nueva categoría
        const nuevaCategoria = new Categorias({ nombreCategoria: nombreCategoria });
        await nuevaCategoria.save();

        res.json({ success: true, categoria: nuevaCategoria }); // Devuelve la nueva categoría
    } catch (error) {
        console.error('Error al agregar categoría:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

//>> Obtener CATEGORÍAS para mostrarlas en el Front End
productRoute.get('/categorias', async (req, res) => {
    try {
        const nombreCategoria = req.params;

        const categorias = await Categorias.find(nombreCategoria); // Obtener todas las categorías desde la base de datos
        res.json(categorias); // Devuelve las categorías
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = productRoute;