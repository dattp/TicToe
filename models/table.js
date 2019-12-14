const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Table = new Schema({
    name: String,
    description: String,
    players: [String],
    room_number: {type: Number, default: 1}
})

const TableModel = mongoose.model('table', Table)

module.exports = TableModel