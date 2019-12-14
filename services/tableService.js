const tableModel = require('../models/table')

class TableService {
    constructor(){
        //TODO:
    }

    getTableById(id) {
        return tableModel.findById({
            _id: id 
        })
    }

    getListTable() {
        return tableModel.find().sort({_id:-1})
    }

    createTable(table) {
        return tableModel.create(table)
    }
}

module.exports = TableService