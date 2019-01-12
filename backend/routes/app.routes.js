var express = require('express');

// Inicializar variables
var app = express();

// Get: path, callback, next (para middleware)
app.get('/', (req, res, next) => {
    res.status(200).json({ mensaje: 'Get realizado correctamente' });
});

module.exports = app;