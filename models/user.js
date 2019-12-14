const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new Schema({
      username: String,
      password: String,
      status: {type: Number, default: 1},
      point: Number
    });
const UserModel = mongoose.model('user', User);

module.exports = UserModel