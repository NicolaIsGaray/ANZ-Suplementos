const express = require("express");
const productRoute = express.Router();
const Producto = require("../models/Productos");
const Categorias = require("../models/Categorias");
const SubCategorias = require("../models/SubCategorias");
const Componentes = require("../models/Componentes");

productRoute.post('/agregar/producto', async (req, res) => {
    const { nombre, descripcion, stock, imgPortada, precio, categoria, subcategoria, peso, color, sabores, tamaño, marca, oferta } = req.body;

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

//>> AGREGAR SUBCATEGORÍAS
productRoute.post('/subcategoria', async (req, res) => {
    try {
        const { nombreSubCategoria } = req.body; // Recibe el nombre de la nueva subcategoría

        // Verificar que la subcategoría no exista
        const subCategoriaExistente = await SubCategorias.findOne({ nombreSubCategoria: nombreSubCategoria });
        if (subCategoriaExistente) {
            return res.status(400).json({ error: 'La subcategoría ya existe' });
        }

        const updatedSubcategoria = await SubCategorias.findOneAndUpdate(
            {}, // Supongamos que solo tienes un único documento
            {
                $addToSet: { // Asegura que no se dupliquen los valores
                    nombreSubCategoria: nombreSubCategoria
                }
            }
        );

        res.status(200).send(updatedSubcategoria);
    } catch (error) {
        console.error('Error al modificar las subcategorías:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

//>> Obtener SUBCATEGORÍAS para mostrarlas en el Front End
productRoute.get('/subcategorias', async (req, res) => {
    try {
        const nombreSubCategoria = req.params;

        const subCategorias = await SubCategorias.find(nombreSubCategoria); // Obtener todas las subcategorías desde la base de datos
        res.json(subCategorias); // Devuelve las subcategorías
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

productRoute.get('/selectedSubCat', async (req, res) => {
    const subcategorias = req.query.subcategorias?.split(',') || []; // Obtener categorías seleccionadas
    try {
        let productos;
        if (subcategorias.length > 0) {
            productos = await Producto.find({ subcategoria: { $in: subcategorias } }); // Filtrar por categorías
        } else {
            productos = await Producto.find(); // Traer todos los productos
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

productRoute.delete('/eliminar-subcategoria/:nombreSubCategoria', async (req, res) => {
    try {
        const { nombreSubCategoria } = req.params; // Obtén el nombre de la subcategoría desde los parámetros de la URL

        const subCategoriaEliminada = await SubCategorias.findOneAndDelete({ nombreSubCategoria }); // Busca y elimina la subcategoría por su nombre

        if (!subCategoriaEliminada) {
            return res.status(404).json({ error: 'SubCategoría no encontrada.' });
        }

        res.status(200).json({ message: 'SubCategoría eliminada con éxito.', nombreSubCategoria: subCategoriaEliminada });
    } catch (error) {
        console.error('Error al eliminar la subcategoría:', error);
        res.status(500).json({ error: 'Error al eliminar la subcategoría.' });
    }
});

productRoute.post('/componente/agregar-componente', async (req, res) => {
    const { color, sabores, tamaño, marca } = req.body;

    try {
        // Actualizar el modelo de Componentes agregando nuevos valores a los arrays existentes
        const updatedComponentes = await Componentes.findOneAndUpdate(
            {}, // Supongamos que solo tienes un único documento
            {
                $addToSet: { // Asegura que no se dupliquen los valores
                    color: { $each: color || [] },
                    sabores: { $each: sabores || [] },
                    tamaño: { $each: tamaño || [] },
                    marca: { $each: marca || [] }
                }
            },
            { new: true, upsert: true } // Crea el documento si no existe
        );

        res.status(200).send(updatedComponentes);
    } catch (error) {
        console.error("Error al actualizar los componentes:", error);
        res.status(500).send({ message: "Error en el servidor", error: error.message });
    }
});


productRoute.get('/component/color', async (req, res) => {
    try {
        const color = req.params;

        const colores = await Componentes.find(color);
        res.json(colores);
    } catch (error) {
        console.error('Error al obtener los colores:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

productRoute.get('/component/sabores', async (req, res) => {
    try {
        const sabor = req.params;

        const sabores = await Componentes.find(sabor);
        res.json(sabores);
    } catch (error) {
        console.error('Error al obtener los sabores:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

productRoute.get('/component/sizes', async (req, res) => {
    try {
        const tamaño = req.params;

        const tamañoRes = await Componentes.find(tamaño);
        res.json(tamañoRes);
    } catch (error) {
        console.error('Error al obtener los tamaños:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

productRoute.get('/component/marcas', async (req, res) => {
    try {
        const marca = req.params;

        const marcaRes = await Componentes.find(marca);
        res.json(marcaRes);
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = productRoute;