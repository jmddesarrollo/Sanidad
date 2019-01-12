var express = require('express');

var mdwAutentificacion = require('../middlewares/autentificacion');

// Inicializar variables
var app = express();

// Importar modelo
var Medico = require('../models/medico');

// =====================================
// Consultar todos los registros
// =====================================
app.get('/', (req, res, next) => {
    Medico.find({}).populate('usuario', 'nombre email rol').populate('hospital').exec(
        (err, medicos) => {
            if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar medicos.', errors: err }); }

            res.status(200).json({ status: 'success', medicos });
        });
});

// =====================================
// Crear nuevo registro con middleware
// =====================================
app.post('/', mdwAutentificacion.verificarToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoSave) => {
        if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al crear médico.', errors: err }); }

        res.status(200).json({ status: 'success', medicoSave, usuarioToken: req.usuario });
    });
});

// =====================================
// Actualizar un registro
// =====================================
app.put('/:id', mdwAutentificacion.verificarToken, (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al consultar el médico.', errors: err }); }

        if (!medico) { return res.status(400).json({ status: 'error', mensaje: 'El médico no existe.', errors: 'El médico no existe.' }); }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;

        medico.save((err, medicoUpdated) => {
            if (err) { return res.status(400).json({ status: 'error', mensaje: 'Error al modificar el médico.', errors: err }); }

            return res.status(200).json({ status: 'success', medicoUpdated });
        });
    })
});

// =====================================
// Eliminar un registro
// =====================================
app.delete('/:id', mdwAutentificacion.verificarToken, (req, res) => {
    // Funciona si se tiene body parser.
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDel) => {
        if (err) { return res.status(500).json({ status: 'error', mensaje: 'Error al buscar el médico.', errors: err }); }

        if (!medicoDel) { return res.status(400).json({ status: 'error', mensaje: 'El médico no existe.', errors: 'El médico no existe.' }); }

        return res.status(200).json({ status: 'success', medicoDel });
    })
});

module.exports = app;