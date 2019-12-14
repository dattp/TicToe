const _ = require('lodash')
const TableService = require('../services/tableService')
const tableService = new TableService()

let arrTable = [
    {
        id: 1,
        name: 'Table 01',
        players: [],
        next_turn: null,
        status: 0,
        matrix: []
    },
    {
        id: 2,
        name: 'Table 02',
        players: ['user01', 'user02'],
        next_turn: null,
        status: 0,
        matrix: []
    },
    {
        id: 3,
        name: 'Table 03',
        players: [],
        next_turn: null,
        status: 0,
        matrix: []
    },
    {
        id: 4,
        name: 'Table 04',
        players: [],
        next_turn: null,
        status: 0,
        matrix: []
    },
    {
        id: 5,
        name: 'Table 05',
        players: ['user01', 'user02'],
        next_turn: null,
        status: 0,
        matrix: []
    },
    {
        id: 6,
        name: 'Table 06',
        players: ['user01', 'user02'],
        next_turn: null,
        status: 0,
        matrix: []
    }
]

class TableController {
    constructor() {
        //TODO
    }

    getTableById(id) {
        try {
            id = parseInt(id, 10)            
            return _.find(arrTable, { 'id': id })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getTableByPlayer(username) {
        try {
           let table = _.map(arrTable, item => {
               if (_.includes(item.players, username)) {
                   return item
               }
               return null
           })
           return table
        } catch (error) {
            
        }
    }
    addPlayer(tableId, player) {
        tableId = parseInt(tableId, 10)
        let index = _.findIndex(arrTable, {'id' : tableId})
        console.log('=======>index: ', index);
        
        arrTable[index].players.push(player)
    }
    getListTable() {
        try {
            // return tableService.getListTable()
            return arrTable
        } catch (error) {
            console.log(error);
            return []
        }
    }

    removePlayer(roomId, username) {
        roomId = parseInt(roomId, 10)
        let index = _.findIndex(arrTable, {'id' : roomId})                
        _.remove(arrTable[index].players, item => item===username)
        
    }

    createTable(username, name, description) {
        try {
            let table = {
                name: name,
                description: description,
                players: [username]
            }
            return tableService.createTable(table)
        } catch (error) {
            console.log(error);
            return null
        }
    }
}

module.exports = TableController