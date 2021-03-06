require('./config/config')

const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(cors())
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')))

app.use(require('./routes/index'))

mongoose
    .connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log(`Conexion establecida al servidor de MongoDB: ${process.env.URL_DB}`))
    .catch(error => console.log(`Error de conexion al servidor de MongoDB ${error.message}`));

app.listen(process.env.PORT, () => {
    console.log(`Puerto ${process.env.PORT}`);
})