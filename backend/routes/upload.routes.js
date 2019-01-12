const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');
const fs = require('fs');

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', function(req, res, next) {
    // Recoger variables desde url
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validar que se recoge archivo.
    if (!req.files)
        return res.status(400).json({ status: 'warning', mensaje: 'Debe seleccionar un archivo.' });

    // Obtener nombre y extensión del archivo.
    var archivo = req.files.archivo;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar tipos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ status: 'warning', mensaje: 'Tipo de colección no reconocido.' });
    }

    // Validar que es una imagen.
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({ status: 'warning', mensaje: 'Formato de imagen no reconocido. ' });
    }

    // Nombre de archivo personalizado (id usuario - random . ext)
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover archivo a ubicación
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err)
            return res.status(500).json({ status: 'error', mensaje: 'Error al copiar la imagen. ' });
    });

    subirPorTipo(tipo, id, nombreArchivo, res);
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                if (err)
                    return res.status(500).json({ status: 'error', mensaje: 'Error al buscar usuario. ' });
                if (!usuario)
                    return res.status(400).json({ status: 'warning', mensaje: 'Usuario no encontrado.' });

                var pathViejo = './uploads/usuarios/' + usuario.img;
                // Si existe elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                usuario.img = nombreArchivo;
                usuario.save((err, usuarioSave) => {
                    if (err)
                        return res.status(500).json({ status: 'error', mensaje: 'Error al guardar imagen al usuario en base de datos. ' });

                    usuario.password = undefined;
                    return res.status(200).json({ status: 'success', mensaje: 'Imagen actualizada', usuario: usuarioSave });
                });
            });
            break;

        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (err)
                    return res.status(500).json({ status: 'error', mensaje: 'Error al buscar hospital. ' });
                if (!hospital)
                    return res.status(400).json({ status: 'warning', mensaje: 'Hospital no encontrado.' });

                var pathViejo = './uploads/hospitales/' + hospital.img;
                // Si existe elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                hospital.img = nombreArchivo;
                hospital.save((err, hospitalSave) => {
                    if (err)
                        return res.status(500).json({ status: 'error', mensaje: 'Error al guardar imagen al hospital en base de datos. ' });

                    return res.status(200).json({ status: 'success', mensaje: 'Imagen actualizada', hospital: hospitalSave });
                });
            });
            break;

        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (err)
                    return res.status(500).json({ status: 'error', mensaje: 'Error al buscar médico. ' });
                if (!medico)
                    return res.status(400).json({ status: 'warning', mensaje: 'Médico no encontrado.' });

                var pathViejo = './uploads/medicos/' + medico.img;
                // Si existe elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                medico.img = nombreArchivo;
                medico.save((err, medicoSave) => {
                    if (err)
                        return res.status(500).json({ status: 'error', mensaje: 'Error al guardar imagen del médico en base de datos. ' });

                    return res.status(200).json({ status: 'success', mensaje: 'Imagen actualizada', medico: medicoSave });
                });
            });
            break;
    }


}

// Get: path, callback, next (para middleware)
app.get('/', (req, res, next) => {
    res.status(200).json({ mensaje: 'Get realizado correctamente' });
});

module.exports = app;