const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let userSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es reuqerido'] },
    correo: { type: String, required: [true, 'El correo es requerio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE' },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', userSchema);