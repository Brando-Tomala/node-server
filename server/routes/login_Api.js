const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, userDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!userDB) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: '(Usuario) o contraseña incorrecta'
                    }
                });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario o (contraseña) incorrecta'
                    }
                });
        }

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            usuario: userDB,
            token
        });
    })
});



/**
 * function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
 */
module.exports = app