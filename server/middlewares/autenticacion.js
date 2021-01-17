const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoder) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }
        req.usuario = decoder.usuario;

        return next();
    });

}


let verifyRoleAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario no permitido'
            }
        })
    }
    return next();

}

module.exports = {
    verificaToken,
    verifyRoleAdmin
}