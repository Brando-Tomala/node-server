const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app = express()
const Usuario = require('../models/usuario');


app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre correo img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.countDocuments({ estado: true }, (err, count) => {
                return res.json({
                    ok: true,
                    num_registros: count,
                    usuarios: userDB
                })
            })

        });

});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.email,
        password: bcrypt.hashSync(body.password, 10),
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
    let body = _.pick(req.body, ['nombre', 'correo', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });


});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, userRemoved) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }
        if (!userRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: userRemoved
        });
    })
});

app.delete('/usuario/for_status/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
})

module.exports = app