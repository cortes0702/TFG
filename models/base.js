//Modelos de las bases de datos
const mongoose = require('mongoose')
const {Schema} = mongoose

//creamos el modelo de la base de datos
const data = new Schema({
    command: String,
    text: String
})

//exportamos la base de datos
module.exports = mongoose.model('data', data)