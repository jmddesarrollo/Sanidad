var express = require('express');
var bcrypt = require('bcryptjs');

var mdwAutentificacion = require('../middlewares/autentificacion');

// Inicializar variables
var app = express();

// Importar modelo
var Usuario = require('../models/usuario');

// Get: path, callback, next (para middleware)

// =====================================
// Obtener los usuarios
// =====================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img rol').exec(
        (err, usuarios) => {
            if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar usuarios.', errors: err }); }

            res.status(200).json({ status: 'success', usuarios });
        });
});

// =====================================
// Crear nuevo usuario con middleware
// =====================================
app.post('/', (req, res) => {
    // Funciona si se tiene body parser.
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol
    });

    usuario.save((err, usuarioSave) => {
        if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al crear usuario.', errors: err }); }

        usuarioSave.password = undefined;
        res.status(200).json({ status: 'success', usuarioSave, usuarioToken: req.usuario });
    });
});

// =====================================
// Actualizar un usuario
// =====================================
app.put('/:id', [mdwAutentificacion.verificarToken, mdwAutentificacion.verificarAdminOrEqualUsuario], (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar el usuario.', errors: err }); }

        if (!usuario) { return res.status(400).json({ status: 'error', mensaje: 'El usuario no existe.', errors: 'El usuario no existe.' }); }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;

        usuario.save((err, usuarioUpdated) => {
            if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al modificar el usuario.', errors: err }); }

            usuarioUpdated.password = undefined;
            return res.status(200).json({ status: 'success', usuarioUpdated });
        });
    })
});

// =====================================
// Eliminar un usuario
// =====================================
app.delete('/:id', [mdwAutentificacion.verificarToken, mdwAutentificacion.verificarAdmin], (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDel) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al buscar el usuario.', errors: err }); }

        if (!usuarioDel) { return res.status(400).json({ status: 'error', mensaje: 'El usuario no existe.', errors: 'El usuario no existe.' }); }

        usuarioDel.password = undefined;
        return res.status(200).json({ status: 'success', usuarioDel });
    })
});

module.exports = app;