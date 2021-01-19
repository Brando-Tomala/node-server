const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

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



const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log("payload: " + payload);
    const data = {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }
    return data;
}

app.post('/google', async(req, res) => {
    let token = req.body.token;
    console.log("Token: " + token);
    console.log("Variable: " + process.env.CLIENT_ID);
    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        })
    });


    Usuario.findOne({ correo: googleUser.correo }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe autenticarse de la manera normal"
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            }
        } else {
            let user = new Usuario();
            user.nombre = googleUser.nombre;
            user.correo = googleUser.correo;
            user.img = googleUser.img;
            user.google = true;
            user.password = bcrypt.hashSync(':::***', 10);
            user.save((err, userS) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario: userS
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: userS,
                    token
                });
            })
        }
    })
});





module.exports = app