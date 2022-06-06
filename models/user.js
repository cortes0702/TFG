//Modelos de las bases de datos
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const {Schema} = mongoose


const users = new Schema({
    username: String,
    email: String,
    password: String
})


users.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}


users.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('users', users)
