const express = require("express");
const productRoute = express.Router();
const Producto = require("../models/Productos");
const Categorias = require("../models/Categorias");
const SubCategorias = require("../models/SubCategorias");
const Componentes = require("../models/Componentes");
const Usuarios = require("../models/Usuario");

//>> Agregar producto al carrito <<
productRoute.post("/carrito/:userId/agregar", async (req, res) => {
    try {
        const { userId } = req.params;
        const { productoId, cantidad } = req.body;

        const usuario = await Usuarios.findById(userId);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        // Verificar si el producto ya está en el carrito
        const itemExistente = usuario.carrito.find(item => item.producto.equals(productoId));
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            usuario.carrito.push({ producto: productoId, cantidad });
        }

        await usuario.save();
        res.json({ mensaje: "Producto agregado al carrito", carrito: usuario.carrito });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRoute.get("/carrito/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const usuario = await Usuarios.findById(userId).populate("carrito.producto");

        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({ carrito: usuario.carrito });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRoute.put("/carrito/:userId/actualizar", async (req, res) => {
    try {
        const { userId } = req.params;
        const { productoId, cantidad } = req.body;

        const usuario = await Usuarios.findById(userId);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const item = usuario.carrito.find(item => item.producto.equals(productoId));
        if (!item) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

        item.cantidad = cantidad;
        await usuario.save();

        res.json({ mensaje: "Cantidad actualizada", carrito: usuario.carrito });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRoute.delete("/carrito/:userId/eliminar/:productoId", async (req, res) => {
    try {
        const { userId, productoId } = req.params;

        const usuario = await Usuarios.findById(userId);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        usuario.carrito = usuario.carrito.filter(item => !item.producto.equals(productoId));
        await usuario.save();

        res.json({ mensaje: "Producto eliminado del carrito", carrito: usuario.carrito });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRoute.delete("/carrito/:userId/vaciar", async (req, res) => {
    try {
        const { userId } = req.params;

        const usuario = await Usuarios.findById(userId);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        usuario.carrito = [];
        await usuario.save();

        res.json({ mensaje: "Carrito vaciado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRoute.post("/carrito/:userId/comprar", async (req, res) => {
    try {
        const { userId } = req.params;

        const usuario = await Usuarios.findById(userId).populate("carrito.producto");
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (usuario.carrito.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        const nuevaOrden = new Orden({
            usuario: userId,
            productos: usuario.carrito,
            total: usuario.carrito.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)
        });

        await nuevaOrden.save();
        usuario.carrito = []; // Vaciar carrito después de la compra
        await usuario.save();

        res.json({ mensaje: "Compra realizada con éxito", orden: nuevaOrden });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//>>/ Agregar producto al carrito /<<

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

productRoute.get("/filtrado", async (req, res) => {
    try {
        const { section } = req.query;

        // Define los campos que no quieres enviar para cada categoría
        const excludeFields = {
            Vasos: ["peso", "sabores"], // Campos a excluir para 'Vasos'
            Suplementos: [] // Por ahora, no excluye nada en 'Suplementos'
        };

        // Obtén los campos a excluir según la categoría
        const fieldsToExclude = excludeFields[section] || [];

        // Genera la proyección para Mongoose
        const projection = fieldsToExclude.reduce((acc, field) => {
            acc[field] = 0; // 0 significa excluir el campo
            return acc;
        }, {});

        // Filtra por categoría y aplica la proyección
        const query = section ? { categoria: section } : {};
        const productos = await Producto.find(query).select(projection);

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
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

        // Usa $pull para eliminar el valor específico del arreglo
        const resultado = await SubCategorias.updateOne(
            {}, // Aquí puedes agregar un filtro para encontrar el documento que contiene el arreglo (si es necesario).
            { $pull: { nombreSubCategoria: nombreSubCategoria } } // $pull elimina el valor específico del arreglo
        );

        // Verifica si se realizó alguna modificación
        if (resultado.modifiedCount === 0) {
            return res.status(404).json({ error: 'SubCategoría no encontrada o ya eliminada.' });
        }

        res.status(200).json({ message: 'SubCategoría eliminada con éxito.', nombreSubCategoria });
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

productRoute.get('/filter/color', async (req, res) => {
    const colores = req.query.colores?.split(',').map(c => c.trim()) || []; // Obtener colores seleccionados
    try {
        let productos;
        if (colores.length > 0) {
            // Filtrar por colores
            productos = await Producto.find({ color: { $in: colores } });
        } else {
            // Traer todos los productos si no hay colores seleccionados
            productos = await Producto.find();
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

productRoute.get('/filter/sabor', async (req, res) => {
    const sabor = req.query.sabores?.split(',').map(c => c.trim()) || []; // Obtener colores seleccionados
    try {
        let productos;
        if (sabor.length > 0) {
            // Filtrar por colores
            productos = await Producto.find({ sabores: { $in: sabor } });
        } else {
            // Traer todos los productos si no hay colores seleccionados
            productos = await Producto.find();
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

productRoute.get('/filter/peso', async (req, res) => {
    const pesos = req.query.pesos?.split(',').map(c => c.trim()) || []; // Obtener colores seleccionados
    try {
        let productos;
        if (pesos.length > 0) {
            // Filtrar por colores
            productos = await Producto.find({ peso: { $in: pesos } });
        } else {
            // Traer todos los productos si no hay colores seleccionados
            productos = await Producto.find();
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

productRoute.get('/filter/tam', async (req, res) => {
    const size = req.query.size?.split(',').map(c => c.trim()) || []; // Obtener colores seleccionados
    try {
        let productos;
        if (size.length > 0) {
            // Filtrar por colores
            productos = await Producto.find({ tamaño: { $in: size } });
        } else {
            // Traer todos los productos si no hay colores seleccionados
            productos = await Producto.find();
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

productRoute.get('/filter/marca', async (req, res) => {
    const marcas = req.query.marcas?.split(',').map(c => c.trim()) || []; // Obtener colores seleccionados
    try {
        let productos;
        if (marcas.length > 0) {
            // Filtrar por colores
            productos = await Producto.find({ marca: { $in: marcas } });
        } else {
            // Traer todos los productos si no hay colores seleccionados
            productos = await Producto.find();
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos', error });
    }
});

module.exports = productRoute;