const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let roleValids = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema;

let userSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    correo: { type: String, required: [true, 'El correo es requerio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: roleValids },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', userSchema);