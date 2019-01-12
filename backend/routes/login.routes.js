var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var clave_secreta = require('../config/config').secreta;

// Inicializar variables
var app = express();

// Importar modelo
var Usuario = require('../models/usuario');

// =====================================
// Login del usuario
// =====================================
app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al buscar el usuario en BD.', errors: err }); }

        // Verificar usuario
        if (!usuario) {
            return res.status(400).json({ status: 'error', mensaje: 'Error al buscar el usuario.' });
        }

        // Verificar la contraseña
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({ status: 'error', mensaje: 'Error al confrontar la credencial.', errors: 'Error al confrontar la credencial.' });
        }

        // Quitar contraseña de objeto de salida.
        usuario.password = undefined;

        // Crear token: objeto, contraseña secreta general de encriptación, tiempo de expiración en sg.
        var token = jwt.sign({ usuario: usuario }, clave_secreta, { expiresIn: 1440 });

        res.status(200).json({ status: 'success', usuario, token });
    })
});

module.exports = app;