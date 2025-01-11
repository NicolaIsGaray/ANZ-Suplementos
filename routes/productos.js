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
        const productoId = req.params.id;
        const dataToUpdate = req.body;

        // Busca el producto existente
        const productoExistente = await Producto.findById(productoId);
        if (!productoExistente) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        // Actualiza solo los campos enviados
        const productoActualizado = await Producto.findByIdAndUpdate(
            productoId,
            { $set: dataToUpdate },
            { new: true } // Retorna el producto actualizado
        );

        res.status(200).send(productoActualizado);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send({ message: "Error al actualizar el producto", error });
    }
});



productRoute.get('/productos', async (req, res) => {
    try {
        const categorias = req.query.categorias ? req.query.categorias.split(',') : []; // Array de categorías desde query params
        const filtros = categorias.length > 0 ? { categoria: { $in: categorias } } : {}; // Si hay categorías, filtrar

        const productos = await Producto.find(filtros); // Buscar productos que coincidan con las categorías
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        res.status(500).json({ error: 'Error al filtrar productos.' });
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

productRoute.get('/selectedCat', async (req, res) => {
    const categorias = req.query.categorias?.split(',') || []; // Obtener categorías seleccionadas
    try {
        let productos;
        if (categorias.length > 0) {
            productos = await Producto.find({ categoria: { $in: categorias } }); // Filtrar por categorías
        } else {
            productos = await Producto.find(); // Traer todos los productos
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});


productRoute.delete('/eliminar-producto/:idProducto', async (req, res) => {
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

productRoute.delete('/eliminar-categoria/:nombreCategoria', async (req, res) => {
    try {
        const { nombreCategoria } = req.params; // Obtén el nombre de la categoría desde los parámetros de la URL

        const categoriaEliminada = await Categorias.findOneAndDelete({ nombreCategoria }); // Busca y elimina la categoría por su nombre

        if (!categoriaEliminada) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }

        res.status(200).json({ message: 'Categoría eliminada con éxito.', nombreCategoria: categoriaEliminada });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
});


module.exports = productRoute;