var express = require('express');

// Inicializar variables
var app = express();
const path = require('path');
const fs = require('fs');

// Get: path, callback, next (para middleware)
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    // Validar tipos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ status: 'warning', mensaje: 'Tipo de colección no reconocido.' });
    }

    // __dirname hace referencia a la ubicación del archivo de este código.
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        return res.sendFile(pathNoImagen);
    }

    // res.status(200).json({ mensaje: 'Get realizado correctamente' });
});

module.exports = app;