const express = require('express')
const { OAuth2Client } = require('google-auth-library');
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



const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
}

app.post('/google', (req, res) => {
    let token = req.body.token;
    verify(token);
    return res.json({ token });
});





module.exports = app