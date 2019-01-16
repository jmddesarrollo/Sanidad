var express = require('express');

// Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Búsqueda por colección.
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    // Expresión regular para no distinguir mayúsculas de minúsculas
    var regex = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(200).json({ status: 'success', mensaje: 'Los tipos de búsqueda son: usuarios, médicos y hospitales.' });
    }

    promesa.then(data => {
        return res.status(200).json({ status: 'success', [tabla]: data });
    });
});

// Búsqueda general
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    // Expresión regular para no distinguir mayúsculas de minúsculas
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            return res.status(200).json({
                status: 'success',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email rol').exec((err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }).populate('usuario', 'nombre email rol').populate('hospital').exec((err, medicos) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email rol').or([{ 'nombre': regex }, { 'email': regex }]).exec((err, usuarios) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;