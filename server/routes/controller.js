const express = require('express')
const app = express()
const Usuario = require('../models/usuario')


app.get('/usuario', (req, res) => {
    res.json('Hello Worldssss')
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.email,
        password: body.password,
        role: body.role
    });

    usuario.save((err, userDB) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }

        res.json({
            ok: true,
            userDB
        })
    })

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    res.json({
        id,
        body
    });
})

module.exports = app