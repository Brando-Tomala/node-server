const express = require('express')
const app = express()

app.use(require('./usuario_Api'))
app.use(require('./login_Api'))

module.exports = app;