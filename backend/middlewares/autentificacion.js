var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var clave_sereta = require('../config/config').secreta;

// Inicializar variables
var app = express();

// Importar modelo
var Usuario = require('../models/usuario');

// =====================================
// Verificar token - Middleware
// =====================================
exports.verificarToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, clave_sereta, (err, decoded) => {
        if (err) { return res.status(401).json({ status: 'error', mensaje: 'Usuario no autentificado.', errors: err }); }

        req.usuario = decoded.usuario;
        next();
    });
}

// =====================================
// Verificar Administrador - Middleware
// =====================================
exports.verificarAdmin = function(req, res, next) {

    if (req.usuario.rol === "ADMIN_ROLE") {
        next();
        return true;
    } else {
        return res.status(401).json({ status: 'error', mensaje: 'Autorización invalida para la petición.' });
    }
}

// =====================================
// Verificar Administrador - Middleware
// =====================================
exports.verificarAdminOrEqualUsuario = function(req, res, next) {

    // En req.usuario tenemos datos del token traídos del middleware 'verificar token'

    if (req.usuario.rol === "ADMIN_ROLE" || req.usuario._id === req.params.id) {
        next();
        return true;
    } else {
        return res.status(401).json({ status: 'error', mensaje: 'Autorización invalida para la petición.' });
    }
}