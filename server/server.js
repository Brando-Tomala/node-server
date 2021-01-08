require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()


//parse application / x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
    res.json('Hello World')
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined || body.nombre === "") {
        res.status(400).json({
            code: -1,
            message: 'Campo nombre es invalido'
        })
    } else {
        res.json({
            code: 0,
            data: body,
            message: 'Ok'
        })
    }


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

app.listen(process.env.PORT, () => {
    console.log(`Puerto ${process.env.PORT}`);
})