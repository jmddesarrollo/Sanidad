var express = require('express');

var mdwAutentificacion = require('../middlewares/autentificacion');

// Inicializar variables
var app = express();

// Importar modelo
var Hospital = require('../models/hospital');

// Get: path, callback, next (para middleware)

// =====================================
// Consultar todos los registros
// =====================================
app.get('/', (req, res, next) => {
    Hospital.find({}).populate('usuario', 'nombre email rol').exec(
        (err, hospitales) => {
            if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar hospitales.', errors: err }); }

            res.status(200).json({ status: 'success', hospitales });
        });
});

// =====================================
// Crear nuevo registro con middleware
// =====================================
app.post('/', mdwAutentificacion.verificarToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospitalSave) => {
        if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al crear hospital.', errors: err }); }

        res.status(200).json({ status: 'success', hospitalSave, usuarioToken: req.usuario });
    });
});

// =====================================
// Actualizar un registro
// =====================================
app.put('/:id', mdwAutentificacion.verificarToken, (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar el hospital.', errors: err }); }

        if (!hospital) { return res.status(400).json({ status: 'error', mensaje: 'El hospital no existe.', errors: 'El hospital no existe.' }); }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((err, hospitalUpdated) => {
            if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al modificar el hospital.', errors: err }); }

            return res.status(200).json({ status: 'success', hospitalUpdated });
        });
    })
});

// =====================================
// Eliminar un registro
// =====================================
app.delete('/:id', mdwAutentificacion.verificarToken, (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDel) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al buscar el hospital.', errors: err }); }

        if (!hospitalDel) { return res.status(400).json({ status: 'error', mensaje: 'El hospital no existe.', errors: 'El hospital no existe.' }); }

        return res.status(200).json({ status: 'success', hospitalDel });
    })
});

module.exports = app;