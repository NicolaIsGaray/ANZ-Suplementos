const express = require("express");
const pageRouter = express.Router();

const Pagina = require("../models/Página");
const Sociales = require("../models/Sociales");

const verifyRole = require ("../middlewares/verifyRole");

//>> EDITAR ENLACES SOCIALES
pageRouter.post('/contacto-telefono', async (req, res) => {
    try {
        const { telefonoInfo } = req.body;
        const telefono = await Sociales.findOneAndUpdate(
            { telefono: telefonoInfo}
        );

        res.status(200).send(telefono);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pageRouter.post('/contacto-instagram', async (req, res) => {
    try {
        const { instagramInfo } = req.body;
        const instagram = await Sociales.findOneAndUpdate(
            { instagram: instagramInfo}
        );

        res.status(200).send(instagram);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pageRouter.post('/contacto-twitter', async (req, res) => {
    try {
        const { twitterInfo } = req.body;
        const twitter = await Sociales.findOneAndUpdate(
            { twitter: twitterInfo}
        );

        res.status(200).send(twitter);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pageRouter.post('/contacto-facebook', async (req, res) => {
    try {
        const { facebookInfo } = req.body;
        const facebook = await Sociales.findOneAndUpdate(
            { facebook: facebookInfo}
        );

        res.status(200).send(facebook);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pageRouter.post('/contacto-youtube', async (req, res) => {
    try {
        const { youtubeInfo } = req.body;
        const youtube = await Sociales.findOneAndUpdate(
            { youtube: youtubeInfo}
        );

        res.status(200).send(youtube);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//>> OBTENER CONTACTOS

pageRouter.get('/telefono', async (req, res) => {
    try {
        const telefono = await Sociales.find({ telefono });

        res.status(200).send(telefono);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pageRouter.get('/contactos', async (req, res) => {
    try {
        const contactos = req.params;
        const sociales = await Sociales.find(contactos);
        res.status(200).send(sociales);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = pageRouter;